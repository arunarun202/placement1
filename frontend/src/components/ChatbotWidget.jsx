import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUserCircle, FaTimes, FaCommentDots } from 'react-icons/fa';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build history from previous user messages for context
      const history = messages
        .filter(m => m.sender === 'user')
        .map(m => m.text);

      const response = await api.post('/chat/', { 
        message: userMessage.text,
        history: history
      });
      const botMessage = { id: Date.now() + 1, text: response.data.message, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center text-white shadow-xl hover:shadow-2xl z-50 transition-all ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <FaCommentDots className="text-2xl" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-full flex items-center justify-center">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-md">PredictAI Bot</h2>
                  <p className="text-slate-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-2"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center shrink-0 mt-1">
                      <FaRobot className="text-white text-xs" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white rounded-tr-sm shadow-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}></p>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                      <FaUserCircle className="text-slate-500 text-sm" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center shrink-0 mt-1">
                    <FaRobot className="text-white text-xs" />
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 shrink-0 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all hover:-translate-y-0.5"
                >
                  <FaPaperPlane className="ml-0.5 text-sm" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
