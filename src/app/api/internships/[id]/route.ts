import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import User from '../../../../models/User';
import internships from '@/data/internships.json';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const internship = (internships as any[]).find((i) => i.id === id);

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    // Get user data to calculate match reasons and AI insight
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use the same scoring algorithm as recommendations API for consistency
    type ScoreBreakdown = {
      total: number;
      skills: number;
      sectors: number;
      education: number;
      location: number;
      test: number;
      recency: number;
      reasons: string[];
    };

    const norm = (s: string) => s?.toLowerCase().trim();

    const educationSatisfies = (required: string[], userLevel: string) => {
      const req = new Set(required.map(norm));
      const u = norm(userLevel);
      if (req.has(u)) return true;
      // Allow pursuing-bachelors to satisfy bachelors
      if (u === 'pursuing-bachelors' && (req.has('bachelors') || req.has('bachelor\'s') || req.has("bachelor's degree"))) return true;
      return false;
    };

    const computeScore = (internship: any): ScoreBreakdown => {
      const reasons: string[] = [];

      const userSkills: string[] = (user.skills || []).map(norm);
      const reqSkills: string[] = (internship.requirements?.skills || []).map(norm);
      const userSectors: string[] = (user.interestedSectors || []).map(norm);
      const reqSectors: string[] = (internship.requirements?.sectors || []).map(norm);

      // Skills overlap score (0-50)
      const matchedSkills = userSkills.filter(s => reqSkills.some(r => r?.includes(s)));
      const skillOverlapRatio = reqSkills.length ? matchedSkills.length / reqSkills.length : 0;
      const skillsScore = Math.min(50, Math.round(50 * skillOverlapRatio));
      if (matchedSkills.length > 0) reasons.push(`Skills match: ${matchedSkills.slice(0, 4).join(', ')}`);

      // Sector overlap score (0-15)
      const matchedSectors = userSectors.filter(s => reqSectors.includes(s));
      const sectorOverlapRatio = reqSectors.length ? matchedSectors.length / reqSectors.length : 0;
      const sectorsScore = Math.min(15, Math.round(15 * sectorOverlapRatio));
      if (matchedSectors.length > 0) reasons.push(`Sector fit: ${matchedSectors.join(', ')}`);

      // Education score (0-15)
      const eduMatch = educationSatisfies(internship.requirements?.education || [], user.education?.level || '');
      const educationScore = eduMatch ? 15 : 0;
      if (eduMatch) reasons.push('Education requirement met');

      // Location score (0-10)
      let locationScore = 0;
      if (norm(internship.location?.state) === norm(user.location?.state)) {
        locationScore += 10;
        reasons.push('Preferred state');
      }

      // Test score relevance (0-10)
      const testFactor = Math.max(0, Math.min(100, user.skillTestScore || 0)) / 100;
      // Reward if many skill overlaps
      const testScore = Math.round(10 * testFactor * (matchedSkills.length > 0 ? 1 : 0.4));
      if (testScore >= 6) reasons.push(`Good test score (${user.skillTestScore}%)`);

      // Recency (0-5)
      let recencyScore = 0;
      try {
        const posted = new Date(internship.posted);
        const days = (Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24);
        // 0-5 points: <7d:5, <14d:4, <30d:3, <60d:2, else:1
        if (days <= 7) recencyScore = 5; else if (days <= 14) recencyScore = 4; else if (days <= 30) recencyScore = 3; else if (days <= 60) recencyScore = 2; else recencyScore = 1;
      } catch {}

      const total = skillsScore + sectorsScore + educationScore + locationScore + testScore + recencyScore;

      return { total, skills: skillsScore, sectors: sectorsScore, education: educationScore, location: locationScore, test: testScore, recency: recencyScore, reasons };
    };

    const breakdown = computeScore(internship);
    const matchScore = Math.min(99, Math.max(40, breakdown.total));
    const matchReasons = breakdown.reasons.slice(0, 5); // Show up to 5 reasons on detail page

    // Generate AI insight based on the actual scoring
    const aiInsight = `Based on your profile analysis (Skills: ${breakdown.skills}/50, Sectors: ${breakdown.sectors}/15, Education: ${breakdown.education}/15, Location: ${breakdown.location}/10, Test: ${breakdown.test}/10), this ${internship.duration} ${internship.type.toLowerCase()} internship at ${internship.company} offers ${matchScore >= 80 ? 'excellent' : matchScore >= 60 ? 'good' : 'moderate'} growth opportunities for your career development.`;

    return NextResponse.json({
      ...internship,
      matchScore,
      matchReasons,
      aiInsight,
      scoreBreakdown: {
        skills: breakdown.skills,
        sectors: breakdown.sectors,
        education: breakdown.education,
        location: breakdown.location,
        test: breakdown.test,
        recency: breakdown.recency
      }
    });

  } catch (error) {
    console.error('Internship fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
