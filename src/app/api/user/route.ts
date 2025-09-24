import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

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
    
    const user = await User.findOne({ email: session.user.email }).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the latest test info if it's within 2 days
    const latestTest = user.testHistory && user.testHistory.length > 0 
      ? user.testHistory[user.testHistory.length - 1] 
      : null;
    
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const shouldShowLatestScore = latestTest && new Date(latestTest.date) >= twoDaysAgo;
    
    return NextResponse.json({
      name: user.name,
      email: user.email,
      age: user.age,
      education: user.education,
      skills: user.skills,
      interestedSectors: user.interestedSectors,
      location: user.location,
      language: user.language,
      profileCompleted: user.profileCompleted,
      skillTestCompleted: user.skillTestCompleted,
      skillTestScore: user.skillTestScore,
      latestTestScore: shouldShowLatestScore ? latestTest.score : null,
      latestTestDate: shouldShowLatestScore ? latestTest.date : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

  } catch (error) {
    console.error('User data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}