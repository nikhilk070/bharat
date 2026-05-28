"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QuestionnaireWizard from "@/components/QuestionnaireWizard";
import AIChatInterviewer from "@/components/AIChatInterviewer";
import { useRouter } from "next/navigation";
import { Bot, FileText } from "lucide-react";

export default function DashboardQuestionnairePage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"form" | "chat">("chat");
  const [settings, setSettings] = useState<any>(null);
  const router = useRouter();

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
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/accelerator/questionnaire", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ questionnaireData: data }),
      });

      if (!res.ok) throw new Error("Failed to save questionnaire");
      
      // Update local storage or trigger re-render to unlock sidebar
      window.location.href = "/dashboard/overview";
    } catch (err) {
      console.error(err);
      alert("Error saving questionnaire. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8 text-center max-w-2xl mx-auto">
         <h2 className="font-heading font-bold text-3xl mb-2">Complete Your Profile</h2>
         <p className="text-muted text-sm">Since you were directly invited to the accelerator, please fill out this foundational questionnaire. Our AI will automatically generate your comprehensive profile to unlock the rest of your dashboard.</p>
      </div>
      
      {settings ? (
        <>
          {settings.onboardingMode === "USER_CHOICE" && (
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => setMode("chat")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all ${mode === 'chat' ? 'bg-saffron text-white' : 'bg-white/5 text-muted hover:bg-white/10'}`}
              >
                <Bot size={16} /> Chat with AI
              </button>
              <button 
                onClick={() => setMode("form")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all ${mode === 'form' ? 'bg-green text-white' : 'bg-white/5 text-muted hover:bg-white/10'}`}
              >
                <FileText size={16} /> Standard Form
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
        <div className="text-center text-muted">Loading Setup...</div>
      )}
    </motion.div>
  );
}
