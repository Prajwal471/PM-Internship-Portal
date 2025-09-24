import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

function hasValidGeminiKey() {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return false;
  if (/your_gemini_api_key_here/i.test(key)) return false;
  return true;
}

// Fallback question bank for when AI is not available
const fallbackQuestions = {
  'Communication': {
    question: 'Which of the following is most important for effective written communication?',
    options: ['Using complex vocabulary', 'Being clear and concise', 'Writing long sentences', 'Using technical jargon'],
    correctAnswer: 1
  },
  'Programming': {
    question: 'What is a variable in programming?',
    options: ['A fixed value', 'A storage location with a name', 'A type of loop', 'A programming language'],
    correctAnswer: 1
  },
  'JavaScript': {
    question: 'Which of the following is used to declare a variable in JavaScript?',
    options: ['var', 'let', 'const', 'All of the above'],
    correctAnswer: 3
  },
  'Python': {
    question: 'Which symbol is used for comments in Python?',
    options: ['//', '/* */', '#', '<!-- -->'],
    correctAnswer: 2
  },
  'Problem Solving': {
    question: 'What is the first step in problem-solving?',
    options: ['Implementing solutions', 'Defining the problem clearly', 'Brainstorming ideas', 'Getting approval'],
    correctAnswer: 1
  },
  'Leadership': {
    question: 'What is the most important quality of a good leader?',
    options: ['Being authoritative', 'Active listening', 'Making all decisions alone', 'Avoiding feedback'],
    correctAnswer: 1
  },
  'Teamwork': {
    question: 'Which behavior best demonstrates good teamwork?',
    options: ['Working independently', 'Sharing knowledge and resources', 'Competing with teammates', 'Taking all the credit'],
    correctAnswer: 1
  },
  'Time Management': {
    question: 'What is the most effective way to prioritize tasks?',
    options: ['Do easy tasks first', 'Use urgent vs important matrix', 'Work randomly', 'Do everything at once'],
    correctAnswer: 1
  },
  'Microsoft Office': {
    question: 'Which Microsoft Office application is best for creating spreadsheets?',
    options: ['Word', 'Excel', 'PowerPoint', 'Outlook'],
    correctAnswer: 1
  },
  'Data Analysis': {
    question: 'What is the first step in data analysis?',
    options: ['Creating charts', 'Understanding the data', 'Making conclusions', 'Presenting results'],
    correctAnswer: 1
  },
  'Web Development': {
    question: 'Which language is primarily used for styling web pages?',
    options: ['HTML', 'CSS', 'JavaScript', 'Python'],
    correctAnswer: 1
  },
  'Customer Service': {
    question: 'What is the most important aspect of good customer service?',
    options: ['Being fast', 'Being friendly', 'Understanding customer needs', 'Following scripts'],
    correctAnswer: 2
  },
  'Social Media': {
    question: 'What is engagement rate in social media?',
    options: ['Number of followers', 'Ratio of interactions to followers', 'Number of posts', 'Account age'],
    correctAnswer: 1
  },
  'Marketing': {
    question: 'What does the 4 Ps of marketing include?',
    options: ['Product, Price, Place, Promotion', 'People, Process, Physical, Performance', 'Plan, Prepare, Present, Perform', 'Predict, Produce, Perform, Profit'],
    correctAnswer: 0
  },
  'Sales': {
    question: 'What is the most important skill in sales?',
    options: ['Talking fast', 'Listening to customer needs', 'Being pushy', 'Knowing all features'],
    correctAnswer: 1
  },
  'Research': {
    question: 'What is the first step in conducting research?',
    options: ['Collecting data', 'Defining research questions', 'Analyzing results', 'Writing reports'],
    correctAnswer: 1
  },
  'Writing': {
    question: 'What makes writing clear and effective?',
    options: ['Using big words', 'Simple and direct language', 'Long paragraphs', 'Technical jargon'],
    correctAnswer: 1
  },
  'Public Speaking': {
    question: 'What is the most important aspect of public speaking?',
    options: ['Speaking loudly', 'Knowing your audience', 'Using fancy slides', 'Memorizing everything'],
    correctAnswer: 1
  },
  'Project Management': {
    question: 'What is a project milestone?',
    options: ['The project budget', 'A significant checkpoint', 'Team member role', 'Project risk'],
    correctAnswer: 1
  },
  'Financial Analysis': {
    question: 'What does ROI stand for?',
    options: ['Rate of Interest', 'Return on Investment', 'Risk of Inflation', 'Revenue over Income'],
    correctAnswer: 1
  }
};

// Function to get fallback questions
function getFallbackQuestions(userSkills: string[]) {
  const availableSkills = Object.keys(fallbackQuestions);
  const matchingSkills = userSkills.filter((skill: string) => availableSkills.includes(skill));
  
  // Use matching skills first, then fill with random available skills
  const skillsToUse = [...matchingSkills];
  
  // If we need more skills, add random ones from available skills
  while (skillsToUse.length < 5) {
    const remainingSkills = availableSkills.filter(skill => !skillsToUse.includes(skill));
    if (remainingSkills.length === 0) break;
    
    const randomSkill = remainingSkills[Math.floor(Math.random() * remainingSkills.length)];
    skillsToUse.push(randomSkill);
  }
  
  // Create questions from selected skills
  const selectedQuestions = [];
  for (let i = 0; i < Math.min(5, skillsToUse.length); i++) {
    const skill = skillsToUse[i];
    const question = fallbackQuestions[skill as keyof typeof fallbackQuestions];
    if (question) {
      selectedQuestions.push({
        ...question,
        skill
      });
    }
  }
  
  // Ensure we have at least 5 questions by repeating if necessary
  while (selectedQuestions.length < 5 && availableSkills.length > 0) {
    const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    const question = fallbackQuestions[randomSkill as keyof typeof fallbackQuestions];
    if (question && !selectedQuestions.some(q => q.skill === randomSkill)) {
      selectedQuestions.push({
        ...question,
        skill: randomSkill
      });
    }
  }
  
  return selectedQuestions.slice(0, 5);
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
    if (!user || !user.skills || user.skills.length === 0) {
      return NextResponse.json(
        { error: 'User profile incomplete. Please complete your profile first.' },
        { status: 400 }
      );
    }

    // Use Gemini AI to generate personalized questions based on user's skills
    if (!hasValidGeminiKey()) {
      // Fallback to static questions when AI is not available
      console.log('Using fallback questions - no AI key available');
      const selectedQuestions = getFallbackQuestions(user.skills);
      
      return NextResponse.json({
        questions: selectedQuestions
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Generate 5 skill verification questions for an internship candidate based on their skills.

Candidate Skills: ${user.skills.join(', ')}
Education Level: ${user.education.level}

For each question, create:
1. A practical, skill-specific question (not too basic, not too advanced)
2. Four multiple choice options (A, B, C, D)
3. The correct answer (0, 1, 2, or 3 for options A, B, C, D)
4. The skill category it tests

Focus on:
- Programming languages if mentioned (JavaScript, Python, Java, etc.)
- Technical skills (Web Development, Data Analysis, etc.)
- Soft skills (Communication, Leadership, etc.)
- Practical application rather than theory

Return ONLY a JSON array in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "skill": "JavaScript"
  }
]

Ensure questions are appropriate for internship level and test real knowledge.`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      
      // Parse AI response
      let generatedQuestions;
      try {
        // Extract JSON from the response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          generatedQuestions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI-generated questions:', parseError);
        // Fall back to static questions
        console.log('Using fallback questions - AI parse error');
        const selectedQuestions = getFallbackQuestions(user.skills);
        
        return NextResponse.json({
          questions: selectedQuestions
        });
      }

      // Validate and clean the generated questions
      const validQuestions = generatedQuestions.filter((q: any) => {
        return q.question && Array.isArray(q.options) && q.options.length === 4 && 
               typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4 && q.skill;
      }).slice(0, 5);

      if (validQuestions.length === 0) {
        console.log('No valid questions generated by AI, using fallback');
        const selectedQuestions = getFallbackQuestions(user.skills);
        return NextResponse.json({
          questions: selectedQuestions
        });
      }

      return NextResponse.json({
        questions: validQuestions
      });

    } catch (aiError) {
      console.error('AI question generation failed:', aiError);
      
      // Final fallback to static questions
      console.log('Using fallback questions - AI error');
      const selectedQuestions = getFallbackQuestions(user.skills);
      
      return NextResponse.json({
        questions: selectedQuestions
      });
    }

  } catch (error) {
    console.error('Questions generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}