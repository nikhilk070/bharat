"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, CheckCircle } from "lucide-react";

export default function AIChatInterviewer({ onSubmit, loading }: { onSubmit: (data: any) => void, loading?: boolean }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am the Bharat Accelerator AI. I'll help you complete your application. To get started, could you tell me the name of your startup and the core problem you are solving?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/accelerator/onboarding-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      const reply = data.reply;

      // Check if the reply is the final JSON payload
      if (reply.trim().startsWith("{") && reply.trim().endsWith("}")) {
        try {
          const parsed = JSON.parse(reply);
          // If parsing succeeds, we have the final data!
          setMessages(prev => [...prev, { role: "assistant", content: "Perfect! I have collected all the necessary details. Submitting your profile now..." }]);
          onSubmit(parsed);
          setIsTyping(false);
          return;
        } catch (e) {
          // not valid json, treat as normal message
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error connecting to my core servers. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass rounded-3xl border border-white/10 overflow-hidden w-full max-w-2xl mx-auto shadow-2xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl">Bharat AI Interviewer</h2>
          <p className="text-xs text-green flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green animate-pulse"></span> Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
            )}
            
            <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-saffron text-white rounded-br-none' : 'bg-white/5 border border-white/10 text-white rounded-bl-none'
            }`}>
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center shrink-0">
                <User size={14} className="text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-3">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-bl-none flex gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-1 bg-transparent border border-white/20 rounded-full px-6 py-3 text-white focus:outline-none focus:border-saffron"
          disabled={isTyping || loading}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping || loading}
          className="w-12 h-12 rounded-full bg-saffron text-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send size={18} className="ml-1" />
        </button>
      </form>
    </div>
  );
}
