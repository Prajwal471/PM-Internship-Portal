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

    const { answers, questions, autoSubmitted = false, reason = '' } = await request.json();

    if (!Array.isArray(answers) || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Calculate score
    let correctAnswers = 0;
    const testAnswers = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      testAnswers.push({
        question: question.question,
        answer: question.options[userAnswer] || 'No answer',
        isCorrect
      });
    }

    const score = Math.round((correctAnswers / questions.length) * 100);

    // Update user record
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        skillTestCompleted: true,
        skillTestScore: score,
        skillTestAnswers: testAnswers,
        $push: {
          testHistory: {
            date: new Date(),
            score,
            autoSubmitted,
            reason,
            questionsCount: questions.length,
            correctAnswers
          }
        }
      },
      { new: true, upsert: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Test submitted successfully',
      score,
      correctAnswers,
      totalQuestions: questions.length,
      autoSubmitted,
      reason
    });

  } catch (error) {
    console.error('Test submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}