"use client";

import { motion } from "framer-motion";
import { Building, TrendingUp, ShieldCheck, Lock, Activity, Users, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function InvestorDashboard() {
  const [curatedStartups, setCuratedStartups] = useState<any[]>([]);

  useEffect(() => {
    const fetchCuratedStartups = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/investors/curated-startups`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCuratedStartups(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCuratedStartups();
  }, []);

  const kpis = [
    { title: "Curated Deal Flow", value: curatedStartups.length.toString(), icon: <Building className="text-blue-500" /> },
    { title: "Active Pipeline", value: "0", icon: <TrendingUp className="text-saffron" /> },
    { title: "Due Diligence Rooms", value: "0", icon: <Lock className="text-indigo-400" /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      
      <div>
        <h1 className="font-heading font-extrabold text-4xl text-foreground mb-2 flex items-center gap-3">
          Investor Ecosystem <ShieldCheck className="text-saffron w-8 h-8" />
        </h1>
        <p className="text-muted-foreground">Premium venture intelligence. Showing only startups verified and routed to you by Bharat Ventures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-border p-6 rounded-2xl hover:border-saffron/50 transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                {kpi.icon}
              </div>
            </div>
            <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">{kpi.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-heading font-bold text-foreground">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading font-extrabold text-2xl text-foreground">Curated Deal Flow</h2>
          <button className="text-xs font-heading font-bold uppercase tracking-widest text-saffron hover:underline">View Pipeline CRM</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {curatedStartups.length === 0 ? (
            <div className="col-span-2 bg-card border border-border rounded-2xl p-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">No Deal Flow Yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">The administration team is currently curating startups that match your investment thesis. You will be notified when startups are unlocked for you.</p>
            </div>
          ) : curatedStartups.map((startup, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-green/10 text-green px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={12}/> Verified Data
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center font-heading font-extrabold text-2xl text-foreground shadow-inner">
                  {startup.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl text-foreground">{startup.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">{startup.industry} <span className="w-1 h-1 rounded-full bg-border"></span> {startup.stage || "Pre-Seed"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted p-3 rounded-lg border border-border">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1"><Activity size={12}/> Growth KPI</p>
                  <p className="font-bold text-foreground">18% MoM</p>
                </div>
                <div className="bg-muted p-3 rounded-lg border border-border">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1"><Users size={12}/> CXO Rating</p>
                  <p className="font-bold text-foreground">9.2 / 10</p>
                </div>
              </div>

              <button className="w-full bg-background border border-border hover:bg-saffron hover:text-black hover:border-saffron transition-colors text-foreground p-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2">
                Show Interest <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
