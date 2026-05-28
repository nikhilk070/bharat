"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OnboardedPage() {
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
          const onboarded = data.startups.filter((s: any) => s.status === "ONBOARDED");
          setStartups(onboarded);
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
          <h2 className="font-heading font-bold text-2xl text-foreground">Onboarded Portfolio</h2>
          <p className="text-foreground/50 text-sm">View and manage fully onboarded startups in the accelerator program.</p>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted">
          <span className="font-heading font-bold text-xs tracking-widest uppercase text-foreground/50">Active Startups</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/70">
            <thead className="bg-background text-foreground/40 text-[10px] uppercase font-heading tracking-widest border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Startup Name</th>
                <th className="px-6 py-4 font-semibold">Industry</th>
                <th className="px-6 py-4 font-semibold">Stage</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/30 italic">Loading portfolio...</td>
                </tr>
              ) : startups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/30 italic">No onboarded startups yet.</td>
                </tr>
              ) : (
                startups.map((startup) => (
                  <tr key={startup.id} className="border-b border-border hover:bg-muted transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground group-hover:text-saffron transition-colors">{startup.name}</div>
                      <div className="text-[10px] text-foreground/40">{startup.aiProfileData?.industry || startup.industry || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">{startup.industry || startup.aiProfileData?.industry || 'Unknown'}</td>
                    <td className="px-6 py-4 text-xs">{startup.stage || startup.aiProfileData?.stage || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-[10px] bg-green/10 text-green px-2 py-1 rounded uppercase tracking-widest font-bold w-max">
                        <CheckCircle size={12} /> Active
                      </span>
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
