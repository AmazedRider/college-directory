import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { useChatbot } from './ChatbotContext';
import { ChatbotService, ChatMessage } from '../../lib/chatbot';
import toast from 'react-hot-toast';

export function Chatbot() {
  const { isOpen, setIsOpen, sessionId, setSessionId } = useChatbot();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [clearingChat, setClearingChat] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotService = ChatbotService.getInstance();

  // Function to analyze bot responses and generate relevant follow-up questions
  const analyzeBotResponseForSuggestions = useCallback(() => {
    // Only analyze if there are messages
    if (messages.length === 0) return;

    // Get the most recent bot message and user message for context
    const lastBotMessage = [...messages].reverse().find(msg => msg.type === 'bot');
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (!lastBotMessage) return;

    const botText = lastBotMessage.text.toLowerCase();
    const userText = lastUserMessage ? lastUserMessage.text.toLowerCase() : '';
    const combinedContext = `${userText} ${botText}`;
    let suggestions: string[] = [];

    // Check for patterns in the conversation that indicate specific topics
    
    // If bot mentioned not having specific information
    if (/don't have specific|can't provide exact|don't know the specific|primarily for|need to research/i.test(botText)) {
      suggestions = [
        "Where can I find this information?",
        "What alternatives do you suggest?",
        "Can you explain why?",
        "What are similar options?"
      ];
    }
    // If bot asked for clarification
    else if (/can you clarify|please specify|to help me guide you better|need more information|which country|what specific aspect/i.test(botText)) {
      suggestions = [
        "I'm interested in the US",
        "I'm interested in the UK",
        "I need information about scholarships",
        "Tell me about admission requirements"
      ];
    }
    // If conversation is about medical education
    else if (/medical|neet|doctor|mbbs|medicine|health/i.test(combinedContext)) {
      if (/india|indian/i.test(combinedContext)) {
        suggestions = [
          "Tell me more about NEET",
          "What are the top medical colleges?",
          "What are the admission requirements?",
          "What are the NEET cutoffs?"
        ];
      } else {
        suggestions = [
          "Medical universities abroad",
          "Cost of medical education",
          "Admission process for international students",
          "Scholarships for medical studies"
        ];
      }
    }
    // If conversation is about visas
    else if (/visa|immigration|permit|embassy/i.test(combinedContext)) {
      suggestions = [
        "What documents are required?",
        "How long is the processing time?",
        "Can I work with a student visa?",
        "What happens after graduation?"
      ];
    }
    // If conversation is about universities/programs
    else if (/university|universities|college|program|course|degree/i.test(combinedContext)) {
      suggestions = [
        "What are the top universities?",
        "What are the admission requirements?",
        "What are the application deadlines?",
        "What about scholarships?"
      ];
    }
    // If conversation is about costs
    else if (/cost|fee|tuition|expense|affordable|budget/i.test(combinedContext)) {
      suggestions = [
        "Which countries are affordable?",
        "Are there any scholarships?",
        "Can I work while studying?",
        "What about living expenses?"
      ];
    }
    // Default suggestions if no specific pattern matches
    else {
      suggestions = [
        "Tell me more about this",
        "What are the requirements?",
        "How can I apply?",
        "What are the costs involved?"
      ];
    }

    // Always generate a fresh set of suggestions for each exchange
    setDynamicSuggestions(suggestions.sort(() => 0.5 - Math.random()).slice(0, 4));
  }, [messages]);

  // Ensure suggestions are refreshed after every exchange
  useEffect(() => {
    // Generate new suggestions whenever messages change and we're not loading
    if (messages.length > 0 && !isLoading) {
      analyzeBotResponseForSuggestions();
    }
  }, [messages, isLoading, analyzeBotResponseForSuggestions]);

  // Send the suggestion directly without updating the input field
  const handleSuggestedQueryClick = async (query: string) => {
    if (!query.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // Clear current suggestions while waiting for response
      setDynamicSuggestions([]);
      
      // Create and add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        type: 'user',
        text: query,
        created_at: new Date().toISOString(),
        session_id: chatbotService.currentSessionId || ''
      };
      
      // Add user message to state immediately
      setMessages(prev => [...prev, userMessage]);
      
      // Get bot response without affecting the input field
      const botMessage = await chatbotService.sendMessage(query);
      
      // Add bot message to state
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Message sending error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Always check connection and reinitialize when opening
      setIsInitialized(false);
      checkConnectionAndInitialize();
    }
  }, [isOpen]);

  const checkConnectionAndInitialize = async () => {
    try {
      await initializeChat();
      setIsInitialized(true);
    } catch (error) {
      console.error('Connection check error:', error);
      toast.error('Failed to initialize chat service');
    }
  };

  const initializeChat = async () => {
    try {
      let currentSessionId = sessionId;
      
      // If no session exists yet, create a new one
      if (!currentSessionId) {
        currentSessionId = await chatbotService.initializeSession();
        setSessionId(currentSessionId);
      } else {
        // Use existing session ID
        chatbotService.setSessionId(currentSessionId);
      }
      
      // Load existing messages for this session
      const existingMessages = await chatbotService.getMessages(currentSessionId);
      setMessages(existingMessages);

      // Subscribe to new messages
      chatbotService.subscribeToNewMessages(currentSessionId, (newMessage) => {
        setMessages(prev => {
          // Check if this message is already in the array
          if (!prev.some(m => m.id === newMessage.id)) {
            return [...prev, newMessage];
          }
          return prev;
        });
      });
    } catch (error: any) {
      console.error('Chat initialization error:', error);
      if (error.message === 'Unable to connect to chat service') {
        toast.error('Unable to connect to the chat service. Please try again later.');
      } else {
        toast.error('Failed to initialize chat');
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      // Clear current suggestions while waiting for response
      setDynamicSuggestions([]);
      
      // Create and add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        type: 'user',
        text: inputMessage,
        created_at: new Date().toISOString(),
        session_id: chatbotService.currentSessionId || ''
      };
      
      // Add user message to state immediately
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input
      setInputMessage("");
      
      // Get bot response
      const botMessage = await chatbotService.sendMessage(inputMessage);
      
      // Add bot message to state
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Message sending error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    // First clear everything
    localStorage.removeItem('chatbot_session_id');
    setMessages([]);
    setSessionId(null);
    setIsInitialized(false);
    chatbotService.deleteChatHistory().catch(err => console.error("Error clearing chat on close:", err));
    
    // Then close the chat
    setIsOpen(false);
  };

  const formatMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <span key={index} className="font-bold">{boldText}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Add a function to clear the chat history
  const handleClearChat = async () => {
    try {
      setIsLoading(true);
      setClearingChat(true);
      
      // Delete the current chat history from Supabase
      await chatbotService.deleteChatHistory();
      
      // Clear localStorage
      localStorage.removeItem('chatbot_session_id');
      
      // Reset all state
      setMessages([]);
      setSessionId(null);
      setIsInitialized(false);
      
      // Create a new session
      await checkConnectionAndInitialize();
      
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Failed to clear chat history');
    } finally {
      setIsLoading(false);
      setClearingChat(false);
    }
  };

  // Clear everything on component mount
  useEffect(() => {
    // Clear localStorage directly 
    localStorage.removeItem('chatbot_session_id');
    
    // Reset component state
    setMessages([]);
    setIsInitialized(false);
    
    // Reset session ID (will trigger the provider's useEffect)
    setSessionId(null);
    
    // Tell the service to clear any current session
    chatbotService.deleteChatHistory().catch((err: any) => 
      console.error("Error clearing chat on mount:", err)
    );
  }, []); // Empty dependency array = run once on mount

  return (
    <div
      className={`fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 transition-all duration-300 transform ${
        isOpen
          ? "translate-y-0 opacity-100 visible"
          : "translate-y-10 opacity-0 invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-3 rounded-t-xl flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-1 mr-2">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Admissions Assistant</h3>
            <p className="text-[10px] text-white/80">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="bg-white/20 hover:bg-white/30 rounded-full p-1 text-white transition-colors duration-200 focus:outline-none"
            aria-label="Close Chatbot"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area with pattern background */}
      <div 
        className="h-64 overflow-y-auto p-3 bg-gradient-to-br from-gray-50 to-white" 
        id="chatMessages"
        style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, #f0f4ff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f4ff 2%, transparent 0%)",
          backgroundSize: "100px 100px"
        }}
      >
        {messages.length > 0 && (
          <>
            {sessionId && messages.length > 0 && !clearingChat && (
              <div className="text-center mb-3">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  Conversation restored
                </span>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start ${
                  message.type === "user" ? "justify-end mb-3" : "mb-3"
                }`}
              >
                {message.type === "bot" && (
                  <div className="bg-primary rounded-full p-1 mr-2 self-end mb-1">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-xl shadow-sm p-2 max-w-[85%] ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
                    {formatMessageText(message.text)}
                  </p>
                </div>
                {message.type === "user" && (
                  <div className="bg-gray-200 rounded-full p-1 ml-2 self-end mb-1">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start mb-3">
                <div className="bg-primary rounded-full p-1 mr-2 self-end mb-1">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl rounded-tl-none shadow-sm p-2">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Start a conversation...</p>
          </div>
        )}
      </div>

      {/* Input area with enhanced styling */}
      <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl">
        <div className="flex shadow-sm rounded-full border border-gray-200 overflow-hidden">
          <input
            type="text"
            placeholder="Type your question..."
            className="flex-grow px-4 py-2 border-none focus:outline-none focus:ring-0 text-gray-700 bg-transparent text-sm"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className={`px-3 flex items-center justify-center transition-colors duration-200 ${
              isLoading 
                ? "bg-gray-200 cursor-not-allowed" 
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Dynamic suggestions based on bot response */}
        {dynamicSuggestions.length > 0 && messages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dynamicSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-[10px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 transition-all duration-200 shadow-sm hover:shadow"
                onClick={() => {
                  // Call the handler directly without affecting input field
                  handleSuggestedQueryClick(suggestion);
                }}
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {/* Help text */}
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          Ask me anything about universities, visa requirements, scholarships, or application processes!
        </p>
      </div>
    </div>
  );
} 