'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';

const allSkills = [
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management',
  'Microsoft Office', 'Data Entry', 'Customer Service', 'Social Media',
  'Programming', 'Web Development', 'Data Analysis', 'Graphic Design',
  'Marketing', 'Sales', 'Research', 'Writing', 'Public Speaking',
  'Project Management', 'Financial Analysis',
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'React', 'Node.js',
  'Angular', 'Vue.js', 'HTML/CSS', 'SQL', 'MongoDB', 'Git', 'Docker'
];

// Education-based skill suggestions
const educationSkillMap: { [key: string]: string[] } = {
  'computer science': ['Programming', 'JavaScript', 'Python', 'Java', 'C++', 'HTML/CSS', 'SQL', 'Git', 'Data Analysis', 'Web Development'],
  'information technology': ['Programming', 'Web Development', 'JavaScript', 'Python', 'HTML/CSS', 'SQL', 'Git', 'Data Analysis', 'MongoDB'],
  'engineering': ['Problem Solving', 'Project Management', 'Data Analysis', 'Research', 'Technical Writing', 'Programming'],
  'business': ['Marketing', 'Sales', 'Project Management', 'Financial Analysis', 'Communication', 'Leadership', 'Microsoft Office'],
  'commerce': ['Financial Analysis', 'Microsoft Office', 'Data Entry', 'Sales', 'Customer Service', 'Project Management'],
  'management': ['Leadership', 'Project Management', 'Communication', 'Problem Solving', 'Public Speaking', 'Teamwork'],
  'marketing': ['Marketing', 'Social Media', 'Graphic Design', 'Communication', 'Sales', 'Writing', 'Customer Service'],
  'finance': ['Financial Analysis', 'Microsoft Office', 'Data Analysis', 'Project Management', 'Communication'],
  'arts': ['Graphic Design', 'Writing', 'Communication', 'Social Media', 'Marketing', 'Research'],
  'science': ['Research', 'Data Analysis', 'Problem Solving', 'Writing', 'Project Management'],
  'economics': ['Data Analysis', 'Financial Analysis', 'Research', 'Microsoft Office', 'Communication'],
  'mathematics': ['Data Analysis', 'Problem Solving', 'Research', 'Programming', 'SQL'],
  'statistics': ['Data Analysis', 'SQL', 'Research', 'Problem Solving', 'Python']
};

const allSectors = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Manufacturing',
  'Agriculture', 'Tourism', 'Retail', 'Government', 'NGO/Non-Profit',
  'Media & Entertainment', 'Construction', 'Transportation', 'Energy',
  'Food & Beverage', 'Fashion', 'Automotive', 'Banking', 'Insurance',
  'Research & Development'
];

const translations = {
  en: {
    title: 'Complete Your Profile',
    subtitle: 'Help us recommend the best internships for you',
    personalDetails: 'Personal Details',
    personalDetailsDesc: 'Tell us about your education and location',
    age: 'Age',
    pmAgeNote: 'PM Internship: Ages 21-24 only',
    educationLevel: 'Education Level',
    diploma: 'Diploma',
    bachelors: "Bachelor's Degree",
    pursuingBachelors: "Pursuing Bachelor's",
    masters: "Master's Degree",
    pursuingMasters: "Pursuing Master's",
    phd: 'PhD',
    fieldOfStudy: 'Field of Study',
    graduationYear: 'Graduation Year',
    state: 'State',
    district: 'District',
    pincode: 'Pincode',
    skills: 'Select Your Skills',
    skillsDesc: 'Choose skills you have or want to develop (select at least 3)',
    suggestedSkills: 'Suggested skills for',
    sectors: 'Interested Sectors',
    sectorsDesc: 'Which industries interest you? (select at least 2)',
    save: 'Save & Continue',
    saving: 'Saving...',
    success: 'Profile updated successfully!',
    redirecting: 'Redirecting to skill test...',
    error: 'Failed to update profile. Please try again.',
    minSkills: 'Please select at least 3 skills',
    minSectors: 'Please select at least 2 sectors',
    selected: 'Selected',
    minimum: 'minimum',
    required: 'required',
    profileCompletion: 'Profile completion requirements:',
    atLeastSkills: 'At least 3 skills selected',
    atLeastSectors: 'At least 2 sectors selected',
    loading: 'Loading...',
  },
  hi: {
    title: 'अपनी प्रोफ़ाइल पूरी करें',
    subtitle: 'हम आपके लिए सबसे अच्छी इंटर्नशिप की सिफारिश कर सकें',
    personalDetails: 'व्यक्तिगत विवरण',
    personalDetailsDesc: 'हमें अपनी शिक्षा और स्थान के बारे में बताएं',
    age: 'आयु',
    pmAgeNote: 'PM इंटर्नशिप: केवल 21-24 आयु',
    educationLevel: 'शिक्षा स्तर',
    diploma: 'डिप्लोमा',
    bachelors: 'स्नातक की डिग्री',
    pursuingBachelors: 'स्नातक कर रहे हैं',
    masters: 'मास्टर डिग्री',
    pursuingMasters: 'मास्टर कर रहे हैं',
    phd: 'पीएचडी',
    fieldOfStudy: 'अध्ययन क्षेत्र',
    graduationYear: 'स्नातक वर्ष',
    state: 'राज्य',
    district: 'जिला',
    pincode: 'पिनकोड',
    skills: 'अपने कौशल चुनें',
    skillsDesc: 'उन कौशलों को चुनें जो आपके पास हैं या विकसित करना चाहते हैं (कम से कम 3 चुनें)',
    suggestedSkills: 'सुझावित कौशल',
    sectors: 'रुचि के क्षेत्र',
    sectorsDesc: 'आपको कौन से उद्योग रुचिकर लगते हैं? (कम से कम 2 चुनें)',
    save: 'सहेजें और जारी रखें',
    saving: 'सहेज रहे हैं...',
    success: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
    redirecting: 'कौशल परीक्षा की ओर भेज रहे हैं...',
    error: 'प्रोफ़ाइल अपडेट करने में असफल। कृपया पुनः प्रयास करें।',
    minSkills: 'कृपया कम से कम 3 कौशल चुनें',
    minSectors: 'कृपया कम से कम 2 क्षेत्र चुनें',
    selected: 'चयनित',
    minimum: 'न्यूनतम',
    required: 'आवश्यक',
    profileCompletion: 'प्रोफ़ाइल पूरी करने की आवश्यकताएं:',
    atLeastSkills: 'कम से कम 3 कौशल चयनित',
    atLeastSectors: 'कम से कम 2 क्षेत्र चयनित',
    loading: 'लोड हो रहा है...',
  }
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState<string>('');
  const [field, setField] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const { language, toggleLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Load current user data
  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/user');
      if (res.ok) {
        const u = await res.json();
        setSelectedSkills(u.skills || []);
        setSelectedSectors(u.interestedSectors || []);
        setEducationLevel(u.education?.level || '');
        setField(u.education?.field || '');
        setYear(u.education?.year ? String(u.education.year) : '');
        setAge(u.age ? String(u.age) : '');
        setState(u.location?.state || '');
        setDistrict(u.location?.district || '');
        setPincode(u.location?.pincode || '');
      }
    };
    if (status === 'authenticated') load();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-pulse">{t.loading}</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  // Get suggested skills based on education
  const getSuggestedSkills = () => {
    const fieldLower = field.toLowerCase().trim();
    const suggestions = new Set<string>();
    
    // Check for exact matches or partial matches
    Object.keys(educationSkillMap).forEach(key => {
      if (fieldLower.includes(key) || key.includes(fieldLower)) {
        educationSkillMap[key].forEach(skill => suggestions.add(skill));
      }
    });
    
    return Array.from(suggestions).filter(skill => !selectedSkills.includes(skill));
  };

  const suggestedSkills = getSuggestedSkills();

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const addSector = (sector: string) => {
    if (sector && !selectedSectors.includes(sector)) {
      setSelectedSectors(prev => [...prev, sector]);
    }
  };

  const removeSector = (sector: string) => {
    setSelectedSectors(prev => prev.filter(s => s !== sector));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedSkills.length < 3) {
      setError(t.minSkills);
      return;
    }

    if (selectedSectors.length < 2) {
      setError(t.minSectors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: selectedSkills,
          interestedSectors: selectedSectors,
          education: { level: educationLevel, field, year: year ? Number(year) : undefined },
          location: { state, district, pincode },
          age: age ? Number(age) : undefined,
          language,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/test');
        }, 2000);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.success}</h2>
          <p className="text-gray-600">{t.redirecting}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600 text-lg">{t.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Details Section - FIRST */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.personalDetails}</h2>
                <p className="text-gray-600">{t.personalDetailsDesc}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.age} *</label>
                <select 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                >
                  <option value="">Select Age</option>
                  <option value="21">21 years</option>
                  <option value="22">22 years</option>
                  <option value="23">23 years</option>
                  <option value="24">24 years</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">{t.pmAgeNote}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.educationLevel}</label>
                <select 
                  value={educationLevel} 
                  onChange={(e) => setEducationLevel(e.target.value)} 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Select Education Level</option>
                  <option value="diploma">{t.diploma}</option>
                  <option value="bachelors">{t.bachelors}</option>
                  <option value="pursuing-bachelors">{t.pursuingBachelors}</option>
                  <option value="masters">{t.masters}</option>
                  <option value="pursuing-masters">{t.pursuingMasters}</option>
                  <option value="phd">{t.phd}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.fieldOfStudy}</label>
                <input 
                  type="text"
                  value={field} 
                  onChange={(e)=>setField(e.target.value)} 
                  placeholder="e.g. Computer Science"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.graduationYear}</label>
                <input 
                  type="number" 
                  value={year} 
                  onChange={(e)=>setYear(e.target.value)} 
                  placeholder="2024"
                  min="2020" 
                  max="2030"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.state}</label>
                <input 
                  type="text"
                  value={state} 
                  onChange={(e)=>setState(e.target.value)} 
                  placeholder="e.g. Karnataka"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.district}</label>
                <input 
                  type="text"
                  value={district} 
                  onChange={(e)=>setDistrict(e.target.value)} 
                  placeholder="e.g. Bangalore Urban"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.pincode}</label>
                <input 
                  type="text"
                  value={pincode} 
                  onChange={(e)=>setPincode(e.target.value)} 
                  placeholder="560001"
                  maxLength={6}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.skills}</h2>
                <p className="text-gray-600">{t.skillsDesc}</p>
              </div>
            </div>
            
            {/* Education-based skill suggestions */}
            {suggestedSkills.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2">💡 {t.suggestedSkills} {field || 'your field'}:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.slice(0, 6).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1 bg-white border border-blue-300 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Dropdown */}
            <div className="mb-4">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    addSkill(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a skill to add...</option>
                {allSkills
                  .filter(skill => !selectedSkills.includes(skill))
                  .map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))
                }
              </select>
            </div>

            {/* Show selected skills directly below dropdown */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                {selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className={`text-sm font-medium ${
              selectedSkills.length >= 3 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {t.selected}: {selectedSkills.length} ({t.minimum} 3 {t.required})
            </div>
          </div>

          {/* Sectors Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t.sectors}</h2>
                <p className="text-gray-600">{t.sectorsDesc}</p>
              </div>
            </div>
            
            {/* Sectors Dropdown */}
            <div className="mb-4">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    addSector(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select a sector to add...</option>
                {allSectors
                  .filter(sector => !selectedSectors.includes(sector))
                  .map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))
                }
              </select>
            </div>

            {/* Show selected sectors directly below dropdown */}
            {selectedSectors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                {selectedSectors.map(sector => (
                  <span
                    key={sector}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200"
                  >
                    {sector}
                    <button
                      type="button"
                      onClick={() => removeSector(sector)}
                      className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className={`text-sm font-medium ${
              selectedSectors.length >= 2 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {t.selected}: {selectedSectors.length} ({t.minimum} 2 {t.required})
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M5.07 19h13.86A2 2 0 0021 17.3L13.93 4.7a2 2 0 00-3.86 0L3 17.3A2 2 0 005.07 19z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-medium">{t.profileCompletion}</p>
                <ul className="mt-1 space-y-1">
                  <li className={`flex items-center ${selectedSkills.length >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedSkills.length >= 3 ? '✅' : '❌'} {t.atLeastSkills}
                  </li>
                  <li className={`flex items-center ${selectedSectors.length >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedSectors.length >= 2 ? '✅' : '❌'} {t.atLeastSectors}
                  </li>
                </ul>
              </div>
              
              <button
                type="submit"
                disabled={loading || selectedSkills.length < 3 || selectedSectors.length < 2}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.saving}
                  </div>
                ) : (
                  t.save
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}