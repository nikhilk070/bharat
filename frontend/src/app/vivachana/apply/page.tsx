"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Building, User, Mail, Briefcase, MapPin, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CxoApplicationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "", password: "", name: "", linkedin: "", bio: "",
    previousCompanies: "", expertise: "", industries: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload = {
        ...formData,
        expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean),
        industries: formData.industries.split(",").map(s => s.trim()).filter(Boolean),
        previousCompanies: formData.previousCompanies.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${apiUrl}/api/vivachana/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.message || "Application failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#050505] p-10 rounded-2xl text-center border border-black/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-saffron"></div>
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <CheckCircle className="text-blue-500 w-10 h-10" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-white mb-4">Application Received</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Thank you for applying to the Vivachana Network. Our committee will review your profile and experience. You will be notified via email regarding the next steps.
          </p>
          <Link href="/vivachana" className="inline-block bg-white text-black px-8 py-3 rounded-xl font-heading font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      
      {/* Left Sidebar - Branding */}
      <div className="md:w-1/3 bg-[#050505] p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-0"></div>
        <div className="absolute top-1/4 -left-1/4 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] z-0"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center shadow-[0_0_15px_rgba(244,114,32,0.4)]">
              <span className="font-heading font-extrabold text-[#050505] text-sm">BV</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-widest uppercase">Bharat<span className="text-saffron">Ventures</span></span>
          </Link>

          <h1 className="font-heading font-extrabold text-5xl mb-6 leading-tight">Join the<br/>Vivachana Network</h1>
          <p className="text-white/60 text-lg leading-relaxed mb-12">
            An exclusive think tank and advisory board of India's top 100 industry leaders, shaping the next generation of startups.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <Award className="text-blue-500 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm mb-1">Elite Peer Group</h4>
              <p className="text-xs text-white/50">Engage in private forums with fellow CXOs and Venture Partners.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Building className="text-saffron mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm mb-1">Strategic Advisory</h4>
              <p className="text-xs text-white/50">Guide heavily vetted startups through critical growth phases.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="md:w-2/3 p-8 md:p-16 lg:p-24 overflow-y-auto relative bg-[#FAFAFA]">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center">
            <span className="font-heading font-extrabold text-[#050505] text-sm">BV</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-widest uppercase text-[#1A1E2E]">Vivachana<span className="text-saffron">Network</span></span>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Account Creation */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-heading font-bold text-3xl text-[#1A1E2E] mb-2">Create Account</h2>
                  <p className="text-gray-500 text-sm mb-8">This will be your login for the Mentor Dashboard and Think Tank.</p>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><User size={12}/> Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="Dr. Anand Raj"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><Mail size={12}/> Email Address</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="you@company.com"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><ShieldCheck size={12}/> Secure Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="Create a strong password"/>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Professional Identity */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-heading font-bold text-3xl text-[#1A1E2E] mb-2">Professional Identity</h2>
                  <p className="text-gray-500 text-sm mb-8">Highlight your career trajectory to aid in startup matchmaking.</p>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><Briefcase size={12}/> LinkedIn Profile URL</label>
                    <input type="url" required value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="https://linkedin.com/in/..."/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><Building size={12}/> Previous & Current Companies (Comma separated)</label>
                    <input type="text" required value={formData.previousCompanies} onChange={e => setFormData({...formData, previousCompanies: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="Google, Sequoia, Freshworks"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Brief Bio (For founders to read)</label>
                    <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black min-h-[100px]" placeholder="I am a 2x founder and currently CMO at..."></textarea>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Domain Expertise */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-heading font-bold text-3xl text-[#1A1E2E] mb-2">Domain Expertise</h2>
                  <p className="text-gray-500 text-sm mb-8">This drives our matchmaking engine to align you with the right startups.</p>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Core Expertise (Comma separated)</label>
                    <input type="text" required value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="Go-to-Market, Product Strategy, M&A"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Target Industries (Comma separated)</label>
                    <input type="text" required value={formData.industries} onChange={e => setFormData({...formData, industries: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors shadow-sm text-black" placeholder="SaaS, DeepTech, Fintech, Agritech"/>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                  ← Back
                </button>
              ) : <div></div>}

              <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-heading font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50">
                {step < 3 ? "Continue" : (submitting ? "Submitting..." : "Submit Profile")} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
