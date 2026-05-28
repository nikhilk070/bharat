"use client";

import { motion } from "framer-motion";
import { Users, Clock, Video, FileText, MessageSquare, Plus, Hash } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MentorDashboard() {
  const [startups, setStartups] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    fetchStartups();
    fetchDiscussions();
  }, []);

  const fetchStartups = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vivachana/my-startups`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStartups(data.map((a: any) => a.startup));
      }
    } catch (err) {
      console.error("Failed to fetch assigned startups", err);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vivachana/discussions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setDiscussions(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    }
  };

  const handlePostTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vivachana/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title: newTopic, content: "Looking for insights from the network.", channel: "GENERAL" })
      });
      if (res.ok) {
        setNewTopic("");
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const kpis = [
    { title: "Assigned Startups", value: startups.length.toString(), icon: <Users className="text-blue-500" />, link: "/mentor/startups" },
    { title: "Hours Contributed", value: "24", icon: <Clock className="text-indigo-400" />, link: "/mentor/calendar" },
    { title: "Upcoming Sessions", value: "2", icon: <Video className="text-saffron" />, link: "/mentor/calendar" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      
      <div>
        <h1 className="font-heading font-extrabold text-4xl text-foreground mb-2">Vivachana Dashboard</h1>
        <p className="text-muted-foreground">Manage your mentorship sessions, review startup progress, and engage the Think Tank.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <Link href={kpi.link} key={idx} className="block">
            <div className="bg-card border border-border p-6 rounded-2xl hover:border-blue-500/50 transition-all hover:-translate-y-1 group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-muted transition-colors">
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">{kpi.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-heading font-bold text-foreground">{kpi.value}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-lg text-foreground">Upcoming Sessions</h3>
              <Link href="/mentor/calendar" className="text-xs text-blue-500 hover:underline">Full Calendar</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { startup: "Nexus AI", topic: "Product Roadmap Review", time: "Today, 4:00 PM IST", status: "Action Required" },
                { startup: "HealthTech Solutions", topic: "Go-to-market Strategy", time: "Friday, 11:30 AM IST", status: "Confirmed" },
              ].map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{session.startup}</h4>
                    <p className="text-xs text-muted-foreground">{session.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-foreground font-bold mb-1">{session.time}</p>
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${session.status === 'Confirmed' ? 'bg-green/20 text-green' : 'bg-saffron/20 text-saffron'}`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Startups */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-lg text-foreground">My Startups</h3>
              <Link href="/mentor/startups" className="text-xs text-blue-500 hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {startups.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No startups assigned yet.</p>
              ) : startups.map((startup, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border group hover:border-blue-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center font-heading font-bold text-foreground overflow-hidden">
                      {startup.logoUrl ? (
                        <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover" />
                      ) : (
                        startup.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-blue-500 transition-colors">{startup.name}</h4>
                      <p className="text-xs text-muted-foreground">{startup.industry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Health Score</p>
                    <span className="text-xs font-bold text-green">90/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Think Tank Discussions */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[740px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-500" /> Think Tank
            </h3>
            <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded font-bold uppercase tracking-widest">Network Forum</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {discussions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No active discussions.</p>
            ) : discussions.map((discussion, idx) => (
              <div key={idx} className="p-4 bg-background rounded-xl border border-border hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border flex items-center gap-1">
                    <Hash size={10}/> {discussion.channel}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-1">{discussion.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{discussion.content}</p>
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold">
                      {discussion.author?.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold text-foreground">{discussion.author?.email?.split('@')[0]}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostTopic} className="mt-4 pt-4 border-t border-border flex gap-2">
            <input 
              type="text" 
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              placeholder="Ask the network a question..." 
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" disabled={!newTopic.trim()} className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              <Plus size={18} />
            </button>
          </form>
        </div>

      </div>

    </motion.div>
  );
}
