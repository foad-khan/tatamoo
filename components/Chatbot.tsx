import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AssessmentResult } from '../types';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isSuggestion?: boolean;
}

interface ChatbotProps {
  results: AssessmentResult;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ results, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: "Hello! I'm MaturityBot. I have your assessment results and can help you analyze them. What would you like to know?" 
    },
    { sender: 'bot', text: 'Why is my Governance score low?', isSuggestion: true },
    { sender: 'bot', text: 'Explain the "Infrastructure" category.', isSuggestion: true },
    { sender: 'bot', text: 'Give me more ideas on how to improve training.', isSuggestion: true },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const generateChatPrompt = (question: string) => {
    return `You are "MaturityBot," an expert AI assistant for a healthcare AI readiness assessment tool called MaturityMap.
    Your personality is helpful, professional, and concise.
    You have been provided with the user's assessment results as a JSON object.
    Your task is to answer the user's question based *only* on the provided results data.
    Do not invent new recommendations or scores.
    Keep your answers brief and to the point.
    
    Here are the user's assessment results:
    \`\`\`json
    ${JSON.stringify(results, null, 2)}
    \`\`\`

    Here is the user's question:
    "${question}"

    Please provide a helpful answer.`;
  }
  
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev.filter(m => !m.isSuggestion), userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = generateChatPrompt(messageText);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const botMessage: Message = { sender: 'bot', text: response.text };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage: Message = { 
        sender: 'bot', 
        text: "I'm sorry, I encountered an error trying to process that. Please try asking in a different way." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex items-end justify-end" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md h-[75%] m-4 rounded-xl shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        <style>{`
            @keyframes slide-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             </div>
             <div>
                <h2 className="font-bold text-slate-800">MaturityBot</h2>
                <p className="text-xs text-slate-500">Your personal report assistant</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            msg.isSuggestion ? (
              <button 
                key={index}
                onClick={() => handleSendMessage(msg.text)}
                disabled={isLoading}
                className="w-full text-left text-sm p-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              >
                {msg.text}
              </button>
            ) : (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center ring-2 ring-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 16a2 2 0 110-4 2 2 0 010 4z" /></svg>
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            )
          ))}
          {isLoading && (
            <div className="flex items-end gap-2">
               <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center ring-2 ring-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 16a2 2 0 110-4 2 2 0 010 4z" /></svg>
               </div>
               <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-slate-100 border-slate-200 rounded-lg py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed"
              disabled={isLoading || !userInput.trim()}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;