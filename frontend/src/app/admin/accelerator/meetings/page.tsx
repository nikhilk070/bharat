"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function MeetingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-heading font-bold text-2xl">Time-Bank & Events</h2>
        <button className="bg-green text-white px-4 py-2 rounded font-heading font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
          + Schedule Event
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-5 border border-white/10 rounded-lg flex justify-between items-center hover:border-saffron/50 transition-colors">
          <div>
            <h4 className="font-heading font-bold text-lg">Strategy Sync - Nexus AI</h4>
            <p className="text-xs text-muted flex items-center gap-2 mt-1"><Calendar size={14} /> Tomorrow, 10:00 AM (2 hrs deduction)</p>
          </div>
          <button className="bg-white/10 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest">Complete & Deduct Time</button>
        </div>
      </div>
    </motion.div>
  );
}
