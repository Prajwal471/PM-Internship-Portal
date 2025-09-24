'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  skill: string;
}

const translations = {
  en: {
    title: 'Skill Verification Test',
    subtitle: 'Answer 5 questions to verify your skills',
    warning: 'Important: Do not switch tabs or windows during the test. The test will auto-submit if you do.',
    cameraWarning: 'Please ensure your face is visible to the camera throughout the test.',
    question: 'Question',
    of: 'of',
    submit: 'Submit Test',
    next: 'Next',
    testSubmitted: 'Test auto-submitted due to suspicious activity',
    multiplePersons: 'Multiple faces detected. Test will be submitted.',
    noFace: 'No face detected. Please ensure your face is visible.',
    tabWarning: 'Tab change detected! Test will be auto-submitted in 3 seconds...',
    success: 'Test completed successfully!',
    error: 'Failed to submit test. Please try again.',
  },
  hi: {
    title: 'कौशल सत्यापन परीक्षा',
    subtitle: 'अपने कौशलों को सत्यापित करने के लिए 5 प्रश्नों के उत्तर दें',
    warning: 'महत्वपूर्ण: परीक्षा के दौरान टैब या विंडो न बदलें। ऐसा करने पर परीक्षा स्वतः जमा हो जाएगी।',
    cameraWarning: 'कृपया सुनिश्चित करें कि परीक्षा के दौरान आपका चेहरा कैमरे में दिखाई दे।',
    question: 'प्रश्न',
    of: 'का',
    submit: 'परीक्षा जमा करें',
    next: 'अगला',
    testSubmitted: 'संदिग्ध गतिविधि के कारण परीक्षा स्वतः जमा हो गई',
    multiplePersons: 'कई चेहरे का पता चला। परीक्षा जमा की जाएगी।',
    noFace: 'कोई चेहरा नहीं मिला। कृपया सुनिश्चित करें कि आपका चेहरा दिखाई दे।',
    tabWarning: 'टैब परिवर्तन का पता चला! परीक्षा 3 सेकंड में स्वतः जमा हो जाएगी...',
    success: 'परीक्षा सफलतापूर्वक पूर्ण!',
    error: 'परीक्षा जमा करने में असफल। कृपया पुनः प्रयास करें।',
  }
};

export default function Test() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const tabWarningTimeout = useRef<NodeJS.Timeout | null>(null);

  const t = translations[language];

  // Anti-cheating: immediate auto-submit on tab change/blur
  useEffect(() => {
    if (!testStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !submitting) {
        setWarnings(prev => [...prev, 'Tab or window change detected. Submitting test...']);
        autoSubmitTest('tab_or_window_change');
      }
    };

    const handleBlur = () => {
      if (!submitting) {
        setWarnings(prev => [...prev, 'Window focus lost. Submitting test...']);
        autoSubmitTest('window_blur');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [testStarted, submitting]);

  // Copy/paste prevention
  useEffect(() => {
    if (!testStarted) return;

    const preventCopy = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const preventContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        return false;
      }
      
      // Prevent copy/paste
      if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 65)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboard);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboard);
    };
  }, [testStarted]);

  // Camera and face detection setup
  useEffect(() => {
    if (!testStarted) return;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise(res => videoRef.current?.addEventListener('loadedmetadata', () => res(null), { once: true }));
          videoRef.current.play().catch(() => {});
        }

        // Simple face detection using browser FaceDetector if available
        if ('FaceDetector' in window) {
          const faceDetector = new (window as any).FaceDetector();
          
          faceCheckInterval.current = setInterval(async () => {
            if (videoRef.current && canvasRef.current && !submitting) {
              const canvas = canvasRef.current;
              const context = canvas.getContext('2d');
              
              if (context) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                
                try {
                  const faces = await faceDetector.detect(canvas);
                  
                  if (faces.length === 0) {
                    setWarnings(prev => [...prev, t.noFace]);
                  } else if (faces.length > 1) {
                    setWarnings(prev => [...prev, t.multiplePersons]);
                    autoSubmitTest('multiple_faces');
                  }
                } catch (err) {
                  // Face detection failed, continue silently
                }
              }
            }
          }, 3000);
        } else {
          // Fallback: require camera and show persistent notice
          setWarnings(prev => [...prev, 'Face detection not available in this browser. Keep your face visible on camera.']);
        }
      } catch (err) {
        console.error('Camera setup failed:', err);
        setWarnings(prev => [...prev, 'Camera access denied']);
      }
    };

    setupCamera();

    return () => {
      if (faceCheckInterval.current) {
        clearInterval(faceCheckInterval.current);
      }
    };
  }, [testStarted, submitting, t.noFace, t.multiplePersons]);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchQuestions();
    }
  }, [status, router]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/test/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const autoSubmitTest = async (reason: string) => {
    if (submitting) return;
    
    setSubmitting(true);
    setWarnings(prev => [...prev, t.testSubmitted]);
    
    try {
      await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          questions,
          autoSubmitted: true,
          reason,
        }),
      });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Auto-submit failed:', err);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          questions,
          autoSubmitted: false,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading skill test...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600">Preparing questions...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important Instructions</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p className="mb-2">{t.warning}</p>
                  <p>{t.cameraWarning}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setTestStarted(true)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-lg"
            disabled={questions.length === 0}
          >
            Start Test (Camera required)
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'No questions available'}</h2>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Camera feed (hidden but active) */}
      <video ref={videoRef} autoPlay muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          {warnings.slice(-3).map((warning, index) => (
            <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 text-sm">
              {warning}
              {countdown > 0 && warning === t.tabWarning && (
                <div className="font-bold text-lg">{countdown}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <span className="text-sm text-gray-500">
              {t.question} {currentQuestion + 1} {t.of} {questions.length}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              Progress: {answers.filter(a => a !== undefined).length}/{questions.length} answered
            </div>
            
            <div className="space-x-4">
              {currentQuestion < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === undefined}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.next}
                </button>
              )}
              
              {currentQuestion === questions.length - 1 && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answers.some(a => a === undefined)}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '...' : t.submit}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}