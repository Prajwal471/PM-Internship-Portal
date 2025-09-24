'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    portalName: 'PM Internship Portal',
    tagline: 'Empowering Indian Youth Through AI-Powered Internship Recommendations',
    quickLinks: 'Quick Links',
    home: 'Home',
    eligibility: 'Eligibility',
    about: 'About PM Scheme',
    aboutText: 'The PM Internship Scheme aims to provide hands-on experience to youth in top companies across India.',
    support: 'Support',
    help: 'Help & FAQ',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    features: 'Features',
    aiRecommendations: 'AI-Powered Recommendations',
    skillAssessment: 'Skill Assessment',
    profileMatching: 'Profile Matching',
    careGuidance: 'Career Guidance',
    connect: 'Connect With Us',
    followUs: 'Follow us for updates',
    copyright: '© 2024 PM Internship Portal. All rights reserved.',
    madeWith: 'Made with ❤️ for Indian Youth',
    governmentScheme: 'Government of India Initiative'
  },
  hi: {
    portalName: 'पीएम इंटर्नशिप पोर्टल',
    tagline: 'एआई-संचालित इंटर्नशिप सिफारिशों के माध्यम से भारतीय युवाओं को सशक्त बनाना',
    quickLinks: 'त्वरित लिंक',
    home: 'होम',
    eligibility: 'पात्रता',
    about: 'पीएम योजना के बारे में',
    aboutText: 'पीएम इंटर्नशिप योजना का उद्देश्य भारत की शीर्ष कंपनियों में युवाओं को व्यावहारिक अनुभव प्रदान करना है।',
    support: 'सहायता',
    help: 'सहायता और FAQ',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    features: 'विशेषताएं',
    aiRecommendations: 'एआई-संचालित सिफारिशें',
    skillAssessment: 'कौशल मूल्यांकन',
    profileMatching: 'प्रोफ़ाइल मैचिंग',
    careGuidance: 'करियर मार्गदर्शन',
    connect: 'हमसे जुड़ें',
    followUs: 'अपडेट के लिए हमें फॉलो करें',
    copyright: '© 2024 पीएम इंटर्नशिप पोर्टल। सभी अधिकार सुरक्षित।',
    madeWith: 'भारतीय युवाओं के लिए ❤️ से बनाया गया',
    governmentScheme: 'भारत सरकार की पहल'
  }
};

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">{t.portalName}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-orange-400 font-medium">{t.governmentScheme}</span>
                  <div className="flex space-x-1">
                    <span className="text-orange-400">🇮🇳</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {t.tagline}
            </p>
            <div className="text-xs text-gray-400">
              {t.madeWith}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {t.eligibility}
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {language === 'en' ? 'Register' : 'रजिस्टर करें'}
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {language === 'en' ? 'Sign In' : 'साइन इन'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.features}</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-gray-300 text-sm">{t.aiRecommendations}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2m-1-4H9m1 4v6m-2-3h4" />
                </svg>
                <span className="text-gray-300 text-sm">{t.skillAssessment}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-300 text-sm">{t.profileMatching}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300 text-sm">{t.careGuidance}</span>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.support}</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {t.help}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {t.contact}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {t.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {t.terms}
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div>
              <h5 className="font-medium mb-2 text-sm">{t.connect}</h5>
              <p className="text-gray-400 text-xs mb-3">{t.followUs}</p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.119.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.753-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              {t.copyright}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Built with Next.js & AI</span>
              <span>•</span>
              <span>Secure & Privacy-First</span>
              <span>•</span>
              <span>India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}