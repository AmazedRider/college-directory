import React, { useState } from 'react';
import { ChatbotProvider } from '../../components/Chatbot/ChatbotContext';
import { Chatbot } from '../../components/Chatbot/Chatbot';
import { MessageSquare, Map, BookOpen, UserCheck, Info } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const quickQuestions = [
  'Which countries are best for Computer Science?',
  "What's the cost of studying in Canada?",
  'How do I apply for scholarships?',
  'What are the visa requirements for Australia?',
  'Best universities for Engineering in Germany',
  'IELTS vs TOEFL - which should I choose?'
];

const tabs = [
  { label: 'Smart Chat', icon: <MessageSquare className="w-5 h-5 mr-1" />, active: true },
  { label: 'Study Roadmap', icon: <Map className="w-5 h-5 mr-1" />, active: false },
  { label: 'Facts vs Myths', icon: <Info className="w-5 h-5 mr-1" />, active: false },
  { label: 'Profile Analysis', icon: <UserCheck className="w-5 h-5 mr-1" />, active: false },
];

const tabPrompts: Record<string, string> = {
  'Smart Chat': '',
  'Study Roadmap': 'Can you help me create a personalized study abroad roadmap?',
  'Facts vs Myths': 'Can you clarify some common myths vs facts about studying abroad?',
  'Profile Analysis': 'Can you analyze my profile and suggest improvements for my study abroad application?'
};

export default function AIAssistantPage() {
  const [externalQuestion, setExternalQuestion] = useState<string | undefined>(undefined);
  const [directMessages, setDirectMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '👋 Welcome! I am your AI Assistant. Ask me anything about studying abroad, scholarships, universities, or student life.' }
  ]);
  const [directInput, setDirectInput] = useState('');
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState('');
  const [activeTab, setActiveTab] = useState('Smart Chat');

  const handleQuickQuestion = async (question: string) => {
    setDirectLoading(true);
    setDirectMessages(prev => [...prev, { role: 'user', text: question }]);
    setDirectError('');
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyBewm2I3ALLKdw01kV_iJs2oUVt1dGJ7Po');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(question);
      const text = result.response.text();
      setDirectMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (err: any) {
      setDirectError('Failed to get a response from AI Assistant.');
    } finally {
      setDirectLoading(false);
    }
    const chatSection = document.getElementById('ai-chat-section');
    if (chatSection) chatSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Direct Gemini API chat logic
  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directInput.trim()) return;
    setDirectLoading(true);
    setDirectError('');
    const userMessage = { role: 'user' as const, text: directInput };
    setDirectMessages(prev => [...prev, userMessage]);
    setDirectInput('');
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyBewm2I3ALLKdw01kV_iJs2oUVt1dGJ7Po');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(directInput);
      const text = result.response.text();
      setDirectMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (err: any) {
      setDirectError('Failed to get a response from AI Assistant.');
    } finally {
      setDirectLoading(false);
    }
  };

  // Handler for CTA tabs
  const handleTabClick = async (tabLabel: string) => {
    setActiveTab(tabLabel);
    let mockResponse = '';
    if (tabLabel === 'Study Roadmap') {
      mockResponse = `**Your Study Abroad Roadmap**\n\n1. **Self-Assessment:** Identify your goals, interests, and preferred countries.\n2. **Research:** Explore universities, courses, and scholarship options.\n3. **Prepare Documents:** Get transcripts, SOP, LORs, and test scores ready.\n4. **Apply:** Submit applications to selected universities.\n5. **Visa Process:** Gather documents and apply for a student visa.\n6. **Pre-Departure:** Arrange accommodation, flights, and finances.\n7. **Arrival:** Attend orientation and settle in!\n\n*Ask me about any step for more details!*`;
    } else if (tabLabel === 'Facts vs Myths') {
      mockResponse = `**Facts vs Myths about Studying Abroad**\n\n- **Myth:** Studying abroad is only for the rich.\n  **Fact:** Many scholarships and affordable options exist.\n- **Myth:** Language will be a huge barrier.\n  **Fact:** Most universities offer courses in English and provide language support.\n- **Myth:** Employers don't value foreign degrees.\n  **Fact:** International experience is highly valued by employers.\n- **Myth:** It's unsafe to study abroad.\n  **Fact:** Most destinations are very safe for students.\n\n*Ask me about any of these or share your own doubts!*`;
    } else if (tabLabel === 'Profile Analysis') {
      mockResponse = `**Profile Analysis**\n\n- **Academics:** Strong GPA, relevant coursework.\n- **Test Scores:** Meets/exceeds requirements.\n- **Extracurriculars:** Good involvement, leadership roles.\n- **SOP/LORs:** Well-written, personalized.\n- **Overall:** Your profile is competitive!\n\n*Share your details for a personalized analysis or ask how to improve any area.*`;
    } else {
      mockResponse = '👋 Welcome! I am your AI Assistant. Ask me anything about studying abroad, scholarships, universities, or student life.';
    }
    setDirectMessages([{ role: 'ai', text: mockResponse }]);
  };

  return (
    <ChatbotProvider>
      <div className="min-h-screen bg-[#f6f8fe] flex flex-col">
        {/* Hero Section - styled like ScholarshipFinderPage */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[80vh] z-10">
          {/* Blurred Gradient Blobs */}
          <div className="absolute left-[-10vw] top-[-10vh] w-[400px] h-[400px] bg-[#e0e7ff] rounded-full blur-3xl opacity-40 z-0" />
          <div className="absolute right-[-8vw] bottom-[-8vh] w-[350px] h-[350px] bg-[#99f6e4] rounded-full blur-3xl opacity-30 z-0" />
          <div className="absolute left-[-15vw] top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#6ee7b7] via-[#a7f3d0] to-transparent rounded-full blur-3xl opacity-50 z-0" />
          {/* Badge */}
          <div className="flex items-center gap-2 px-6 py-2 bg-white border border-[#e0e7ff] rounded-full shadow text-[#6366f1] font-semibold text-base mb-8 mt-8 max-w-fit mx-auto animate-fade-in z-10">
            <MessageSquare className="w-5 h-5 text-[#6366f1]" />
            AI-Powered Study Abroad Assistant
          </div>
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a] z-10">
            Your <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">AI Study Abroad Assistant</span>
          </h1>
          {/* Description */}
          <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium z-10">
            Get personalized guidance, create study roadmaps, bust myths, and analyze your profile for your global education journey.
          </p>
          {/* Details Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 z-10">
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-purple-100 text-purple-800 font-semibold text-base shadow-sm border border-purple-200">Personalized Guidance</span>
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-base shadow-sm border border-blue-200">Study Roadmaps</span>
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-base shadow-sm border border-yellow-200">Myths Busted</span>
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-pink-100 text-pink-800 font-semibold text-base shadow-sm border border-pink-200">Profile Analysis</span>
          </div>
          {/* CTA Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-2 z-10">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                className={`flex items-center px-6 py-2 rounded-lg border shadow-sm font-semibold text-base transition-all duration-200 focus:outline-none ${activeTab === tab.label ? 'bg-white text-gray-900 border-gray-200 shadow-md' : 'bg-gray-100 text-gray-400 border-gray-100'} hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50`}
                onClick={() => handleTabClick(tab.label)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: 2-column layout */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto px-4 pb-16">
          {/* Left: Chatbot */}
          <section id="ai-chat-section" className="flex-1 mb-8 md:mb-0">
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">AI Study Assistant</h2>
                <div className="text-sm text-green-600 font-medium mb-2">Online • Ready to help</div>
              </div>
              <Chatbot externalQuestion={externalQuestion} />
            </div>
            {/* Direct AI Assistant section as chat */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 mt-10 flex flex-col justify-between min-h-[500px] max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">AI Assistant</h3>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[420px] pr-2">
                {directMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-xl px-4 py-2 max-w-[80%] text-base whitespace-pre-line shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-tr-none'
                        : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}>
                      {msg.role === 'ai' ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {directLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl px-4 py-2 max-w-[80%] text-base shadow-sm bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-none flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      <span className="ml-2 text-xs text-gray-400">AI is typing...</span>
                    </div>
                  </div>
                )}
                {directError && <div className="text-red-500 text-sm">{directError}</div>}
              </div>
              <form onSubmit={handleDirectSubmit} className="flex items-center gap-2 mt-auto">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-base"
                  placeholder="Ask the AI Assistant anything about studying abroad..."
                  value={directInput}
                  onChange={e => setDirectInput(e.target.value)}
                  required
                  disabled={directLoading}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleDirectSubmit(e); }}
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-semibold transition-all flex items-center justify-center text-lg"
                  disabled={directLoading}
                  style={{ minWidth: 48, minHeight: 48 }}
                  aria-label="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l18-6m0 0l-6 18m6-18L9.75 15.75" />
                  </svg>
                </button>
              </form>
            </div>
          </section>

          {/* Right: Quick Questions */}
          <aside className="w-full md:w-[350px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold mb-4">Quick Questions</h3>
              <div className="flex flex-col gap-3">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left bg-gray-50 hover:bg-purple-50 transition-all rounded-lg px-4 py-3 text-base font-medium text-gray-800 border border-gray-100 shadow-sm"
                    onClick={() => handleQuickQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ChatbotProvider>
  );
} 