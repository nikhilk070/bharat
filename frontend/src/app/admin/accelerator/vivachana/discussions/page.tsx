"use client";

import { motion } from "framer-motion";
import { PlayCircle, MessageSquare, AlertCircle, Hash, Search, Trash2, Plus, Users, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThinkTankDiscussionsPage() {
  const [activeChannel, setActiveChannel] = useState("all");
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Channel Modal State
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", content: "", channel: "GENERAL" });

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vivachana/discussions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setDiscussions(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vivachana/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newTopic)
      });
      if (res.ok) {
        setNewModalOpen(false);
        setNewTopic({ title: "", content: "", channel: "GENERAL" });
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Derive active channels from the discussions data
  const uniqueChannels = Array.from(new Set(discussions.map(d => d.channel))).map(channelName => ({
    name: channelName,
    activeTopics: discussions.filter(d => d.channel === channelName).length
  }));

  const filteredDiscussions = activeChannel === "all" ? discussions : discussions.filter(d => d.channel === activeChannel);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            <PlayCircle className="text-saffron" size={28} /> Think Tank Moderation
          </h1>
          <p className="text-muted-foreground text-sm">Oversee private CXO discussions, manage channels, and moderate network activity.</p>
        </div>
        <button onClick={() => setNewModalOpen(true)} className="bg-saffron text-white px-6 py-3 rounded-lg font-heading font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:bg-saffron-light transition-all shadow-[0_0_15px_rgba(244,114,32,0.2)]">
          <Plus size={18} /> New Topic
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Channels */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search discussions..." className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-saffron text-sm transition-all" />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-heading font-bold uppercase tracking-widest text-xs text-muted-foreground mb-4 px-2">Active Channels</h3>
            
            <div className="space-y-1">
              <button 
                onClick={() => setActiveChannel("all")}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all ${activeChannel === "all" ? "bg-saffron/10 text-saffron font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <span className="flex items-center gap-2"><Hash size={14}/> All Discussions</span>
              </button>
              
              {uniqueChannels.map(channel => (
                <button 
                  key={channel.name}
                  onClick={() => setActiveChannel(channel.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all group ${activeChannel === channel.name ? "bg-saffron/10 text-saffron font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <span className="flex items-center gap-2 truncate"><Hash size={14} className={activeChannel === channel.name ? "text-saffron" : "text-muted-foreground group-hover:text-foreground"}/> {channel.name}</span>
                  {channel.activeTopics > 0 && (
                    <span className="bg-background border border-border text-[10px] px-1.5 py-0.5 rounded-md font-mono">{channel.activeTopics}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Discussions */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              {activeChannel === "all" ? "Recent Network Activity" : `#${activeChannel}`}
            </h2>
            <div className="flex items-center gap-4 text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1"><MessageSquare size={12}/> {filteredDiscussions.length} Topics</span>
            </div>
          </div>

          {loading ? (
             <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
               <Loader2 size={40} className="text-muted-foreground/30 mb-4 animate-spin" />
               <p className="text-sm text-muted-foreground">Loading discussions...</p>
             </div>
          ) : filteredDiscussions.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <MessageSquare size={40} className="text-muted-foreground/30 mb-4" />
              <h4 className="font-heading font-bold text-lg text-foreground mb-2">No Active Discussions</h4>
              <p className="text-sm text-muted-foreground max-w-md">There are currently no topics in this channel. You can start a new discussion to engage the network.</p>
            </div>
          ) : (
            filteredDiscussions.map((discussion, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-saffron/50 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-border">
                      <Hash size={10}/> {discussion.channel}
                    </span>
                  </div>
                  
                  <button className="text-muted-foreground/50 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100" title="Delete Discussion">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="font-heading font-bold text-xl text-foreground mb-4 group-hover:text-saffron transition-colors cursor-pointer">
                  {discussion.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{discussion.content}</p>

                <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-heading font-bold text-sm text-foreground">
                      {discussion.author?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{discussion.author?.email?.split('@')[0]}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                         {discussion.author?.cxo?.expertise?.[0] || 'Member'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(discussion.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Topic Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="font-heading font-bold text-xl text-foreground mb-6">Start New Topic</h2>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Channel Name</label>
                <input type="text" required value={newTopic.channel} onChange={e => setNewTopic({...newTopic, channel: e.target.value.toUpperCase().replace(/\s+/g, '-')})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors font-mono uppercase" placeholder="GENERAL"/>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Discussion Title</label>
                <input type="text" required value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="e.g. Impact of AI on SaaS Valuation"/>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Initial Post</label>
                <textarea required value={newTopic.content} onChange={e => setNewTopic({...newTopic, content: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors min-h-[100px]" placeholder="Share your thoughts..."></textarea>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setNewModalOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="bg-saffron text-white px-6 py-2 rounded-lg font-heading font-bold text-xs tracking-widest uppercase hover:bg-saffron-light">Post Topic</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
