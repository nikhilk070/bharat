"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Users, Briefcase, Check, X, Building, Mail, Award, Send, Copy, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function CXORosterPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE"); // ACTIVE, PENDING, ASSIGNMENTS, PROVISION
  const [activeCxos, setActiveCxos] = useState<any[]>([]);
  const [pendingCxos, setPendingCxos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Form State
  const [inviteData, setInviteData] = useState({
    email: "", expertise: "", industries: ""
  });
  const [inviting, setInviting] = useState(false);
  const [credentials, setCredentials] = useState<{email: string, tempPassword: string} | null>(null);

  useEffect(() => {
    fetchCxos();
  }, [activeTab]);

  const fetchCxos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      if (activeTab === "PENDING") {
        const res = await fetch(`${apiUrl}/api/vivachana/pending`, { headers: { "Authorization": `Bearer ${token}` }});
        if (res.ok) setPendingCxos(await res.json());
      } else if (activeTab === "ACTIVE") {
        const res = await fetch(`${apiUrl}/api/vivachana/active`, { headers: { "Authorization": `Bearer ${token}` }});
        if (res.ok) setActiveCxos(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vivachana/${id}/approve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPendingCxos(pendingCxos.filter(cxo => cxo.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const payload = {
        email: inviteData.email,
        expertise: inviteData.expertise.split(",").map(s => s.trim()).filter(Boolean),
        industries: inviteData.industries.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${apiUrl}/api/vivachana/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setCredentials({ email: data.email, tempPassword: data.tempPassword });
        setInviteData({ email: "", expertise: "", industries: "" });
      } else {
        alert(data.message || "Failed to invite CXO");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing invite");
    } finally {
      setInviting(false);
    }
  };

  const copyCredentials = () => {
    if (credentials) {
      navigator.clipboard.writeText(`Vivachana Dashboard: https://app.bharatventures.in/login\nEmail: ${credentials.email}\nPassword: ${credentials.tempPassword}`);
      alert("Credentials copied to clipboard securely.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            <Users className="text-saffron" size={28} /> CXO Roster
          </h1>
          <p className="text-muted-foreground text-sm">Manage the top 100 industry leaders, approve new mentors, and track strategic assignments.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {[
          { id: "ACTIVE", label: "Active Leaders" },
          { id: "PENDING", label: "Pending Approvals" },
          { id: "ASSIGNMENTS", label: "Startup Assignments" },
          { id: "PROVISION", label: "Provision Access" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-heading font-bold text-xs tracking-widest uppercase transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? "text-saffron" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="cxo-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-saffron" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* =========================================================
            TAB: ACTIVE CXOS
           ========================================================= */}
        {activeTab === "ACTIVE" && (
          <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center">
                <h3 className="font-heading font-bold uppercase tracking-widest text-xs text-muted-foreground">Vivachana Verified ({activeCxos.length})</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Search leaders..." className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-saffron text-sm w-64" />
                </div>
              </div>
              
              {loading ? (
                 <div className="p-12 text-center text-muted-foreground">Loading Roster...</div>
              ) : activeCxos.length === 0 ? (
                 <div className="p-12 text-center text-muted-foreground">No active CXOs found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {activeCxos.map((cxo, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors group">
                        <td className="p-4 w-16">
                           <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-heading font-bold text-lg text-foreground">
                             {cxo.user?.email?.charAt(0).toUpperCase()}
                           </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-foreground text-sm flex items-center gap-2">
                            {cxo.user?.email?.split('@')[0]} <Award size={14} className="text-saffron" />
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10}/> {cxo.user?.email}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {cxo.expertise.map((exp: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-1 rounded text-foreground border border-border">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-saffron">
                            <Star size={14} className="fill-saffron" />
                            <span className="text-sm font-bold">{cxo.rating.toFixed(1)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            TAB: PENDING APPROVALS
           ========================================================= */}
        {activeTab === "PENDING" && (
          <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-muted/30 border-b border-border">
                <h3 className="font-heading font-bold uppercase tracking-widest text-xs text-muted-foreground">Pending Review ({pendingCxos.length})</h3>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading Applications...</div>
              ) : pendingCxos.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <Users size={32} className="mb-2 opacity-20" />
                  No pending CXO applications.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {pendingCxos.map((cxo, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-foreground text-sm">{cxo.user?.email?.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10}/> {cxo.user?.email}</p>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-wrap gap-2">
                            {cxo.expertise.map((exp: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-1 rounded text-foreground border border-border">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors">
                              <X size={16} />
                            </button>
                            <button onClick={() => handleApprove(cxo.id)} className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-green/10 text-green rounded hover:bg-green/20 transition-colors flex items-center gap-2">
                              <Check size={14} /> Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            TAB: ASSIGNMENTS
           ========================================================= */}
        {activeTab === "ASSIGNMENTS" && (
          <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <Briefcase size={40} className="text-muted-foreground/30 mb-4" />
              <h4 className="font-heading font-bold text-lg text-foreground mb-2">No Active Assignments</h4>
              <p className="text-sm text-muted-foreground max-w-md">Once startups request advisory hours from the time-bank, assignments will appear here for you to track and manage.</p>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            TAB: PROVISION
           ========================================================= */}
        {activeTab === "PROVISION" && (
          <motion.div key="provision" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            
            <div className="grid md:grid-cols-5 gap-8">
              
              <div className="md:col-span-3">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2 flex items-center gap-2"><Send size={24} className="text-saffron"/> Direct Invitation</h3>
                  <p className="text-muted-foreground text-sm mb-8">Bypass the public application queue by directly provisioning access for verified CXOs.</p>

                  <form onSubmit={handleInvite} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Primary Email</label>
                      <input type="email" required value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="leader@company.com"/>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Expertise (Comma separated)</label>
                      <input type="text" value={inviteData.expertise} onChange={e => setInviteData({...inviteData, expertise: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="Go-to-Market, Scale-up, Growth"/>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Industries (Comma separated)</label>
                      <input type="text" value={inviteData.industries} onChange={e => setInviteData({...inviteData, industries: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="SaaS, DeepTech, Fintech"/>
                    </div>

                    <button type="submit" disabled={inviting} className="w-full bg-saffron text-white py-3.5 rounded-lg font-heading font-bold uppercase tracking-widest text-sm hover:bg-saffron-light transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(244,114,32,0.2)]">
                      {inviting ? "Generating Secure Access..." : "Generate Dashboard Invite"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="md:col-span-2">
                <AnimatePresence>
                  {credentials ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green/10 border border-green/30 rounded-2xl p-8 sticky top-8 shadow-[0_0_30px_rgba(29,176,90,0.1)]">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-green/20 flex items-center justify-center border border-green/50">
                          <Check className="text-green w-8 h-8" />
                        </div>
                      </div>
                      <h4 className="font-heading font-bold text-xl text-center text-green mb-2">Access Provisioned</h4>
                      <p className="text-center text-xs text-foreground/70 mb-8">Secure temporary credentials have been generated. Send these to the mentor securely.</p>
                      
                      <div className="space-y-4 mb-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-green/70 mb-1">Login Email</p>
                          <div className="bg-background border border-green/20 p-3 rounded text-sm font-mono text-foreground">{credentials.email}</div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-green/70 mb-1">Temporary Password</p>
                          <div className="bg-background border border-green/20 p-3 rounded text-sm font-mono text-foreground">{credentials.tempPassword}</div>
                        </div>
                      </div>

                      <button onClick={copyCredentials} className="w-full bg-green text-white py-3 rounded-lg font-heading font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-green/90 transition-colors">
                        <Copy size={16} /> Copy Credentials
                      </button>
                    </motion.div>
                  ) : (
                     <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                       <Shield size={40} className="text-muted-foreground/30 mb-4" />
                       <h4 className="font-heading font-bold text-lg text-foreground mb-2">Secure Provisioning</h4>
                       <p className="text-sm text-muted-foreground">Fill out the form to generate a secure, temporary password for the invited leader.</p>
                     </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
