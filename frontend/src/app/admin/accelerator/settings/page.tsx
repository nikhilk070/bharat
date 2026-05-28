"use client";

import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="font-heading font-bold text-2xl mb-8">System Settings & Scopes</h2>
      
      <div className="space-y-8 max-w-xl">
        <div className="p-6 border border-white/10 rounded-xl bg-white/5">
          <h3 className="font-heading font-bold text-lg mb-4">AI Profiler Engine</h3>
          <p className="text-sm text-muted mb-6">Select which AI model handles the startup questionnaire analysis.</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="ai" className="accent-saffron w-4 h-4" defaultChecked />
              <span>OpenAI (GPT-4o)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="ai" className="accent-saffron w-4 h-4" />
              <span>Gemini (1.5 Flash)</span>
            </label>
          </div>
        </div>

        <div className="p-6 border border-white/10 rounded-xl bg-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg">Sub-Admin Roles</h3>
            <button className="text-xs uppercase tracking-widest font-bold text-saffron">+ Add Sub-Admin</button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-black/20 rounded border border-white/5">
              <span>Rohan Sharma</span>
              <span className="text-xs bg-white/10 text-muted px-2 py-1 rounded tracking-widest uppercase">Document Manager</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
