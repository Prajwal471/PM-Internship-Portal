'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const educationLevels = [
  { value: 'diploma', label: { en: 'Diploma', hi: 'डिप्लोमा' } },
  { value: 'pursuing-bachelors', label: { en: 'Pursuing Bachelor\'s Degree', hi: 'स्नातक डिग्री कर रहे हैं' } },
  { value: 'bachelors', label: { en: "Bachelor's Degree", hi: 'स्नातक डिग्री' } },
  { value: 'pursuing-masters', label: { en: 'Pursuing Master\'s Degree', hi: 'मास्टर डिग्री कर रहे हैं' } },
  { value: 'masters', label: { en: "Master's Degree", hi: 'मास्टर डिग्री' } },
  { value: 'phd', label: { en: 'PhD', hi: 'पीएचडी' } },
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

const translations = {
  en: {
    title: 'Register for PM Internship Portal',
    name: 'Full Name',
    email: 'Email',
    password: 'Password',
    age: 'Age',
    education: 'Education Level',
    field: 'Field of Study (Optional)',
    institution: 'Institution (Optional)',
    year: 'Graduation Year (Optional)',
    state: 'State',
    district: 'District (Optional)',
    pincode: 'Pincode (Optional)',
    register: 'Register',
    haveAccount: 'Already have an account?',
    signin: 'Sign In',
    success: 'Registration successful! Please sign in.',
    error: 'Registration failed. Please try again.',
  },
  hi: {
    title: 'पीएम इंटर्नशिप पोर्टल के लिए रजिस्टर करें',
    name: 'पूरा नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    age: 'उम्र',
    education: 'शिक्षा स्तर',
    field: 'अध्ययन क्षेत्र (वैकल्पिक)',
    institution: 'संस्थान (वैकल्पिक)',
    year: 'स्नातक वर्ष (वैकल्पिक)',
    state: 'राज्य',
    district: 'जिला (वैकल्पिक)',
    pincode: 'पिनकोड (वैकल्पिक)',
    register: 'रजिस्टर करें',
    haveAccount: 'पहले से खाता है?',
    signin: 'साइन इन',
    success: 'पंजीकरण सफल! कृपया साइन इन करें।',
    error: 'पंजीकरण असफल। कृपया पुनः प्रयास करें।',
  }
};

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    education: {
      level: '',
      field: '',
      institution: '',
      year: '',
    },
    location: {
      state: '',
      district: '',
      pincode: '',
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const router = useRouter();

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        education: {
          ...formData.education,
          year: formData.education.year ? parseInt(formData.education.year) : undefined,
        },
        language,
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const nestedKey = keys[0] as keyof typeof prev;
        const currentValue = prev[nestedKey];
        return {
          ...prev,
          [keys[0]]: {
            ...(typeof currentValue === 'object' ? currentValue : {}),
            [keys[1]]: value,
          }
        };
      }
      return prev;
    });
  };

  if (success) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4" suppressHydrationWarning>
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.success}</h2>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" suppressHydrationWarning>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.name} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.age}
              </label>
              <input
                type="number"
                min="16"
                max="35"
                value={formData.age}
                onChange={(e) => updateFormData('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.email} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.password} *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.education} *
              </label>
              <select
                value={formData.education.level}
                onChange={(e) => updateFormData('education.level', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              >
                <option value="">Select education level</option>
                {educationLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.field}
              </label>
              <input
                type="text"
                value={formData.education.field}
                onChange={(e) => updateFormData('education.field', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.state} *
              </label>
              <select
                value={formData.location.state}
                onChange={(e) => updateFormData('location.state', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              >
                <option value="">Select state</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.district}
              </label>
              <input
                type="text"
                value={formData.location.district}
                onChange={(e) => updateFormData('location.district', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-gray-900 placeholder:text-gray-500 [-webkit-text-fill-color:theme(colors.gray.900)] [color-scheme:light]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
          >
            {loading ? '...' : t.register}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t.haveAccount}{' '}
            <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-800 font-medium">
              {t.signin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(RegisterPage), { ssr: false });
