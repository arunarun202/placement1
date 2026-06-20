import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, User, Send } from 'lucide-react';
import api from '../api/axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there 🖐. I'm PredictAI's Career Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build history from previous user messages for context
      const history = messages
        .filter(m => m.sender === 'user')
        .map(m => m.text);

      const response = await api.post('/chat', { 
        message: userMessage.text,
        history: history
      });
      
      const botMessage = { id: Date.now() + 1, text: response.data.message, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative">
      {/* Header */}
      <div className="bg-slate-900 px-4 pt-12 pb-4 shadow-md flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all mr-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">PredictAI Bot</h1>
            <p className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-2 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-auto">
                <Bot className="text-white w-4 h-4" />
              </div>
            )}
            
            <div className={`max-w-[75%] px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-3xl rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-3xl rounded-bl-sm'
            }`}>
              <p className="whitespace-pre-wrap word-break-words" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}></p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-auto">
                <User className="text-slate-500 w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-2 justify-start items-end">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Bot className="text-white w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-4 rounded-3xl rounded-bl-sm shadow-sm flex gap-1.5 items-center h-12">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-20 pb-safe">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-lg mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 max-h-32 min-h-[50px] resize-none px-4 py-3 bg-slate-100 border border-transparent rounded-2xl text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all custom-scrollbar"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-[50px] h-[50px] shrink-0 bg-primary rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
      
      {/* Global styles for chat scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .pb-safe {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      `}} />
    </div>
  );
}
