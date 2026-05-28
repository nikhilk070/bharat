"use client";

import { motion } from "framer-motion";
import { FolderLock, TrendingUp, BarChart3, ArrowRight, ShieldCheck, PieChart, Users2, Database, Users, Lock } from "lucide-react";
import Link from "next/link";

export default function InvestorsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Cinematic Effects for White Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-green/5 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-saffron/5 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      {/* SECTION 1: WHITE HERO */}
      <section className="relative z-10 pt-40 pb-20 px-6 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-3 bg-white border border-black/5 px-5 py-2.5 rounded-full mb-10 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-green animate-pulse shadow-[0_0_10px_rgba(29,176,90,0.6)]"></span>
              <span className="text-xs font-heading tracking-[0.25em] uppercase text-[#1A1E2E] font-bold">Invite-Only Access</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-6xl md:text-8xl lg:text-[100px] leading-[0.95] mb-8 tracking-tight text-[#1A1E2E]">
              The Private <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green to-saffron inline-block">
                Syndicate
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#1A1E2E]/70 font-medium mb-14 max-w-3xl leading-relaxed">
              Access highly curated deal flows, manage your active portfolio, and explore secure data rooms. Designed exclusively for LPs and Angel Investors.
            </p>

            <Link href="/login" className="inline-flex relative group overflow-hidden bg-[#1A1E2E] text-white px-8 py-4 rounded-xl font-heading font-bold uppercase tracking-widest text-sm transition-all hover:bg-black">
              <span className="relative z-10 flex items-center gap-3">
                Access Investor Portal <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg relative"
          >
             <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative max-w-5xl mx-auto"
            >
              {/* Dashboard Preview Mockup */}
              <div className="bg-[#050505] rounded-t-2xl border-x border-t border-black/10 shadow-2xl overflow-hidden aspect-[16/9] relative flex flex-col">
                {/* Header Mockup */}
                <div className="h-12 border-b border-white/10 flex items-center px-6 gap-4 bg-white/5">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                   </div>
                   <div className="mx-auto bg-white/5 border border-white/10 rounded px-3 py-1 text-xs text-white/50 flex items-center gap-2">
                      <Lock size={12} /> app.bharatventures.in/dashboard
                   </div>
                </div>
                {/* Body Mockup */}
                <div className="flex-1 p-8 grid grid-cols-3 gap-6 bg-[url('/noise.png')] mix-blend-overlay opacity-80">
                   <div className="col-span-2 space-y-6">
                      <div className="h-32 bg-white/5 rounded-xl border border-white/10 flex items-center px-8">
                         <div>
                           <div className="text-white/40 text-sm mb-2">Live Portfolio Value</div>
                           <div className="text-4xl text-white font-heading font-bold">₹12.4 Cr <span className="text-green text-sm">↑ 14%</span></div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                      <div className="text-white/40 text-sm mb-6">Active Deal Rooms</div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: BLACK ADVANTAGE */}
      <section className="relative z-10 py-32 px-6 md:px-24 bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">The Bharat Advantage</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">As an LP or Angel, you gain direct access to our command center — engineered for transparency and exclusive deal flow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database size={24} className="text-green" />,
                title: "Secure Data Rooms",
                desc: "Instant access to vetted financial models, DD reports, and cap tables for every startup in our cohort."
              },
              {
                icon: <TrendingUp size={24} className="text-saffron" />,
                title: "Live Equity Tracking",
                desc: "Monitor your portfolio performance and equity vesting in real-time through your personalized dashboard."
              },
              {
                icon: <Users size={24} className="text-green" />,
                title: "Co-Invest with CXOs",
                desc: "Invest alongside India's top 100 industry leaders, leveraging their strategic conviction and due diligence."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 p-10 rounded-2xl border border-white/10 hover:border-green/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHITE NETWORK MOMENTUM */}
      <section className="relative z-10 py-32 px-6 md:px-24 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl text-[#1A1E2E] mb-6">Network Momentum</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$50M+", label: "Capital Deployed" },
              { value: "120+", label: "Vetted Startups" },
              { value: "45", label: "Active CXOs" },
              { value: "3.2x", label: "Avg Portfolio Growth" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="font-heading font-bold text-4xl md:text-6xl text-[#1A1E2E] mb-2">{stat.value}</div>
                <div className="text-sm font-heading tracking-widest uppercase text-[#1A1E2E]/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
