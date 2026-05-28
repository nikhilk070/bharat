"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Save, User, Eye, EyeOff, Lock, Mail, ServerCrash, Key } from "lucide-react";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // New Sub-Admin State
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  const AVAILABLE_SCOPES = [
    { id: "MANAGE_SETTINGS", label: "Global Settings & Forms", desc: "Modify platform configurations and questionnaire builder." },
    { id: "MANAGE_STARTUPS", label: "Startup Pipelines", desc: "Approve, reject, or modify startup onboarding states." },
    { id: "MANAGE_DOCUMENTS", label: "Data Vaults", desc: "Access and verify confidential startup financial documents." },
    { id: "MANAGE_EVENTS", label: "Time-Bank Calendar", desc: "Manage mentor meetings and accelerator schedules." },
    { id: "MANAGE_VIVACHANA", label: "Vivachana Network", desc: "Curate CXO discussions and manage think-tank sessions." },
    { id: "MANAGE_INVESTORS", label: "Investor Ecosystem", desc: "Approve investor access and manage deal flow sharing." },
  ];

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/accelerator/team", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleScope = (userId: string, scopeId: string) => {
    setTeam(prev => prev.map(user => {
      if (user.id !== userId) return user;
      const scopes = Array.isArray(user.subAdminScopes) ? [...user.subAdminScopes] : [];
      if (scopes.includes(scopeId)) {
        return { ...user, subAdminScopes: scopes.filter(s => s !== scopeId) };
      } else {
        scopes.push(scopeId);
        return { ...user, subAdminScopes: scopes };
      }
    }));
  };

  const saveScopes = async (user: any) => {
    setSavingId(user.id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/accelerator/team/${user.id}/scopes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ scopes: user.subAdminScopes })
      });
      alert("Permissions updated successfully!");
    } catch (err) {
      alert("Failed to update permissions.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/accelerator/team", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail, password: newPassword, scopes: [] })
      });
      if (res.ok) {
        setNewEmail("");
        setNewPassword("");
        fetchTeam();
        alert("Sub-Admin created successfully!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create Sub-Admin");
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl">
      
      {/* Header */}
      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-saffron"></div>
        <h2 className="font-heading font-bold text-3xl mb-2 flex items-center gap-3 text-foreground">
          <Shield className="text-saffron" size={28} /> Sub-Admin RBAC
        </h2>
        <p className="text-muted-foreground text-sm">Control exactly what your Sub-Admins are allowed to access and modify across the entire platform ecosystem.</p>
      </div>

      {/* Create New Sub-Admin */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-foreground border-b border-border pb-3">
          <Plus size={18} className="text-saffron"/> Provision New Access
        </h3>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end pt-2">
          <div className="flex-1 w-full relative group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-saffron transition-colors" />
              <input 
                type="email" 
                required 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all" 
                placeholder="subadmin@bharatventure.com"
              />
            </div>
          </div>
          
          <div className="flex-1 w-full relative group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Initial Password</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-saffron transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full bg-background border border-border rounded-lg pl-10 pr-10 py-3 text-sm text-foreground focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all" 
                placeholder="Secure password..."
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={creating} 
            className="w-full md:w-auto bg-saffron text-white px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest text-sm hover:bg-saffron-light transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(244,114,32,0.2)] whitespace-nowrap"
          >
            {creating ? "Provisioning..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Existing Sub-Admins List */}
      <div className="space-y-6">
        <AnimatePresence>
          {team.map((user) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={user.id} 
              className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-8 relative overflow-hidden"
            >
              {/* Profile Sidebar */}
              <div className="lg:w-1/4 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-4">
                    <User size={20} className="text-saffron" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-1 truncate" title={user.email}>{user.email}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SUB_ADMIN</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-1">Assigned Scopes</p>
                  <p className="font-heading font-bold text-saffron text-2xl">
                    {Array.isArray(user.subAdminScopes) ? user.subAdminScopes.length : 0} <span className="text-sm text-muted-foreground">/ {AVAILABLE_SCOPES.length}</span>
                  </p>
                </div>
              </div>

              {/* Scopes Grid */}
              <div className="lg:w-3/4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role-Based Access Control (RBAC)</h5>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start mb-6">
                  {AVAILABLE_SCOPES.map(scope => {
                    const isChecked = Array.isArray(user.subAdminScopes) && user.subAdminScopes.includes(scope.id);
                    return (
                      <div 
                        key={scope.id} 
                        onClick={() => toggleScope(user.id, scope.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                          isChecked 
                            ? 'bg-saffron/5 border-saffron/50 shadow-[0_0_10px_rgba(244,114,32,0.05)]' 
                            : 'bg-background border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        {/* Toggle Switch Design */}
                        <div className={`mt-1 flex-shrink-0 w-8 h-4 rounded-full transition-colors relative ${isChecked ? 'bg-saffron' : 'bg-muted-foreground/30'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isChecked ? 'left-4.5' : 'left-0.5'}`}></div>
                        </div>
                        
                        <div>
                          <span className={`block text-sm font-bold mb-1 ${isChecked ? 'text-saffron' : 'text-foreground'}`}>
                            {scope.label}
                          </span>
                          <span className="block text-[10px] leading-relaxed text-muted-foreground">
                            {scope.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-border mt-auto">
                  <button 
                    onClick={() => saveScopes(user)}
                    disabled={savingId === user.id}
                    className="bg-background border border-border hover:border-saffron/50 hover:bg-saffron/5 hover:text-saffron text-foreground px-6 py-2.5 rounded-lg font-heading font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Save size={16} /> {savingId === user.id ? "Saving..." : "Save Configuration"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {team.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl text-muted-foreground bg-card">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Shield size={24} className="text-muted-foreground/50" />
            </div>
            <p className="font-heading font-bold text-lg text-foreground mb-1">No Sub-Admins Provisioned</p>
            <p className="text-sm">Create an account above to start delegating access.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
