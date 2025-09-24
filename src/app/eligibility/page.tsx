'use client';

import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function EligibilityPage() {
  const { language, toggleLanguage } = useLanguage();

  const content = {
    en: {
      title: "PM Internship Scheme - Eligibility Criteria",
      subtitle: "Who Can Apply for PM Internship?",
      ageTitle: "Age Criteria",
      ageDesc: "Candidates must be between 21-24 years of age",
      educationTitle: "Educational Qualifications",
      educationDesc: "Must have completed or be pursuing higher education",
      nationalityTitle: "Nationality",
      nationalityDesc: "Indian citizen with valid documents",
      incomeTitle: "Family Income",
      incomeDesc: "Family income criteria as per government guidelines",
      documentsTitle: "Required Documents",
      exclusionsTitle: "Who Cannot Apply",
      howToApply: "How to Apply",
      note: "Note: All criteria must be met for successful application",
      applyNow: "Check Your Eligibility & Apply",
      backHome: "← Back to Home"
    },
    hi: {
      title: "पीएम इंटर्नशिप योजना - पात्रता मानदंड",
      subtitle: "पीएम इंटर्नशिप के लिए कौन आवेदन कर सकता है?",
      ageTitle: "आयु मानदंड",
      ageDesc: "उम्मीदवारों की आयु 21-24 वर्ष के बीच होनी चाहिए",
      educationTitle: "शैक्षिक योग्यता",
      educationDesc: "उच्च शिक्षा पूरी की हो या कर रहे हों",
      nationalityTitle: "राष्ट्रीयता",
      nationalityDesc: "वैध दस्तावेजों के साथ भारतीय नागरिक",
      incomeTitle: "पारिवारिक आय",
      incomeDesc: "सरकारी दिशानिर्देशों के अनुसार पारिवारिक आय मानदंड",
      documentsTitle: "आवश्यक दस्तावेज",
      exclusionsTitle: "कौन आवेदन नहीं कर सकता",
      howToApply: "आवेदन कैसे करें",
      note: "नोट: सफल आवेदन के लिए सभी मानदंड पूरे होने चाहिए",
      applyNow: "अपनी पात्रता जांचें और आवेदन करें",
      backHome: "← होम पर वापस जाएं"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-start">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        {/* Eligibility Cards */}
        <div className="grid gap-8 mb-12">
          
          {/* Age Criteria */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.ageTitle}</h2>
                <p className="text-gray-600">{t.ageDesc}</p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-medium">✓ Age: 21-24 years (both inclusive)</p>
              <p className="text-blue-700 text-sm mt-1">Age calculated as on the date of application</p>
            </div>
          </div>

          {/* Educational Qualifications */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.educationTitle}</h2>
                <p className="text-gray-600">{t.educationDesc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-medium">✓ Graduate (Bachelor's Degree)</p>
                <p className="text-green-700 text-sm">Any stream/discipline</p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-medium">✓ Post Graduate (Master's Degree)</p>
                <p className="text-green-700 text-sm">Any stream/discipline</p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-medium">✓ Diploma Holders</p>
                <p className="text-green-700 text-sm">3-year diploma after 10th</p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-medium">✓ Final Year Students</p>
                <p className="text-green-700 text-sm">Currently pursuing degree</p>
              </div>
            </div>
          </div>

          {/* Nationality & Documents */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.nationalityTitle} & {t.documentsTitle}</h2>
                <p className="text-gray-600">{t.nationalityDesc}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <p className="text-orange-800 font-medium">🇮🇳 Must be Indian Citizen</p>
                <p className="text-orange-700 text-sm">Valid proof of Indian citizenship required</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Required Documents:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Aadhaar Card</li>
                    <li>• Educational Certificates</li>
                    <li>• Bank Account Details</li>
                    <li>• Recent Photograph</li>
                    <li>• Resume/CV</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Optional Documents:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Income Certificate</li>
                    <li>• Caste Certificate (if applicable)</li>
                    <li>• Disability Certificate (if applicable)</li>
                    <li>• Skills Certificates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-9-4H3m6 0h.01M21 12h-9m9 0h-9" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.exclusionsTitle}</h2>
                <p className="text-gray-600">Candidates not eligible for PM Internship</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">✗ Currently Employed</p>
                <p className="text-red-700 text-sm">Full-time or part-time job holders</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">✗ Government Servants</p>
                <p className="text-red-700 text-sm">Including contractual employees</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">✗ Business Owners</p>
                <p className="text-red-700 text-sm">Proprietors or partners in business</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">✗ Previous PM Interns</p>
                <p className="text-red-700 text-sm">Already completed PM Internship</p>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.howToApply}</h2>
                <p className="text-gray-600">Step-by-step application process</p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">Check Eligibility</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">Complete Profile</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">Take Skill Test</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">4</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">Apply to Internships</p>
              </div>
            </div>
          </div>

        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.3L13.93 4.7a2 2 0 00-3.86 0L3 17.3A2 2 0 005.07 19z" />
            </svg>
            <div>
              <p className="text-yellow-800 font-semibold">{t.note}</p>
              <p className="text-yellow-700 text-sm mt-1">Please ensure you meet all eligibility criteria before applying. False information may lead to application rejection.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            href="/profile"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.applyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}