import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  text: string;
  created_at: string;
  session_id: string;
}

export interface ChatSession {
  id: string;
  created_at: string;
  user_id?: string;
}

export class ChatbotService {
  private static instance: ChatbotService;
  private _currentSessionId: string | null = null;
  private genAI: GoogleGenerativeAI;
  private model: any;

  private constructor() {
    // Initialize Gemini with the provided API key
    this.genAI = new GoogleGenerativeAI('AIzaSyBewm2I3ALLKdw01kV_iJs2oUVt1dGJ7Po');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  public get currentSessionId(): string | null {
    return this._currentSessionId;
  }

  public setSessionId(sessionId: string): void {
    this._currentSessionId = sessionId;
  }

  public async initializeSession(): Promise<string> {
    if (this._currentSessionId) {
      return this._currentSessionId;
    }

    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({})
      .select()
      .single();

    if (sessionError) {
      throw new Error('Failed to create chat session');
    }

    this._currentSessionId = session.id;

    // Check if this is a new session with no messages
    const { data: existingMessages, error: checkError } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('session_id', this._currentSessionId)
      .limit(1);

    if (checkError) {
      console.error('Error checking for existing messages:', checkError);
    }

    // Only send welcome message if there are no existing messages
    if (!existingMessages || existingMessages.length === 0) {
    // Send welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now(),
      type: 'bot',
        text: "👋 Hi there! I'm your Overseas Education Guide. I can help with:\n\n" +
          "• **University Selection**: Top universities by country/program\n" +
          "• **Application Process**: Deadlines, requirements, documents\n" +
          "• **Visa Requirements**: Country-specific visa processes\n" +
          "• **Scholarships**: Merit & need-based funding options\n" +
          "• **Costs & Living**: Tuition fees, accommodation, expenses\n" +
          "• **Tests & Scores**: IELTS, TOEFL, GRE, GMAT requirements\n\n" +
          "What would you like to know about studying abroad? You can ask specific questions like 'When are UK university application deadlines?' or 'What are visa requirements for Canada?'",
      created_at: new Date().toISOString(),
        session_id: this._currentSessionId
    };

    // Store welcome message in Supabase
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert(welcomeMessage);

    if (messageError) {
      console.error('Failed to store welcome message:', messageError);
      }
    }

    return session.id;
  }

  public async sendMessage(text: string): Promise<ChatMessage> {
    if (!this._currentSessionId) {
      await this.initializeSession();
    }

    // Store user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      text,
      created_at: new Date().toISOString(),
      session_id: this._currentSessionId
    };

    // Store user message in Supabase
    const { error: userError } = await supabase
      .from('chat_messages')
      .insert(userMessage);

    if (userError) {
      console.error('Failed to store user message:', userError);
    }

    try {
    // Generate bot response using Gemini
    const botResponse = await this.generateBotResponse(text);

    // Store bot response
    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: botResponse,
      created_at: new Date().toISOString(),
        session_id: this._currentSessionId
    };

    // Store bot message in Supabase
    const { error: botError } = await supabase
      .from('chat_messages')
      .insert(botMessage);

    if (botError) {
      console.error('Failed to store bot message:', botError);
    }

    return botMessage;
    } catch (error) {
      console.error('Error generating bot response:', error);
      
      // Create an error message to return to the user
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I apologize, but I'm having trouble generating a response right now. Please try asking a more specific question or try again later.",
        created_at: new Date().toISOString(),
        session_id: this._currentSessionId
      };
      
      // Store error message in Supabase
      await supabase.from('chat_messages').insert(errorMessage);
      
      return errorMessage;
    }
  }

  private async generateBotResponse(userMessage: string): Promise<string> {
    const maxRetries = 3;
    const retryDelay = 1000;

    try {
      // Get recent conversation history for context
      let conversationHistory = [];
      if (this._currentSessionId) {
        const { data: recentMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', this._currentSessionId)
          .order('created_at', { ascending: true })
          .limit(6); // Get last few messages for context
        
        if (recentMessages) {
          conversationHistory = recentMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            text: msg.text
          }));
        }
      }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
          // Create conversation history string
          let historyText = '';
          if (conversationHistory.length > 0) {
            historyText = "Previous conversation:\n";
            conversationHistory.forEach(msg => {
              historyText += `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.text}\n`;
            });
          }

        const prompt = `You are an expert Overseas Education Guide. Provide a concise response (2-3 sentences) to the student's question about studying abroad.

          ${historyText}
          
          The student's current question is: "${userMessage}"

        Guidelines for your response:
          1. Maintain context from the previous messages when responding
          2. If the student is asking follow-up questions, connect them to previous messages
          3. Keep it brief and to the point
          4. Focus on the most important information
          5. Use **bold** for key points or deadlines
          6. If more details are needed, suggest what specific information to ask about
          7. If you don't have specific information (like exact dates), don't apologize - suggest where to find that information

        Example format:
        "For [topic], the key points are: **point 1**, **point 2**. Would you like more details about any specific aspect?"`;

        const result = await this.model.generateContent({
          contents: [{
            parts: [{ text: prompt }]
          }]
        });

        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          console.error('All retry attempts failed:', error);
          return "I apologize, but I'm having trouble generating a response. Please try again later.";
        }
        
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
      }
    } catch (error) {
      console.error('Error accessing conversation history:', error);
    }

    return "I apologize, but I'm having trouble generating a response. Please try again later.";
  }

  public async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch messages');
    }

    return messages;
  }

  public async subscribeToNewMessages(
    sessionId: string,
    callback: (message: ChatMessage) => void
  ) {
    return supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  public async deleteChatHistory(): Promise<void> {
    if (!this._currentSessionId) return;

    try {
      // Delete all messages for the current session
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', this._currentSessionId);

      if (messagesError) {
        console.error('Failed to delete messages:', messagesError);
      }

      // Delete the session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', this._currentSessionId);

      if (sessionError) {
        console.error('Failed to delete session:', sessionError);
      }

      // Reset the current session
      this._currentSessionId = null;
    } catch (error) {
      console.error('Error deleting chat history:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  }
} 