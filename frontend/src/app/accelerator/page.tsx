"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Shield, Clock, Rocket, LineChart, FileText } from "lucide-react";
import Link from "next/link";

export default function AcceleratorPage() {
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
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white border border-black/5 px-5 py-2.5 rounded-full mb-10 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron animate-pulse shadow-[0_0_10px_rgba(244,114,32,0.6)]"></span>
              <span className="text-xs font-heading tracking-[0.25em] uppercase text-[#1A1E2E] font-bold">Cohort Applications Open</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-6xl md:text-8xl lg:text-[100px] leading-[0.95] mb-8 tracking-tight text-[#1A1E2E]">
              Accelerate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-green inline-block">
                Startup Journey
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#1A1E2E]/70 font-medium mb-14 max-w-3xl mx-auto leading-relaxed">
              Bharat Accelerator is an elite ecosystem designed to propel high-growth startups from early traction to global scale through AI-driven matching and world-class mentorship.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login" className="w-full sm:w-auto relative group overflow-hidden bg-saffron text-white px-10 py-5 rounded-xl font-heading font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_40px_rgba(244,114,32,0.4)] hover:shadow-[0_0_60px_rgba(244,114,32,0.6)] hover:-translate-y-1">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Apply for Accelerator <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: BLACK FLOW */}
      <section className="relative z-10 py-32 px-6 md:px-24 bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">The Accelerator Flow</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">A streamlined, tech-enabled pathway designed to remove friction and accelerate your time to market and funding.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0"></div>

            {[
              {
                step: "01",
                icon: <Zap className="text-saffron mb-4 group-hover:scale-110 transition-transform" size={40} />,
                title: "AI Profiling",
                desc: "Our proprietary AI analyzes your pitch deck and financials, instantly matching you with the ideal mentors and investors based on deep data insights."
              },
              {
                step: "02",
                icon: <Clock className="text-white mb-4 group-hover:scale-110 transition-transform" size={40} />,
                title: "Time-Bank Mentorship",
                desc: "Get paired with industry-leading CXOs. Instead of equity upfront, mentors pledge hours in our Time-Bank, converted dynamically based on impact."
              },
              {
                step: "03",
                icon: <Shield className="text-green mb-4 group-hover:scale-110 transition-transform" size={40} />,
                title: "Legal Automation",
                desc: "Bypass months of legal paperwork. Generate standard term sheets, NDAs, and onboarding documents instantly within your secure dashboard."
              },
              {
                step: "04",
                icon: <Rocket className="text-saffron mb-4 group-hover:scale-110 transition-transform" size={40} />,
                title: "Pitch & Funding",
                desc: "Once validated through the Time-Bank, your data room unlocks for our exclusive syndicate of Angel Investors and VCs ready to deploy capital."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="relative z-10 glass p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:-translate-y-2 group bg-[#0A0A0A]/80 backdrop-blur-xl flex flex-col items-center text-center"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 glass rounded-full flex items-center justify-center font-heading font-bold text-saffron border border-saffron/30 shadow-[0_0_15px_rgba(244,114,32,0.2)]">
                  {item.step}
                </div>
                {item.icon}
                <h3 className="font-heading font-bold text-xl mb-4 text-white mt-4">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHITE VALUE PROP */}
      <section className="relative z-10 py-32 px-6 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#1A1E2E] mb-8">
                More Than Capital. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-green">We Provide Leverage.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Zero Friction Onboarding", desc: "Digital first approach to DD and legal structuring." },
                  { title: "Strategic Ecosystem", desc: "Direct access to enterprise networks via Vivachana." },
                  { title: "Smart Capital", desc: "Investors aligned with your long-term vision." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-saffron/10 border border-saffron/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-saffron"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xl text-[#1A1E2E] mb-2">{feature.title}</h4>
                      <p className="text-[#1A1E2E]/70 font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-[4/3] bg-[#050505] rounded-3xl border border-black/10 overflow-hidden flex items-center justify-center shadow-xl"
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-saffron via-transparent to-transparent"></div>
              {/* Abstract Graphic */}
              <div className="relative z-10 w-3/4 h-3/4 border border-white/10 rounded-full animate-[spin_40s_linear_infinite] flex items-center justify-center">
                <div className="absolute top-0 -mt-3 w-6 h-6 bg-saffron rounded-full shadow-[0_0_20px_rgba(244,114,32,0.8)]"></div>
                <div className="w-2/3 h-2/3 border border-dashed border-white/20 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite_reverse]">
                   <Target size={60} className="text-white/20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
