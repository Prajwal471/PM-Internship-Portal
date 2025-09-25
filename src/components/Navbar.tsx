'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    profile: 'Profile',
    test: 'Skill Test',
    signin: 'Sign In',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Welcome',
  },
  hi: {
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफ़ाइल',
    test: 'कौशल परीक्षा',
    signin: 'साइन इन',
    register: 'रजिस्टर करें',
    logout: 'लॉगआउट',
    welcome: 'स्वागत',
  }
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[language];
  const isAuthed = status === 'authenticated';

  // Don't show navbar on auth pages only
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  // Avoid flicker: show a white placeholder navbar while loading to prevent black flash
  if (status === 'loading') {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </nav>
        <div className="h-16" />
      </>
    );
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Navigation links based on authentication status
  const orderedLinks: { href: string; label: string; icon: string }[] = [];
  
  // Always include Home as first item
  orderedLinks.push({ href: '/', label: t.home, icon: '🏠' });
  
  if (isAuthed) {
    // Authenticated users get full navigation
    orderedLinks.push({ href: '/dashboard', label: t.dashboard, icon: '📊' });
    orderedLinks.push({ href: '/eligibility', label: language === 'en' ? 'Eligibility' : 'पात्रता', icon: '📋' });
    orderedLinks.push(
      { href: '/test', label: t.test, icon: '📝' },
      { href: '/profile', label: t.profile, icon: '👤' },
    );
  } else {
    // Unauthenticated users get limited navigation
    orderedLinks.push({ href: '/eligibility', label: language === 'en' ? 'Eligibility' : 'पात्रता', icon: '📋' });
  }

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              {/* Minimalistic 'government-style' emblem: Ashoka Chakra-like icon + tricolor stripe */}
              <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-700 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-700" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  {/* spokes (12 for simplicity) */}
                  <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
                  <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" strokeWidth="1" />
                  <line x1="3" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1" />
                  <line x1="18" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" />
                  <line x1="5.636" y1="5.636" x2="7.757" y2="7.757" stroke="currentColor" strokeWidth="1" />
                  <line x1="16.243" y1="16.243" x2="18.364" y2="18.364" stroke="currentColor" strokeWidth="1" />
                  <line x1="5.636" y1="18.364" x2="7.757" y2="16.243" stroke="currentColor" strokeWidth="1" />
                  <line x1="16.243" y1="7.757" x2="18.364" y2="5.636" stroke="currentColor" strokeWidth="1" />
                  <line x1="8.5" y1="3.8" x2="9.6" y2="6.5" stroke="currentColor" strokeWidth="1" />
                  <line x1="15.5" y1="20.2" x2="14.4" y2="17.5" stroke="currentColor" strokeWidth="1" />
                  <line x1="3.8" y1="8.5" x2="6.5" y2="9.6" stroke="currentColor" strokeWidth="1" />
                  <line x1="20.2" y1="15.5" x2="17.5" y2="14.4" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <div className="ml-1 h-6 w-2 rounded-sm overflow-hidden shadow-inner" aria-hidden="true">
                <div className="h-2 bg-orange-600" />
                <div className="h-2 bg-white" />
                <div className="h-2 bg-green-600" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-700 bg-clip-text text-transparent">
                PM Internship 
              </h1>
              
              <p className="text-[15px] text-gray-500">Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {orderedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-orange-50 text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>

            {isAuthed ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-semibold">
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">
                      {t.welcome}, {session.user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-md text-sm font-medium transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t.logout}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors duration-200"
                >
                  {t.signin}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-md transition-all duration-200 shadow-sm"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors duration-200"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Mobile links in order */}
          {orderedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          
          {isAuthed ? (
            <>
              {/* User info on mobile */}
              <div className="flex items-center px-3 py-3 border-b border-gray-100 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-900">
                    {session.user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>

              {/* Mobile language toggle */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <span className="text-lg">🌐</span>
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>

              {/* Mobile logout */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t.logout}</span>
              </button>
            </>
          ) : (
            <>
              {/* Mobile language toggle for unauthenticated users */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <span className="text-lg">🌐</span>
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
              
              <Link
                href="/auth/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                {t.signin}
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
              >
                {t.register}
              </Link>
            </>
          )}
        </div>
      </div>
      </nav>
      {/* Spacer to offset fixed navbar height; not rendered on /auth/* since Navbar returns null there */}
      <div className="h-16" />
    </>
  );
}