"use client";

import { motion } from "framer-motion";

export default function SupportPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-xl max-w-2xl">
      <h3 className="font-heading font-bold text-2xl mb-2">Helpdesk & Support</h3>
      <p className="text-muted text-sm mb-6">Report any issues with your onboarding process or portal access.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-heading">Issue Title</label>
          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saffron" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-heading">Description</label>
          <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saffron"></textarea>
        </div>
        <button className="bg-green text-white px-6 py-3 rounded font-heading font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
          Submit Ticket
        </button>
      </div>
    </motion.div>
  );
}
