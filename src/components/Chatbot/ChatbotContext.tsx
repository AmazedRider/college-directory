import React, { createContext, useContext, useState, useEffect } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('chatbot_session_id');
  });

  // Custom function to handle opening the chatbot
  const openChatbot = () => {
    setIsOpen(true);
  };

  // Custom function to properly close and reset the chatbot
  const closeChatbot = () => {
    setIsOpen(false);
    localStorage.removeItem('chatbot_session_id');
    setSessionId(null);
  };

  // Initialize with empty session - clear localStorage when component mounts
  useEffect(() => {
    // Clear localStorage on mount to ensure fresh start
    localStorage.removeItem('chatbot_session_id');
  }, []);

  // Persist sessionId to localStorage when it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('chatbot_session_id', sessionId);
    } else {
      localStorage.removeItem('chatbot_session_id');
    }
  }, [sessionId]);

  return (
    <ChatbotContext.Provider 
      value={{ 
        isOpen, 
        setIsOpen: (open) => open ? openChatbot() : closeChatbot(), 
        sessionId, 
        setSessionId 
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
} 