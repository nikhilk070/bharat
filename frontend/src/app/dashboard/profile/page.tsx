"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";

export default function ProfilePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass rounded-2xl p-8">
        <h2 className="font-heading font-bold text-3xl mb-2">My Startup Profile</h2>
        <p className="text-muted">This is how Investors and Mentors see you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
            <h4 className="font-heading font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-green" /> Equity Structure</h4>
            <p className="text-muted text-sm mb-2">Bharat Accelerator Equity: <strong>5%</strong></p>
            <p className="text-muted text-sm">Available for Investment: <strong>10%</strong></p>
        </div>

        <div className="glass rounded-2xl p-6">
            <h4 className="font-heading font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-white" /> Connected Network</h4>
            <p className="text-muted text-sm italic">You are connected with Mentor: <strong>Arjun Mehta</strong></p>
        </div>
      </div>
    </motion.div>
  );
}
