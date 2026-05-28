"use client";

import { motion } from "framer-motion";
import { Activity, Clock, FileText, CheckCircle2, Video, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function StartupDashboard() {
  const kpis = [
    { title: "Health Score", value: "92/100", change: "+5 this week", icon: <Activity className="text-green" />, link: "/startup/progress" },
    { title: "Time-Bank Balance", value: "32 hrs", change: "8 hrs used", icon: <Clock className="text-blue-400" />, link: "/startup/sessions" },
    { title: "Upcoming Sessions", value: "3", change: "Next: Tomorrow 2PM", icon: <Video className="text-saffron" />, link: "/startup/sessions" },
    { title: "Active Goals", value: "7", change: "4 on track", icon: <CheckCircle2 className="text-emerald-500" />, link: "/startup/kpis" },
  ];

  const growthData = [
    { name: 'W1', value: 10 }, { name: 'W2', value: 25 }, { name: 'W3', value: 45 },
    { name: 'W4', value: 65 }, { name: 'W5', value: 90 }, { name: 'W6', value: 120 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-4xl text-foreground mb-2">My Workspace</h1>
        <p className="text-muted-foreground">Manage your growth program, mentor sessions, and KPI tracking.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Link href={kpi.link} key={idx} className="block">
            <div className="bg-card border border-border p-6 rounded-2xl hover:border-green/50 transition-all hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-muted transition-colors">
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">{kpi.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-heading font-bold text-foreground">{kpi.value}</span>
                <span className="text-[10px] text-green bg-green/10 px-2 py-1 rounded mb-1">{kpi.change}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Core Growth Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green" size={20} />
              <h3 className="font-heading font-bold text-lg text-foreground">Program Progress</h3>
            </div>
            <select className="bg-muted border border-border text-xs rounded-lg px-2 py-1 text-muted-foreground focus:outline-none">
              <option>Past 6 Weeks</option>
              <option>Past 3 Months</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1DB05A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1DB05A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8A8FA5" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A8FA5" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#1DB05A" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Bank Widget */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <h3 className="font-heading font-bold text-lg text-foreground mb-6 flex items-center gap-2">
            <Clock className="text-blue-500" size={20} /> Time-Bank
          </h3>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Simple CSS Circle Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-muted fill-none" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" className="stroke-blue-500 fill-none" strokeWidth="12" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-heading font-bold text-foreground">32</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Hours Left</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <button className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
              Book Session
            </button>
            <button className="flex-1 bg-muted text-foreground py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-border transition-colors border border-border">
              View Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Action Required & Quick Links */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Next Mentorship Sessions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">Upcoming Mentor Sessions</h3>
            <Link href="/startup/sessions" className="text-xs text-green hover:underline">View Calendar</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { mentor: "Rajesh Kumar", role: "Growth Expert", time: "Tomorrow, 2:00 PM IST", status: "Confirmed", type: "1-on-1 Mentorship" },
              { mentor: "Sarah Jenkins", role: "Product Strategy", time: "Friday, 11:30 AM IST", status: "Pending", type: "Portfolio Review" },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{session.mentor}</h4>
                    <p className="text-xs text-muted-foreground">{session.role} • {session.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-foreground font-bold mb-1">{session.time}</p>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${session.status === 'Confirmed' ? 'bg-green/20 text-green' : 'bg-saffron/20 text-saffron'}`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Documents */}
        <div className="bg-saffron/5 border border-saffron/20 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4">Action Required</h3>
          <p className="text-sm text-muted-foreground mb-6">You have 2 pending documents required by the legal team for final clearance.</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-card border border-border p-3 rounded-lg">
              <span className="text-xs font-bold text-foreground">Founders Agreement</span>
              <span className="text-[10px] text-saffron uppercase font-bold tracking-widest">Missing</span>
            </div>
            <div className="flex justify-between items-center bg-card border border-border p-3 rounded-lg">
              <span className="text-xs font-bold text-foreground">Updated Cap Table</span>
              <span className="text-[10px] text-saffron uppercase font-bold tracking-widest">Missing</span>
            </div>
          </div>
          
          <Link href="/startup/vault">
            <button className="w-full bg-saffron text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-saffron/20">
              Go to Data Vault
            </button>
          </Link>
        </div>

      </div>

    </motion.div>
  );
}
