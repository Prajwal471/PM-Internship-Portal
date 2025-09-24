import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { skills, interestedSectors, education, location, language } = body;

    if (!Array.isArray(skills) || !Array.isArray(interestedSectors)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const update: any = {
      skills,
      interestedSectors,
      profileCompleted: true,
    };

    if (education) update.education = education;
    if (location) update.location = location;
    if (language) update.language = language;

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      update,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}