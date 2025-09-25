'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

interface UserData {
  name?: string;
  email?: string;
  profileCompleted: boolean;
  skillTestCompleted: boolean;
  skillTestScore?: number;
  latestTestScore?: number | null;
  latestTestDate?: string | null;
  recommendationsCount?: number;
}

const translations = {
  en: {
    welcome: 'Welcome to PM Internship Portal',
    subtitle: 'Your personalized dashboard for finding the perfect internship opportunity',
    quickActions: 'Quick Actions',
    overview: 'Your Progress',
    profile: 'Complete Profile',
    profileDesc: 'Tell us about your skills and interests',
    skillTest: 'Take Skill Test',
    skillTestDesc: 'Verify your abilities with our assessment',
    recommendations: 'View Recommendations',
    recommendationsDesc: 'See personalized internship matches',
    eligibility: 'Check Eligibility',
    eligibilityDesc: 'Verify PM Internship requirements',
    profileStatus: 'Profile',
    testStatus: 'Skill Test',
    completed: 'Completed',
    pending: 'Pending',
    score: 'Score',
    latestScore: 'Latest Score',
    availableRecommendations: 'Available Recommendations',
    getStarted: 'Get Started',
    continue: 'Continue',
    loading: 'Loading...',
  },
  hi: {
    welcome: 'पीएम इंटर्नशिप पोर्टल में आपका स्वागत है',
    subtitle: 'सही इंटर्नशिप अवसर खोजने के लिए आपका व्यक्तिगत डैशबोर्ड',
    quickActions: 'त्वरित कार्य',
    overview: 'आपकी प्रगति',
    profile: 'प्रोफ़ाइल पूरी करें',
    profileDesc: 'हमें अपने कौशल और रुचियों के बारे में बताएं',
    skillTest: 'कौशल परीक्षा लें',
    skillTestDesc: 'हमारे मूल्यांकन के साथ अपनी क्षमताओं को सत्यापित करें',
    recommendations: 'सिफारिशें देखें',
    recommendationsDesc: 'व्यक्तिगत इंटर्नशिप मैच देखें',
    eligibility: 'पात्रता जांचें',
    eligibilityDesc: 'पीएम इंटर्नशिप आवश्यकताओं को सत्यापित करें',
    profileStatus: 'प्रोफ़ाइल',
    testStatus: 'कौशल परीक्षा',
    completed: 'पूर्ण',
    pending: 'लंबित',
    score: 'स्कोर',
    latestScore: 'नवीनतम स्कोर',
    availableRecommendations: 'उपलब्ध सिफारिशें',
    getStarted: 'शुरू करें',
    continue: 'जारी रखें',
    loading: 'लोड हो रहा है...',
  }
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Show landing page for unauthenticated users
      setLoading(false);
    } else if (status === 'authenticated') {
      // Load user data for authenticated users
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          profileCompleted: data.profileCompleted || false,
          skillTestCompleted: data.skillTestCompleted || false,
          skillTestScore: data.skillTestScore,
          latestTestScore: data.latestTestScore,
          latestTestDate: data.latestTestDate,
          recommendationsCount: 0 // We'll fetch this separately if needed
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">{t.loading}</div>
      </div>
    );
  }

  // Show authenticated home page for logged-in users
  if (session && userData) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.welcome}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.overview}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Status */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  userData.profileCompleted ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {userData.profileCompleted ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.profileStatus}</h3>
                  <p className={`text-sm ${
                    userData.profileCompleted ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {userData.profileCompleted ? t.completed : t.pending}
                  </p>
                </div>
              </div>

              {/* Skill Test Status */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  userData.skillTestCompleted ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {userData.skillTestCompleted ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2m-1-4H9m1 4v6m-2-3h4" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.testStatus}</h3>
                  <p className={`text-sm ${
                    userData.skillTestCompleted ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {userData.skillTestCompleted 
                      ? userData.latestTestScore !== null 
                        ? `${t.latestScore}: ${userData.latestTestScore}%`
                        : `${t.completed} - ${t.score}: ${userData.skillTestScore}%`
                      : t.pending
                    }
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.availableRecommendations}</h3>
                  <p className="text-sm text-orange-600">
                    {userData.profileCompleted && userData.skillTestCompleted ? '5+' : '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.quickActions}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Complete Profile */}
              <Link href="/profile" className="group">
                <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.profile}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t.profileDesc}</p>
                  <span className={`text-sm font-medium ${
                    userData.profileCompleted ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {userData.profileCompleted ? t.completed : t.getStarted}
                  </span>
                </div>
              </Link>

              {/* Take Skill Test */}
              <Link href="/test" className="group">
                <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2m-1-4H9m1 4v6m-2-3h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.skillTest}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t.skillTestDesc}</p>
                  <span className={`text-sm font-medium ${
                    userData.skillTestCompleted ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {userData.skillTestCompleted 
                      ? userData.latestTestScore !== null 
                        ? `${t.latestScore}: ${userData.latestTestScore}%`
                        : `${t.completed} (${userData.skillTestScore}%)`
                      : t.getStarted
                    }
                  </span>
                </div>
              </Link>

              {/* View Recommendations */}
              <Link href="/dashboard" className="group">
                <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.recommendations}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t.recommendationsDesc}</p>
                  <span className="text-sm font-medium text-orange-600">
                    {userData.profileCompleted && userData.skillTestCompleted ? t.continue : t.getStarted}
                  </span>
                </div>
              </Link>

              {/* Check Eligibility */}
              <Link href="/eligibility" className="group">
                <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.eligibility}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t.eligibilityDesc}</p>
                  <span className="text-sm font-medium text-orange-600">{t.continue}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            PM Internship Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered internship recommendations tailored for Indian youth. 
            Find the perfect opportunity that matches your skills and aspirations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Profile</h3>
                <p className="text-sm text-gray-600">Tell us about your education, skills, and interests</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Take Assessment</h3>
                <p className="text-sm text-gray-600">Complete a skill verification test to validate your abilities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Get Recommendations</h3>
                <p className="text-sm text-gray-600">Receive personalized internship matches powered by AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Link
            href="/eligibility"
            className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium text-lg mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check Eligibility Criteria
          </Link>
        </div>

        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <Link
            href="/auth/register"
            className="block md:inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Get Started - Register Now
          </Link>
          <Link
            href="/auth/signin"
            className="block md:inline-block border border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Already have an account? Sign In
          </Link>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          <p>Built for the PM Internship Scheme • Empowering Indian Youth</p>
        </div>
      </div>
    </div>
  );
}
