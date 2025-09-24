import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

function hasValidGeminiKey() {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return false;
  if (/your_gemini_api_key_here/i.test(key)) return false;
  return true;
}

// Fallback responses when AI is not available
const fallbackResponses = {
  en: {
    greeting: "Hello! I'm your PM Internship Assistant. I can help you with questions about our portal and services.",
    about: "The PM Internship Portal is an AI-powered platform that helps Indian youth find internship opportunities through the PM Internship Scheme.",
    apply: "To apply: 1) Register on our portal, 2) Complete your profile, 3) Take our skill test, 4) Get recommendations, 5) Apply directly.",
    eligibility: "PM Internship eligibility: Ages 21-24, completed/pursuing diploma/degree, Indian citizen.",
    skilltest: "Our skill test is a 5-question assessment with anti-cheating measures. It adapts to your selected skills.",
    recommendations: "We use AI to match your profile with suitable internships based on skills, education, and preferences.",
    features: "Key features: AI recommendations, skill tests, profile matching, career guidance, multilingual support.",
    support: "For support, check our help section, FAQ, or contact form. We're here to help!",
    default: "I'm here to help with PM Internship Portal questions. Ask about registration, eligibility, tests, or recommendations."
  },
  hi: {
    greeting: "नमस्ते! मैं आपका पीएम इंटर्नशिप सहायक हूं। मैं आपको हमारे पोर्टल और सेवाओं के बारे में मदद कर सकता हूं।",
    about: "पीएम इंटर्नशिप पोर्टल एक एआई-संचालित प्लेटफॉर्म है जो भारतीय युवाओं को इंटर्नशिप के अवसर खोजने में मदद करता है।",
    apply: "आवेदन करने के लिए: 1) रजिस्टर करें, 2) प्रोफ़ाइल पूरी करें, 3) कौशल परीक्षा लें, 4) सिफारिशें प्राप्त करें, 5) आवेदन करें।",
    eligibility: "पीएम इंटर्नशिप पात्रता: आयु 21-24 वर्ष, डिप्लोमा/डिग्री पूर्ण/जारी, भारतीय नागरिक।",
    skilltest: "हमारी कौशल परीक्षा धोखाधड़ी रोधी उपायों के साथ 5-प्रश्न मूल्यांकन है। यह आपके चयनित कौशलों के अनुकूल है।",
    recommendations: "हम आपकी प्रोफ़ाइल को कौशल, शिक्षा और प्राथमिकताओं के आधार पर उपयुक्त इंटर्नशिप से मिलाने के लिए एआई का उपयोग करते हैं।",
    features: "मुख्य विशेषताएं: एआई सिफारिशें, कौशल परीक्षा, प्रोफ़ाइल मैचिंग, करियर मार्गदर्शन, बहुभाषी समर्थन।",
    support: "सहायता के लिए, हमारे सहायता अनुभाग, FAQ या संपर्क फॉर्म देखें। हम मदद के लिए यहां हैं!",
    default: "मैं पीएम इंटर्नशिप पोर्टल के प्रश्नों में मदद के लिए यहां हूं। रजिस्ट्रेशन, पात्रता, परीक्षा या सिफारिशों के बारे में पूछें।"
  }
};

function getFallbackResponse(message: string, language: 'en' | 'hi'): string {
  const responses = fallbackResponses[language];
  const msg = message.toLowerCase();
  
  if (msg.includes('portal') || msg.includes('about') || msg.includes('what is') || msg.includes('क्या है')) {
    return responses.about;
  } else if (msg.includes('apply') || msg.includes('registration') || msg.includes('आवेदन')) {
    return responses.apply;
  } else if (msg.includes('eligibility') || msg.includes('पात्रता')) {
    return responses.eligibility;
  } else if (msg.includes('test') || msg.includes('परीक्षा')) {
    return responses.skilltest;
  } else if (msg.includes('recommendation') || msg.includes('सिफारिश')) {
    return responses.recommendations;
  } else if (msg.includes('feature') || msg.includes('विशेषता')) {
    return responses.features;
  } else if (msg.includes('help') || msg.includes('support') || msg.includes('सहायता')) {
    return responses.support;
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('नमस्ते')) {
    return responses.greeting;
  } else {
    return responses.default;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en' } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use AI if available, otherwise fallback
    if (!hasValidGeminiKey()) {
      return NextResponse.json({
        response: getFallbackResponse(message, language),
        source: 'fallback'
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemContext = language === 'en' ? `
You are a helpful customer service assistant for the PM Internship Portal, an AI-powered platform that helps Indian youth find internship opportunities through the Prime Minister's Internship Scheme.

Key Information about our service:
- PM Internship Portal is a government initiative for Indian youth aged 21-24
- We provide AI-powered personalized internship recommendations 
- Users must complete their profile with education, skills, and interests
- We have a 5-question skill assessment test with anti-cheating measures
- The platform supports both English and Hindi
- Key features: AI recommendations, skill verification, profile matching, career guidance
- Eligibility: Age 21-24, Indian citizen, completed/pursuing diploma or degree

Instructions:
- Be helpful, friendly, and informative
- Keep responses concise (2-3 sentences max)
- Focus on PM Internship Portal services
- If asked about things outside our scope, politely redirect to our services
- Be encouraging about career opportunities
- Use simple, clear language

User Question: ${message}

Provide a helpful response about our PM Internship Portal services:` : `
आप PM Internship Portal के लिए एक सहायक ग्राहक सेवा सहायक हैं, जो एक AI-संचालित प्लेटफॉर्म है जो भारतीय युवाओं को प्रधानमंत्री इंटर्नशिप योजना के माध्यम से इंटर्नशिप के अवसर खोजने में मदद करता है।

हमारी सेवा के बारे में मुख्य जानकारी:
- PM Internship Portal 21-24 आयु के भारतीय युवाओं के लिए एक सरकारी पहल है
- हम AI-संचालित व्यक्तिगत इंटर्नशिप सिफारिशें प्रदान करते हैं
- उपयोगकर्ताओं को अपनी शिक्षा, कौशल और रुचियों के साथ प्रोफ़ाइल पूरी करनी होगी
- हमारे पास धोखाधड़ी रोधी उपायों के साथ 5-प्रश्न कौशल मूल्यांकन परीक्षा है
- प्लेटफॉर्म अंग्रेजी और हिंदी दोनों का समर्थन करता है
- मुख्य विशेषताएं: AI सिफारिशें, कौशल सत्यापन, प्रोफ़ाइल मैचिंग, करियर मार्गदर्शन
- पात्रता: आयु 21-24, भारतीय नागरिक, डिप्लोमा या डिग्री पूर्ण/जारी

निर्देश:
- सहायक, मित्रवत और जानकारीपूर्ण बनें
- प्रतिक्रियाओं को संक्षिप्त रखें (अधिकतम 2-3 वाक्य)
- PM Internship Portal सेवाओं पर ध्यान दें
- हमारे दायरे से बाहर की चीजों के बारे में पूछे जाने पर, विनम्रता से हमारी सेवाओं की ओर निर्देशित करें
- करियर के अवसरों के बारे में उत्साहजनक हों
- सरल, स्पष्ट भाषा का उपयोग करें

उपयोगकर्ता का प्रश्न: ${message}

हमारी PM Internship Portal सेवाओं के बारे में एक सहायक प्रतिक्रिया प्रदान करें:`;

      const result = await model.generateContent(systemContext);
      const aiResponse = result.response.text().trim();

      return NextResponse.json({
        response: aiResponse,
        source: 'ai'
      });

    } catch (aiError) {
      console.error('AI response failed:', aiError);
      
      // Fallback to pattern matching
      return NextResponse.json({
        response: getFallbackResponse(message, language),
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}