"use client";

import { motion } from "framer-motion";
import { FileCheck } from "lucide-react";

export default function DocumentsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-xl">
      <h3 className="font-heading font-bold text-2xl mb-6">Action Center</h3>
      <div className="space-y-4">
        <div className="p-5 border border-saffron/50 bg-saffron/5 rounded-lg flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <FileCheck className="text-saffron" />
            <div>
              <h4 className="font-heading font-bold text-lg">Accelerator Term Sheet</h4>
              <p className="text-xs text-muted mt-1">Signature Required</p>
            </div>
          </div>
          <button className="bg-saffron text-white px-6 py-2 rounded font-heading font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
            Sign Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
