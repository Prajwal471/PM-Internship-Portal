'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const translations = {
  en: {
    chatbotTitle: 'PM Internship Assistant',
    placeholder: 'Ask me about our services...',
    send: 'Send',
    typing: 'Assistant is typing...',
    minimize: 'Minimize',
    close: 'Close',
    quickQuestions: 'Quick Questions:',
    questions: [
      'What is PM Internship Portal?',
      'How do I apply?',
      'What are the eligibility criteria?',
      'How does the skill test work?',
      'How are internships recommended?'
    ],
    responses: {
      greeting: "Hello! I'm your PM Internship Assistant. I can help you with questions about our portal and services. How can I assist you today?",
      about: "The PM Internship Portal is an AI-powered platform that helps Indian youth find internship opportunities through the PM Internship Scheme. We provide personalized recommendations based on your skills, education, and interests.",
      apply: "To apply: 1) Register on our portal, 2) Complete your profile with education and skills, 3) Take our skill assessment test, 4) Get AI-powered internship recommendations, 5) Apply directly through our platform.",
      eligibility: "PM Internship eligibility: You must be between 21-24 years old, have completed or be pursuing a diploma/degree, and be an Indian citizen. Specific requirements may vary by internship.",
      skilltest: "Our skill test is a 5-question assessment that verifies your abilities. It includes anti-cheating measures like camera monitoring and tab switching detection. The test adapts to your selected skills.",
      recommendations: "We use AI to match your profile with suitable internships. Our system considers your skills, education, location preferences, and test scores to provide personalized recommendations.",
      features: "Our key features include: AI-powered recommendations, skill verification tests, profile matching, career guidance, multilingual support (English/Hindi), and direct application process.",
      support: "For support, you can contact us through our help section, check our FAQ, or reach out via the contact form. We're here to help you succeed!",
      default: "I'm here to help with questions about the PM Internship Portal. You can ask about registration, eligibility, skill tests, recommendations, or any other service we offer."
    }
  },
  hi: {
    chatbotTitle: 'पीएम इंटर्नशिप सहायक',
    placeholder: 'हमारी सेवाओं के बारे में पूछें...',
    send: 'भेजें',
    typing: 'सहायक लिख रहा है...',
    minimize: 'छोटा करें',
    close: 'बंद करें',
    quickQuestions: 'त्वरित प्रश्न:',
    questions: [
      'पीएम इंटर्नशिप पोर्टल क्या है?',
      'मैं कैसे आवेदन करूं?',
      'पात्रता मापदंड क्या हैं?',
      'कौशल परीक्षा कैसे काम करती है?',
      'इंटर्नशिप की सिफारिश कैसे की जाती है?'
    ],
    responses: {
      greeting: "नमस्ते! मैं आपका पीएम इंटर्नशिप सहायक हूं। मैं आपको हमारे पोर्टल और सेवाओं के बारे में प्रश्नों में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      about: "पीएम इंटर्नशिप पोर्टल एक एआई-संचालित प्लेटफॉर्म है जो पीएम इंटर्नशिप योजना के माध्यम से भारतीय युवाओं को इंटर्नशिप के अवसर खोजने में मदद करता है। हम आपके कौशल, शिक्षा और रुचियों के आधार पर व्यक्तिगत सिफारिशें प्रदान करते हैं।",
      apply: "आवेदन करने के लिए: 1) हमारे पोर्टल पर रजिस्टर करें, 2) अपनी शिक्षा और कौशल के साथ प्रोफ़ाइल पूरी करें, 3) हमारी कौशल मूल्यांकन परीक्षा लें, 4) एआई-संचालित इंटर्नशिप सिफारिशें प्राप्त करें, 5) हमारे प्लेटफॉर्म के माध्यम से सीधे आवेदन करें।",
      eligibility: "पीएम इंटर्नशिप पात्रता: आपकी आयु 21-24 वर्ष के बीच होनी चाहिए, डिप्लोमा/डिग्री पूरी की हो या कर रहे हों, और भारतीय नागरिक होना चाहिए। विशिष्ट आवश्यकताएं इंटर्नशिप के अनुसार भिन्न हो सकती हैं।",
      skilltest: "हमारी कौशल परीक्षा एक 5-प्रश्न मूल्यांकन है जो आपकी क्षमताओं को सत्यापित करती है। इसमें कैमरा निगरानी और टैब स्विचिंग का पता लगाने जैसे धोखाधड़ी रोधी उपाय शामिल हैं। परीक्षा आपके चयनित कौशलों के अनुकूल होती है।",
      recommendations: "हम उपयुक्त इंटर्नशिप के साथ आपकी प्रोफ़ाइल का मिलान करने के लिए एआई का उपयोग करते हैं। हमारा सिस्टम व्यक्तिगत सिफारिशें प्रदान करने के लिए आपके कौशल, शिक्षा, स्थान प्राथमिकताओं और परीक्षा स्कोर पर विचार करता है।",
      features: "हमारी मुख्य विशेषताएं हैं: एआई-संचालित सिफारिशें, कौशल सत्यापन परीक्षा, प्रोफ़ाइल मैचिंग, करियर मार्गदर्शन, बहुभाषी समर्थन (अंग्रेजी/हिंदी), और प्रत्यक्ष आवेदन प्रक्रिया।",
      support: "सहायता के लिए, आप हमारे सहायता अनुभाग के माध्यम से संपर्क कर सकते हैं, हमारे FAQ देख सकते हैं, या संपर्क फॉर्म के माध्यम से संपर्क कर सकते हैं। हम आपकी सफलता में मदद करने के लिए यहां हैं!",
      default: "मैं पीएम इंटर्नशिप पोर्टल के बारे में प्रश्नों में मदद करने के लिए यहां हूं। आप रजिस्ट्रेशन, पात्रता, कौशल परीक्षा, सिफारिशों, या हमारी किसी भी अन्य सेवा के बारे में पूछ सकते हैं।"
    }
  }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  // Initialize with greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: t.responses.greeting,
        timestamp: new Date()
      }]);
    }
  }, [language, t.responses.greeting]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: language
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Fallback to local responses
      const message = userMessage.toLowerCase();
      
      if (message.includes('portal') || message.includes('about') || message.includes('what is') || message.includes('क्या है') || message.includes('पोर्टल')) {
        return t.responses.about;
      } else if (message.includes('apply') || message.includes('registration') || message.includes('register') || message.includes('आवेदन') || message.includes('रजिस्टर')) {
        return t.responses.apply;
      } else if (message.includes('eligibility') || message.includes('criteria') || message.includes('eligible') || message.includes('पात्रता') || message.includes('मापदंड')) {
        return t.responses.eligibility;
      } else if (message.includes('skill test') || message.includes('test') || message.includes('assessment') || message.includes('कौशल') || message.includes('परीक्षा')) {
        return t.responses.skilltest;
      } else if (message.includes('recommendation') || message.includes('match') || message.includes('suggest') || message.includes('सिफारिश') || message.includes('मैच')) {
        return t.responses.recommendations;
      } else if (message.includes('feature') || message.includes('service') || message.includes('offer') || message.includes('विशेषता') || message.includes('सेवा')) {
        return t.responses.features;
      } else if (message.includes('help') || message.includes('support') || message.includes('contact') || message.includes('सहायता') || message.includes('संपर्क')) {
        return t.responses.support;
      } else if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('नमस्ते') || message.includes('हैलो')) {
        return t.responses.greeting;
      } else {
        return t.responses.default;
      }
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await getResponse(messageText);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Failed to get response:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: language === 'en' 
          ? 'Sorry, I\'m having trouble responding right now. Please try again.'
          : 'क्षमा करें, मुझे अभी जवाब देने में परेशानी हो रही है। कृपया पुनः प्रयास करें।',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {language === 'en' ? 'Need help?' : 'मदद चाहिए?'}
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t.chatbotTitle}</h3>
                <div className="flex items-center space-x-1 text-xs opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">{t.typing}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">{t.quickQuestions}</p>
              <div className="flex flex-wrap gap-1">
                {t.questions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}