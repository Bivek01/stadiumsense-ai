import React, { useState, useRef, useEffect } from 'react';
import { askAssistant } from '../engine/geminiClient';

export default function ChatAssistant({ context, recommendation }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm StadiumSense AI. Any questions about your route or the stadium?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inCooldown, setInCooldown] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || inCooldown) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // AI is fully decoupled from the core UI; if this fails, the Dashboard keeps working.
    const answer = await askAssistant(userMessage, context, recommendation);

    setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    setIsLoading(false);

    // Apply client-side debounce/cooldown to prevent rapid-fire requests
    setInCooldown(true);
    setTimeout(() => {
      setInCooldown(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <h2 className="font-bold text-slate-800 tracking-tight">AI Assistant</h2>
        </div>
        {inCooldown && <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cooling Down</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 p-3 rounded-2xl rounded-bl-sm text-sm flex gap-1 items-center h-10">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white rounded-b-xl flex gap-2">
        <input 
          type="text" 
          placeholder={inCooldown ? "Please wait..." : "Ask a question..."} 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading || inCooldown}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading || inCooldown}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
}
