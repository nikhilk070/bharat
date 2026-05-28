"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, User, Send, BrainCircuit, Sparkles, Loader2 } from "lucide-react";

export default function ChanakyaAgentPage() {
  const [messages, setMessages] = useState<{role: 'system' | 'user' | 'agent', content: string}[]>([
    { role: 'agent', content: 'Greetings. I am Chanakya, the intelligence engine of the Bharat Ventures OS. I have real-time access to our Startup Pipeline, CXO Roster, and Investor Database. How may I assist you today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/chanakya/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: userMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'agent', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'system', content: 'Connection to Chanakya severed. Please try again.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: 'A network error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col pb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6 mb-6 shrink-0">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            <BrainCircuit className="text-saffron" size={32} /> Chanakya AI Agent
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Sparkles size={14} className="text-blue-500" /> Generative AI Intelligence directly connected to your Ecosystem Data.
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                msg.role === 'agent' 
                  ? 'bg-gradient-to-br from-saffron to-saffron-light text-white shadow-[0_0_15px_rgba(244,114,32,0.3)] border-saffron/20' 
                  : msg.role === 'user'
                  ? 'bg-muted border-border text-foreground'
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {msg.role === 'agent' ? <Bot size={20} /> : msg.role === 'user' ? <User size={20} /> : <BrainCircuit size={20} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-muted text-foreground border border-border rounded-tr-sm'
                  : msg.role === 'agent'
                  ? 'bg-saffron/5 text-foreground border border-saffron/20 rounded-tl-sm'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20 rounded-tl-sm'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i !== msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>

            </motion.div>
          ))}
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-saffron-light text-white shadow-[0_0_15px_rgba(244,114,32,0.3)] border border-saffron/20 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-saffron/5 text-muted-foreground border border-saffron/20 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 text-sm">
                <Loader2 size={16} className="animate-spin text-saffron" /> Chanakya is analyzing the ecosystem...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Chanakya about your startups, investors, or request a draft..."
              className="w-full bg-card border border-border rounded-xl pl-4 pr-14 py-4 text-sm text-foreground focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-saffron text-white rounded-lg flex items-center justify-center hover:bg-saffron-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>

    </motion.div>
  );
}
