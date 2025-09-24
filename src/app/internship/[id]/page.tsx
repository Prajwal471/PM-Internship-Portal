'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: { state: string; district: string; city: string };
  duration: string;
  stipend: number;
  description: string;
  requirements: { skills: string[]; education: string[]; sectors: string[] };
  benefits: string[];
  type: string;
  posted: string;
  matchScore?: number;
  matchReasons?: string[];
  aiInsight?: string;
  careerGrowthPotential?: string;
  skillDevelopmentOpportunities?: string[];
  scoreBreakdown?: {
    skills: number;
    sectors: number;
    education: number;
    location: number;
    test: number;
    recency: number;
  };
}

export default function InternshipDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const _router = useRouter();
  const [data, setData] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeAndFetch = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    initializeAndFetch();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/internships/${id}`);
        if (!res.ok) {
          const body = await res.json();
          setError(body.error || 'Failed to load internship');
        } else {
          const json = await res.json();
          setData(json);
        }
      } catch (_e) {
        setError('Failed to load internship');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Not found'}</h2>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
            <p className="text-gray-700 font-medium">{data.company}</p>
            {data.matchScore && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  data.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                  data.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <span className="mr-1">🎯</span>
                  Match Score: {data.matchScore}%
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">₹{data.stipend.toLocaleString()}</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {data.location.city}, {data.location.state}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration: {data.duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            Type: {data.type}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{data.description}</p>
        </div>

        {/* Match Reasons */}
        {data.matchReasons && data.matchReasons.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Why This Matches You</h2>
            <ul className="text-gray-700 space-y-2">
              {data.matchReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Insight */}
        {data.aiInsight && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">🤖 AI Career Analysis</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-gray-700">
                <span className="mr-2">💡</span>
                {data.aiInsight}
              </p>
            </div>
          </div>
        )}

        {/* Career Growth & Skills Development */}
        {(data.careerGrowthPotential || (data.skillDevelopmentOpportunities && data.skillDevelopmentOpportunities.length > 0)) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Career Development</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.careerGrowthPotential && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Growth Potential</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">{data.careerGrowthPotential}</p>
                  </div>
                </div>
              )}
              {data.skillDevelopmentOpportunities && data.skillDevelopmentOpportunities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Skills You&apos;ll Develop</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {data.skillDevelopmentOpportunities.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700">Skills</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.requirements.skills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700">Education</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.requirements.education.map((e, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{e}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Sectors</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.requirements.sectors.map((e, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{e}</span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {data.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">← Back to Dashboard</Link>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">Apply Now</button>
        </div>
      </div>
    </div>
  );
}