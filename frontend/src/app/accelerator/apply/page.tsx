"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import QuestionnaireWizard from "@/components/QuestionnaireWizard";
import AIChatInterviewer from "@/components/AIChatInterviewer";
import Link from "next/link";
import { Bot, FileText } from "lucide-react";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"form" | "chat">("chat");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/accelerator/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setMode(data.onboardingMode === "FORM_ONLY" ? "form" : "chat");
      });
  }, []);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const email = data.founderName.toLowerCase().replace(/\s+/g, '') + '@example.com'; // Mock email for now, in a real app you'd ask for email in the first step.
      
      const payload = {
        email,
        startupName: data.startupName,
        questionnaireData: data
      };

      const res = await fetch("http://localhost:5000/api/accelerator/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit application");
      
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative pt-32 pb-20 px-6">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-green/10 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-saffron/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-5xl mb-4">Apply for Cohort</h1>
          <p className="text-muted text-lg">Tell us about your startup to begin the AI evaluation process.</p>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-3xl text-center border-green/30">
            <CheckCircle className="mx-auto text-green mb-6 w-20 h-20" />
            <h2 className="font-heading font-bold text-3xl mb-4">Application Submitted Successfully!</h2>
            <p className="text-muted text-lg mb-8 max-w-lg mx-auto">
              Our AI is currently profiling your startup. The Admin team will review your application shortly. If accepted, you will receive an email with your secure login credentials.
            </p>
            <Link href="/accelerator" className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest text-xs transition-colors">
              Return Home
            </Link>
          </motion.div>
        ) : settings ? (
          <>
            {settings.onboardingMode === "USER_CHOICE" && (
              <div className="flex justify-center gap-4 mb-8">
                <button 
                  onClick={() => setMode("chat")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all ${mode === 'chat' ? 'bg-saffron text-white shadow-[0_0_20px_rgba(244,116,33,0.3)]' : 'bg-white/5 text-muted hover:bg-white/10'}`}
                >
                  <Bot size={16} /> Let AI Interview You
                </button>
                <button 
                  onClick={() => setMode("form")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all ${mode === 'form' ? 'bg-green text-white shadow-[0_0_20px_rgba(29,176,90,0.3)]' : 'bg-white/5 text-muted hover:bg-white/10'}`}
                >
                  <FileText size={16} /> Fill Standard Form
                </button>
              </div>
            )}
            
            <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {mode === "chat" ? (
                <AIChatInterviewer onSubmit={handleSubmit} loading={loading} />
              ) : (
                <QuestionnaireWizard onSubmit={handleSubmit} loading={loading} schema={settings.questionnaireSchema} />
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center text-muted">Loading Application Form...</div>
        )}
      </div>
    </div>
  );
}
