'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Sign In to PM Internship Portal',
    email: 'Email',
    password: 'Password',
    signin: 'Sign In',
    register: 'Register',
    noAccount: "Don't have an account?",
    error: 'Sign in failed. Please check your credentials.',
  },
  hi: {
    title: 'पीएम इंटर्नशिप पोर्टल में साइन इन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    signin: 'साइन इन',
    register: 'रजिस्टर करें',
    noAccount: 'कोई खाता नहीं है?',
    error: 'साइन इन असफल। कृपया अपनी जानकारी जांचें।',
  }
};

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const router = useRouter();

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.error);
      } else {
        router.push('/');
      }
    } catch (_err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4" suppressHydrationWarning>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-sm text-orange-600 hover:text-orange-800 font-medium"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
          >
            {loading ? '...' : t.signin}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t.noAccount}{' '}
            <Link href="/auth/register" className="text-orange-600 hover:text-orange-800 font-medium">
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SignInPage), { ssr: false });
