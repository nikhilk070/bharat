"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function MeetingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-xl">
      <h3 className="font-heading font-bold text-2xl mb-6">Meetings & MOM</h3>
      <div className="space-y-4">
        <div className="p-5 border border-white/10 rounded-lg flex justify-between items-center hover:border-saffron/50 transition-colors cursor-pointer">
          <div>
            <h4 className="font-heading font-bold text-lg">Initial Strategy Sync</h4>
            <p className="text-xs text-muted flex items-center gap-2 mt-1"><Calendar size={14} /> Tomorrow, 10:00 AM (2 hrs)</p>
          </div>
          <span className="bg-white/10 px-4 py-2 rounded text-xs font-bold tracking-widest uppercase">Scheduled</span>
        </div>
      </div>
    </motion.div>
  );
}
