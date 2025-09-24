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

// AI-enhanced recommendation function
async function getAIEnhancedRecommendations(user: any, ruleBasedRecommendations: any[]) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Prepare user context
  const userContext = {
    skills: user.skills || [],
    education: {
      level: user.education?.level || 'Not specified',
      field: user.education?.field || 'Not specified',
      institution: user.education?.institution || 'Not specified'
    },
    interestedSectors: user.interestedSectors || [],
    location: {
      state: user.location?.state || 'Not specified',
      city: user.location?.city || 'Not specified'
    },
    skillTestScore: user.skillTestScore || 0,
    experience: user.experience || 'Fresher',
    careerGoals: user.careerGoals || 'Not specified'
  };

  // Create a concise version of internships for AI analysis
  const internshipSummaries = ruleBasedRecommendations.map((rec, index) => ({
    id: index,
    title: rec.title,
    company: rec.company,
    location: rec.location,
    duration: rec.duration,
    stipend: rec.stipend,
    requirements: rec.requirements,
    description: rec.description?.substring(0, 200) + '...',
    ruleBasedScore: rec.matchScore,
    ruleBasedReasons: rec.matchReasons
  }));

  const prompt = `
You are an AI career advisor analyzing internship recommendations for an Indian student.

User Profile:
${JSON.stringify(userContext, null, 2)}

Rule-based Recommendations (with scores):
${JSON.stringify(internshipSummaries, null, 2)}

Your task:
1. Re-rank these internships based on deeper analysis of user fit
2. Provide personalized insights for each recommendation
3. Consider factors like career growth potential, skill development, company culture fit
4. Adjust match scores if needed (40-99 range)
5. Give specific, actionable reasons why each internship is recommended

Return ONLY a JSON array with this exact structure:
[
  {
    "id": 0,
    "adjustedMatchScore": 85,
    "aiInsight": "This role perfectly aligns with your JavaScript skills and offers excellent growth in fintech, which matches your career goals.",
    "personalizedReasons": [
      "Direct match with your JavaScript and React skills",
      "Fintech aligns with your interest in finance sector",
      "Good stepping stone for your career goals"
    ],
    "careerGrowthPotential": "High - emerging fintech sector with learning opportunities",
    "skillDevelopmentOpportunities": ["Advanced React", "Financial APIs", "Team collaboration"]
  }
]

Focus on:
- Genuine career fit and growth potential
- Specific skill matches and development opportunities  
- Industry trends and market demands
- Personal career trajectory alignment
- Practical considerations (location, stipend, duration)

Be honest about both strengths and potential challenges of each opportunity.`;

  const result = await model.generateContent(prompt);
  const aiResponse = result.response.text();

  // Parse AI response
  let aiEnhancements;
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      aiEnhancements = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No valid JSON found in AI response');
    }
  } catch (parseError) {
    console.error('Failed to parse AI enhancements:', parseError);
    throw parseError;
  }

  // Merge AI insights with original recommendations
  const enhancedRecommendations = ruleBasedRecommendations.map((rec, index) => {
    const aiEnhancement = aiEnhancements.find((ai: any) => ai.id === index);
    
    if (aiEnhancement) {
      return {
        ...rec,
        matchScore: aiEnhancement.adjustedMatchScore || rec.matchScore,
        aiInsight: aiEnhancement.aiInsight,
        matchReasons: aiEnhancement.personalizedReasons || rec.matchReasons,
        careerGrowthPotential: aiEnhancement.careerGrowthPotential,
        skillDevelopmentOpportunities: aiEnhancement.skillDevelopmentOpportunities
      };
    }
    
    return {
      ...rec,
      aiInsight: 'AI analysis unavailable for this recommendation.',
      careerGrowthPotential: 'To be evaluated',
      skillDevelopmentOpportunities: ['General skill development']
    };
  });

  // Re-sort by AI-adjusted scores
  return enhancedRecommendations.sort((a, b) => b.matchScore - a.matchScore);
}


export async function GET(_request: NextRequest) {
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

    // Try Gemini AI for enhanced recommendations, fallback to rule-based
    if (hasValidGeminiKey()) {
      try {
        const aiRecommendations = await getAIEnhancedRecommendations(user, recommendations);
        return NextResponse.json({ 
          recommendations: aiRecommendations,
          source: 'ai-enhanced' 
        });
      } catch (aiError) {
        console.error('AI enhancement failed, using rule-based:', aiError);
        // Continue to rule-based fallback below
      }
    }
    
    // Fallback to rule-based recommendations
    return NextResponse.json({ 
      recommendations,
      source: 'rule-based' 
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}