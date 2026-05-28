"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DealFlowPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDealFlow = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/investors/deal-flow", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStartups(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDealFlow();
  }, []);

  const handleRequestIntro = (startupName: string) => {
    alert(`Introduction request for ${startupName} sent to the Admin team. You will be notified shortly.`);
  };

  if (loading) return <div className="text-white/50 animate-pulse mt-10">Loading Deal Flow...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-4xl text-white mb-2">Curated Deal Flow</h1>
        <p className="text-white/50 max-w-2xl text-sm leading-relaxed">
          These startups have successfully graduated from our AI profiling and rigorous due-diligence onboarding process. They are currently raising active rounds.
        </p>
      </div>

      {/* Netflix-style Horizontal Scroll or Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {startups.map((startup, idx) => {
          const profile = startup.aiProfileData || {};
          return (
            <motion.div 
              key={startup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-green/40 transition-colors group flex flex-col"
            >
              {/* Card Header (Mock Cover Image) */}
              <div className="h-32 bg-gradient-to-br from-white/5 to-white/10 relative p-6 flex items-end">
                <div className="absolute top-4 right-4 bg-green/20 text-green border border-green/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md">
                  <ShieldCheck size={12} /> Vetted
                </div>
                <h3 className="font-heading font-bold text-2xl text-white relative z-10 truncate">{startup.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6 text-xs text-white/50 uppercase tracking-widest font-heading">
                  <span className="flex items-center gap-1.5"><Building2 size={14} className="text-white/30" /> {profile.industry || 'Unknown'}</span>
                  <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-white/30" /> {profile.stage || 'Unknown'}</span>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div>
                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Core Strength</h4>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {profile.strengths?.[0] || 'Strong initial traction and team composition.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Key Risk</h4>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {profile.risks?.[0] || 'Market saturation in specific tier-1 regions.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5 mt-auto">
                  <button 
                    onClick={() => handleRequestIntro(startup.name)}
                    className="w-full bg-white text-black py-3 rounded-lg font-heading font-bold uppercase tracking-widest text-xs hover:bg-green hover:text-white transition-colors"
                  >
                    Request Intro
                  </button>
                  <button className="w-full bg-transparent border border-white/10 text-white/70 py-3 rounded-lg font-heading font-bold uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <ExternalLink size={14} /> Data Room
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {startups.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <h3 className="text-xl font-heading font-bold text-white mb-2">No Active Deals</h3>
            <p className="text-white/50">There are currently no startups fully vetted and ready for investment.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
