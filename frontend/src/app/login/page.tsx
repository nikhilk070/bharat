"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "ADMIN" || data.user.role === "SUB_ADMIN") {
        window.location.href = "/admin/accelerator";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-green/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-10 md:p-14 rounded-3xl border border-border w-full max-w-md relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
            <g transform="translate(25, 10)">
              <rect x="0" y="0" width="35" height="55" rx="8" fill="#F47421" transform="skewX(-18)" />
              <rect x="20" y="25" width="35" height="55" rx="8" fill="#1A9E5A" transform="skewX(-18)" />
            </g>
          </svg>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm font-light">Enter your credentials to access the portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-heading">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                placeholder="founder@startup.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-heading">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-12 text-foreground focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-saffron text-white py-4 rounded-xl font-heading font-bold tracking-widest uppercase text-sm hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(244,116,33,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
