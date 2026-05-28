"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("http://localhost:5000/api/accelerator/my-startup", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setStartup(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [router]);

  if (loading) return <div className="text-white/50 animate-pulse">Loading overview...</div>;
  if (!startup) return null;

  const aiProfile = startup.aiProfileData;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Dynamic Status Alert */}
      {startup.status === 'QUESTIONNAIRE_SUBMITTED' && (
        <div className="p-4 bg-saffron/10 border border-saffron/20 rounded-xl flex items-start gap-4">
          <AlertCircle className="text-saffron shrink-0 mt-1" />
          <div>
            <h4 className="font-heading font-bold text-saffron">AI Profiling In Progress</h4>
            <p className="text-sm text-saffron/80 mt-1">Your application has been received. Our AI is currently generating a profile for your startup. This usually takes less than 2 minutes.</p>
          </div>
        </div>
      )}

      {/* AI Profile Viewer */}
      {aiProfile && (
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-heading font-bold text-2xl text-white">AI Generated Profile</h3>
            <span className="bg-white/5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded text-white/50 border border-white/10">
              Confidence: {aiProfile.confidenceScore || 85}%
            </span>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Based on your onboarding inputs, our AI determined your startup belongs in the <b className="text-white">{aiProfile.industry}</b> sector at the <b className="text-white">{aiProfile.stage}</b> stage. 
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm tracking-widest uppercase text-green">Strengths</h4>
              <ul className="space-y-2">
                {(aiProfile.strengths || []).map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 size={16} className="text-green shrink-0 mt-0.5" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm tracking-widest uppercase text-saffron">Key Risks</h4>
              <ul className="space-y-2">
                {(aiProfile.risks || []).map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <AlertCircle size={16} className="text-saffron shrink-0 mt-0.5" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Time-Bank Alert */}
      {startup.status === 'UNDER_REVIEW' && startup.onboardingDeadline && (
        <div className="p-6 bg-green/10 border border-green/20 rounded-2xl flex items-start gap-4">
          <Clock className="text-green shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-heading font-bold text-lg text-green mb-2">Onboarding Timer Active</h4>
            <p className="text-sm text-green/80">
              You have been allocated <b>{startup.allocatedHours} hours</b> in the Time-Bank to complete your onboarding process. 
              The deadline for completion is <b>{new Date(startup.onboardingDeadline).toLocaleDateString()}</b>. 
              Please schedule your preliminary meetings.
            </p>
          </div>
        </div>
      )}

    </motion.div>
  );
}
