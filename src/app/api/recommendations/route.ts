import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import internshipsData from '@/data/internships.json';

function hasValidGeminiKey() {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return false;
  if (/your_gemini_api_key_here/i.test(key)) return false;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.profileCompleted || !user.skillTestCompleted) {
      return NextResponse.json(
        { error: 'Please complete your profile and skill test first' },
        { status: 400 }
      );
    }

    // ---------- Rule-based (ML-light) ranking ----------
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
      const eduMatch = educationSatisfies(internship.requirements?.education || [], user.education.level);
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

    // Score all internships then pick top 3-5
    const scored = (internshipsData as any[]).map((it) => {
      const breakdown = computeScore(it);
      return { internship: it, breakdown };
    })
    .sort((a, b) => b.breakdown.total - a.breakdown.total);

    const top = scored.slice(0, 5).filter(x => x.breakdown.total >= 30); // keep relevant ones only
    const recommendations = (top.length ? top : scored.slice(0, 5)).map((x) => ({
      ...x.internship,
      matchScore: Math.min(99, Math.max(40, x.breakdown.total)),
      matchReasons: x.breakdown.reasons.slice(0, 3),
      aiInsight: 'Rule-based match using your skills, sectors, education, location, test score, and recency.'
    }));

    // Always return rule-based model (ML-light). Gemini can be layered later for explanations.
    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}