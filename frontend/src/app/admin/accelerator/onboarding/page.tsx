"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OnboardingPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/startups", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const inProgress = data.startups.filter((s: any) => 
            s.status === "AI_PROFILED" || s.status === "UNDER_REVIEW"
          );
          setStartups(inProgress);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Active Onboarding Pipeline</h2>
          <p className="text-foreground/50 text-sm">Manage startups undergoing AI profiling and active review.</p>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted">
          <span className="font-heading font-bold text-xs tracking-widest uppercase text-foreground/50">Startups In-Progress</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/70">
            <thead className="bg-background text-foreground/40 text-[10px] uppercase font-heading tracking-widest border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Startup Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Time Remaining</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-foreground/30 italic">Loading active onboarding...</td>
                </tr>
              ) : startups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-foreground/30 italic">No startups in progress.</td>
                </tr>
              ) : (
                startups.map((startup) => (
                  <tr key={startup.id} className="border-b border-border hover:bg-muted transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground group-hover:text-saffron transition-colors">{startup.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {startup.status === "AI_PROFILED" ? (
                        <span className="text-[10px] bg-saffron/10 text-saffron px-2 py-1 rounded uppercase tracking-widest font-bold">AI Profiled</span>
                      ) : (
                        <span className="text-[10px] bg-green/10 text-green px-2 py-1 rounded uppercase tracking-widest font-bold">Under Review</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {startup.status === "UNDER_REVIEW" ? (
                        <div className="flex flex-col gap-1 w-32">
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-green h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, Math.max(0, (startup.remainingHours / (startup.allocatedHours || 1)) * 100))}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-foreground/40 text-right uppercase tracking-widest">
                            {startup.remainingHours}h Left
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground/50">Awaiting Allocation</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/accelerator/startups/${startup.id}`} className="bg-muted border border-border px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-muted text-foreground transition-colors">
                        View 360°
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
