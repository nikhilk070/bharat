"use client";

import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";

export default function DocumentsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-heading font-bold text-2xl">Global Document Hub</h2>
        <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Upload size={14} /> Request Document
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-5 border border-white/10 bg-white/5 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FileText className="text-muted" />
            <div>
              <h4 className="font-bold">Term Sheet - FinFlow</h4>
              <p className="text-xs text-muted mt-1">Requested 2 days ago</p>
            </div>
          </div>
          <span className="bg-saffron/20 text-saffron px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Pending Signature</span>
        </div>
      </div>
    </motion.div>
  );
}
