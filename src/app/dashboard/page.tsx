'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Recommendation {
  id: string;
  title: string;
  company: string;
  location: {
    state: string;
    district: string;
    city: string;
  };
  duration: string;
  stipend: number;
  description: string;
  requirements: {
    skills: string[];
    education: string[];
    sectors: string[];
  };
  benefits: string[];
  type: string;
  posted: string;
  matchScore: number;
  matchReasons: string[];
  aiInsight: string;
}

const translations = {
  en: {
    title: 'Your Personalized Internship Recommendations',
    welcome: 'Welcome back',
    profile: 'Profile',
    test: 'Skill Test',
    logout: 'Logout',
    loading: 'Loading recommendations...',
    noRecommendations: 'No recommendations available. Please complete your profile and skill test.',
    completeProfile: 'Complete Profile',
    takeTest: 'Take Skill Test',
    matchScore: 'Match Score',
    duration: 'Duration',
    stipend: 'Stipend',
    location: 'Location',
    skills: 'Required Skills',
    whyMatch: 'Why this matches you',
    aiInsight: 'AI Insight',
    applyNow: 'Apply Now',
    learnMore: 'Learn More',
    remote: 'Remote',
    office: 'Office-based',
    hybrid: 'Hybrid',
    monthly: 'per month',
    benefits: 'Benefits',
    error: 'Failed to load recommendations. Please try again.',
    retry: 'Retry',
  },
  hi: {
    title: 'आपके लिए व्यक्तिगत इंटर्नशिप सिफारिशें',
    welcome: 'वापसी पर स्वागत',
    profile: 'प्रोफ़ाइल',
    test: 'कौशल परीक्षा',
    logout: 'लॉगआउट',
    loading: 'सिफारिशें लोड हो रही हैं...',
    noRecommendations: 'कोई सिफारिश उपलब्ध नहीं। कृपया अपनी प्रोफ़ाइल और कौशल परीक्षा पूरी करें।',
    completeProfile: 'प्रोफ़ाइल पूरी करें',
    takeTest: 'कौशल परीक्षा लें',
    matchScore: 'मैच स्कोर',
    duration: 'अवधि',
    stipend: 'वेतन',
    location: 'स्थान',
    skills: 'आवश्यक कौशल',
    whyMatch: 'यह आपसे क्यों मेल खाता है',
    aiInsight: 'एआई अंतर्दृष्टि',
    applyNow: 'अभी आवेदन करें',
    learnMore: 'और जानें',
    remote: 'रिमोट',
    office: 'ऑफिस-आधारित',
    hybrid: 'हाइब्रिड',
    monthly: 'प्रति माह',
    benefits: 'लाभ',
    error: 'सिफारिशें लोड करने में असफल। कृपया पुनः प्रयास करें।',
    retry: 'पुनः प्रयास करें',
  }
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{
    profileCompleted: boolean;
    skillTestCompleted: boolean;
    skillTestScore?: number;
  } | null>(null);
  const [showPrepTips, setShowPrepTips] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchUserData();
      fetchRecommendations();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations');
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Remote')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          {user && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Profile: {user.profileCompleted ? '✅' : '❌'}</span>
              <span>Skill Test: {user.skillTestCompleted ? `✅ ${user.skillTestScore}%` : '❌'}</span>
            </div>
          )}

          {/* Retest suggestion if low score vs claimed skills */}
          {user?.skillTestCompleted && typeof user?.skillTestScore === 'number' && user.skillTestScore < 50 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.3L13.93 4.7a2 2 0 00-3.86 0L3 17.3A2 2 0 005.07 19z" />
                </svg>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Your recent test score seems lower than expected.</p>
                  <p className="text-sm text-yellow-700 mt-1">If this doesn’t reflect your true skills, we recommend revising the topics and taking a retest.</p>
                  <div className="mt-3 space-x-3">
                    <button onClick={() => router.push('/test')} className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700">Retake Skill Test</button>
                    <button onClick={() => setShowPrepTips(true)} className="text-sm text-yellow-700 underline hover:text-yellow-800">Preparation tips</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-x-4">
              {!user?.profileCompleted && (
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {t.completeProfile}
                </button>
              )}
              {!user?.skillTestCompleted && (
                <button
                  onClick={() => router.push('/test')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {t.takeTest}
                </button>
              )}
              <button
                onClick={fetchRecommendations}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                {t.retry}
              </button>
            </div>
          </div>
        )}

        {recommendations.length === 0 && !error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700 mb-4">{t.noRecommendations}</p>
            <div className="space-x-4">
              {!user?.profileCompleted && (
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {t.completeProfile}
                </button>
              )}
              {!user?.skillTestCompleted && (
                <button
                  onClick={() => router.push('/test')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {t.takeTest}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Match Score Badge */}
                <div className="px-6 pt-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(rec.matchScore)}`}>
                    <span className="mr-1">🎯</span>
                    {t.matchScore}: {rec.matchScore}%
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{rec.title}</h3>
                      <p className="text-gray-600 font-medium">{rec.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">₹{rec.stipend.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{t.monthly}</div>
                    </div>
                  </div>

                  {/* Essential info only */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {rec.location.city}, {rec.location.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {rec.duration}
                    </div>
                  </div>

                  {/* Brief description */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{rec.description}</p>

                  {/* Top skills only */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {rec.requirements.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {rec.requirements.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{rec.requirements.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-sm">
                      {t.applyNow}
                    </button>
                    <Link href={`/internship/${rec.id}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm">
                      {t.learnMore}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preparation Tips Modal */}
        {showPrepTips && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Skill Test Preparation Tips</h3>
                <button
                  onClick={() => setShowPrepTips(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* General Tips */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    General Preparation
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      Review your resume and identify your key skills
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      Practice questions related to your field of study
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      Read about current industry trends
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      Ensure stable internet connection for the test
                    </li>
                  </ul>
                </div>

                {/* Subject-specific Tips */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Subject-Specific Areas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Technical Skills</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Programming concepts</li>
                        <li>• Problem-solving methods</li>
                        <li>• Logical reasoning</li>
                        <li>• Basic algorithms</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-900 mb-2">Communication</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Grammar and vocabulary</li>
                        <li>• Reading comprehension</li>
                        <li>• Basic writing skills</li>
                        <li>• Professional etiquette</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-medium text-purple-900 mb-2">Aptitude</h5>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Basic mathematics</li>
                        <li>• Analytical thinking</li>
                        <li>• Pattern recognition</li>
                        <li>• Time management</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-medium text-orange-900 mb-2">General Knowledge</h5>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Current affairs</li>
                        <li>• Basic economics</li>
                        <li>• Government schemes</li>
                        <li>• Industry awareness</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Test Day Tips */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Test Day Guidelines
                  </h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2 mt-1">⚠️</span>
                        <strong>Camera Required:</strong> Keep your face visible throughout the test
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2 mt-1">⚠️</span>
                        <strong>No Tab Switching:</strong> Test will auto-submit if you switch tabs
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2 mt-1">⚠️</span>
                        <strong>No Copy-Paste:</strong> All inputs must be manually typed
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2 mt-1">⚠️</span>
                        <strong>Time Limit:</strong> Complete within the allocated time
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowPrepTips(false);
                      router.push('/test');
                    }}
                    className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                  >
                    Take Skill Test Now
                  </button>
                  <button
                    onClick={() => setShowPrepTips(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}