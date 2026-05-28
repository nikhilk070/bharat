"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Building, User, Mail, Briefcase, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InvestorApplicationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "", password: "", firmName: "", linkedin: "", pan: "",
    investorType: "VC", ticketSize: "$100k - $500k", sectors: "", geography: "", stagePreference: ""
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
        sectors: formData.sectors.split(",").map(s => s.trim()).filter(Boolean),
        geography: formData.geography.split(",").map(s => s.trim()).filter(Boolean),
        stagePreference: formData.stagePreference.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${apiUrl}/api/investors/apply`, {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green to-saffron"></div>
          <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green/20">
            <CheckCircle className="text-green w-10 h-10" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-white mb-4">Application Received</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Thank you for applying to the Bharat Ventures Syndicate. Our compliance team will review your application and KYC details. You will be notified via email once your dashboard access is unlocked.
          </p>
          <Link href="/investors" className="inline-block bg-white text-black px-8 py-3 rounded-xl font-heading font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
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
        <div className="absolute top-1/4 -right-1/4 w-[300px] h-[300px] bg-saffron/20 rounded-full blur-[100px] z-0"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center shadow-[0_0_15px_rgba(244,114,32,0.4)]">
              <span className="font-heading font-extrabold text-[#050505] text-sm">BV</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-widest uppercase">Bharat<span className="text-saffron">Ventures</span></span>
          </Link>

          <h1 className="font-heading font-extrabold text-5xl mb-6 leading-tight">Join the<br/>Private Syndicate</h1>
          <p className="text-white/60 text-lg leading-relaxed mb-12">
            Apply to access India's most rigorously vetted startups. Co-invest alongside leading CXOs, VCs, and Family Offices.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="text-green mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm mb-1">Rigorous Vetting</h4>
              <p className="text-xs text-white/50">Only 2% of startups pass our 4-stage due diligence.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Building className="text-saffron mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm mb-1">Direct Cap Table</h4>
              <p className="text-xs text-white/50">Clean cap tables and direct equity allocation.</p>
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
          <span className="font-heading font-bold text-lg tracking-widest uppercase text-[#1A1E2E]">Syndicate<span className="text-saffron">Application</span></span>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-[#1A1E2E]' : 'bg-gray-200'}`}></div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Account Creation */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-heading font-bold text-3xl text-[#1A1E2E] mb-2">Create Account</h2>
                  <p className="text-gray-500 text-sm mb-8">This will be your login for the Investor Dashboard.</p>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><Mail size={12}/> Email Address</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black" placeholder="you@firm.com"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><ShieldCheck size={12}/> Secure Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black" placeholder="Create a strong password"/>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Professional Identity */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-heading font-bold text-3xl text-[#1A1E2E] mb-2">Identity & KYC</h2>
                  <p className="text-gray-500 text-sm mb-8">We require verifiable information to maintain syndicate quality.</p>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><Building size={12}/> Firm or Individual Name</label>
                    <input type="text" required value={formData.firmName} onChange={e => setFormData({...formData, firmName: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black" placeholder="Your name or fund name"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><User size={12}/> LinkedIn Profile URL</label>
                    <input type="url" required value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black" placeholder="https://linkedin.com/in/..."/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><Briefcase size={12}/> PAN (For KYC)</label>
                    <input type="text" required value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black uppercase" placeholder="ABCDE1234F"/>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Investment Thesis */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-heading font-bold text-3xl text-[#1A1E2E] mb-2">Investment Thesis</h2>
                  <p className="text-gray-500 text-sm mb-8">This helps us curate and route the right startups to your dashboard.</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Investor Type</label>
                      <select value={formData.investorType} onChange={e => setFormData({...formData, investorType: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black cursor-pointer">
                        <option>VC</option>
                        <option>Family Office</option>
                        <option>Angel Syndicate</option>
                        <option>HNI / Angel</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Ticket Size</label>
                      <input type="text" required value={formData.ticketSize} onChange={e => setFormData({...formData, ticketSize: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black" placeholder="e.g. $50k - $250k"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 flex items-center gap-2"><MapPin size={12}/> Sector Focus (Comma separated)</label>
                    <input type="text" required value={formData.sectors} onChange={e => setFormData({...formData, sectors: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-saffron outline-none transition-colors shadow-sm text-black" placeholder="SaaS, DeepTech, Fintech"/>
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

              <button type="submit" disabled={submitting} className="bg-[#1A1E2E] text-white px-8 py-3.5 rounded-xl font-heading font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50">
                {step < 3 ? "Continue" : (submitting ? "Submitting..." : "Submit Application")} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
