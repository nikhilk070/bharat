"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight, BrainCircuit, Handshake, Network, LineChart, Globe2, Clock, Briefcase, UserCircle } from "lucide-react";
import Link from "next/link";

export default function VivachanaPortal() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Cinematic Effects for White Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-saffron/5 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-green/5 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      {/* SECTION 1: WHITE HERO */}
      <section className="relative z-10 pt-40 pb-20 px-6 md:px-24 bg-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white border border-black/5 px-5 py-2.5 rounded-full mb-10 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron animate-pulse shadow-[0_0_10px_rgba(244,114,32,0.6)]"></span>
              <span className="text-xs font-heading tracking-[0.25em] uppercase text-[#1A1E2E] font-bold">The Think-Tank</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-6xl md:text-8xl lg:text-[100px] leading-[0.95] mb-8 tracking-tight text-[#1A1E2E]">
              Vivachana <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-green inline-block">
                CXO Network
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#1A1E2E]/70 font-medium mb-14 max-w-3xl mx-auto leading-relaxed">
              A highly curated sanctuary for industry veterans and strategic advisors. We bridge the gap between decades of corporate scaling experience and the raw, unbridled innovation of emerging startups.
            </p>
            
            <Link href="/login" className="inline-flex items-center gap-3 bg-[#1A1E2E] text-white px-8 py-4 rounded-xl font-heading font-bold tracking-widest uppercase text-sm hover:scale-105 transition-transform shadow-xl">
              Apply as Advisor <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Abstract Network Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:flex justify-center items-center h-[500px]"
          >
            <div className="relative w-full aspect-square max-w-[500px]">
              <div className="absolute inset-0 rounded-full border border-black/5 animate-[spin_40s_linear_infinite]">
                <div className="absolute -top-3 left-1/2 w-6 h-6 bg-saffron/20 rounded-full blur-sm"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-green/20 rounded-full blur-sm"></div>
              </div>
              <div className="absolute inset-8 rounded-full border border-dashed border-black/10 animate-[spin_30s_linear_infinite_reverse]"></div>
              <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-white to-gray-50 border border-black/10 flex items-center justify-center shadow-2xl">
                <BrainCircuit size={80} className="text-[#1A1E2E]/60" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: BLACK TIME BANK MODEL */}
      <section className="relative z-10 py-32 px-6 md:px-24 bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">The Time-Bank Model</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">A revolutionary approach to startup mentorship. You pledge your time. Startups get world-class advisory. You earn vested equity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent -z-10"></div>
            {[
              {
                icon: <Clock size={24} className="text-saffron" />,
                title: "1. Pledge Time",
                desc: "Commit a set number of advisory hours per month. Your availability and expertise are logged into our Time-Bank."
              },
              {
                icon: <Users size={24} className="text-white" />,
                title: "2. Strategic Pairing",
                desc: "Our AI engine matches your specific industry expertise with high-growth startups currently in our accelerator."
              },
              {
                icon: <Briefcase size={24} className="text-green" />,
                title: "3. Earn Equity",
                desc: "Convert your advisory hours directly into vested equity. Build a diversified portfolio through intellectual capital."
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass p-10 rounded-2xl border border-white/10 hover:border-saffron/30 transition-colors text-center relative"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
                  {step.icon}
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-4">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHITE DIRECTORY */}
      <section className="relative z-10 py-32 px-6 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#1A1E2E] mb-4">CXO Directory</h2>
              <p className="text-[#1A1E2E]/70 max-w-xl">Browse the profiles of industry veterans currently actively mentoring and investing through the Vivachana network.</p>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 text-[#1A1E2E] font-heading font-bold uppercase tracking-widest text-sm hover:text-saffron transition-colors">
              View Full Directory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Vikram Sharma", role: "Ex-CMO, Tech Mahindra", tags: ["GTM", "Enterprise Sales"], bg: "bg-saffron/10 text-saffron" },
              { name: "Ananya Desai", role: "CFO, Reliance Retail", tags: ["Financing", "Retail Strategy"], bg: "bg-green/10 text-green" },
              { name: "Rahul Menon", role: "Founder, FreshWorks AI", tags: ["Product", "AI/ML"], bg: "bg-blue-500/10 text-blue-500" },
            ].map((profile, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-[#F5F4F0] border border-black/5 hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 rounded-full bg-black/5 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-black/20">
                    <UserCircle size={40} />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-2xl text-[#1A1E2E] mb-1">{profile.name}</h4>
                <p className="text-[#1A1E2E]/60 text-sm mb-6">{profile.role}</p>
                <div className="flex gap-2 flex-wrap">
                  {profile.tags.map(tag => (
                    <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-current ${profile.bg}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
