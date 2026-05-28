"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Shield, Search, Building, Mail, MapPin, Target, DollarSign, Send, Copy, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminInvestors() {
  const [activeTab, setActiveTab] = useState("ROSTER"); // ROSTER, PENDING, PROVISION
  const [pendingInvestors, setPendingInvestors] = useState<any[]>([]);
  const [approvedInvestors, setApprovedInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Form State
  const [inviteData, setInviteData] = useState({
    email: "", firmName: "", investorType: "VC", ticketSize: "$100k - $500k", sectors: "", geography: "", stagePreference: ""
  });
  const [inviting, setInviting] = useState(false);
  const [credentials, setCredentials] = useState<{email: string, tempPassword: string} | null>(null);

  useEffect(() => {
    fetchInvestors();
  }, [activeTab]);

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      if (activeTab === "PENDING") {
        const res = await fetch(`${apiUrl}/api/investors/pending`, { headers: { "Authorization": `Bearer ${token}` }});
        if (res.ok) setPendingInvestors(await res.json());
      } else if (activeTab === "ROSTER") {
        const res = await fetch(`${apiUrl}/api/investors/approved`, { headers: { "Authorization": `Bearer ${token}` }});
        if (res.ok) setApprovedInvestors(await res.json());
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
      const res = await fetch(`${apiUrl}/api/investors/${id}/approve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPendingInvestors(pendingInvestors.filter(inv => inv.id !== id));
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
        ...inviteData,
        sectors: inviteData.sectors.split(",").map(s => s.trim()).filter(Boolean),
        geography: inviteData.geography.split(",").map(s => s.trim()).filter(Boolean),
        stagePreference: inviteData.stagePreference.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${apiUrl}/api/investors/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setCredentials({ email: data.email, tempPassword: data.tempPassword });
        setInviteData({ email: "", firmName: "", investorType: "VC", ticketSize: "$100k - $500k", sectors: "", geography: "", stagePreference: "" });
      } else {
        alert(data.message || "Failed to invite investor");
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
      navigator.clipboard.writeText(`Dashboard Link: https://app.bharatventures.in/login\nEmail: ${credentials.email}\nPassword: ${credentials.tempPassword}`);
      alert("Credentials copied to clipboard securely.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            <Building className="text-saffron" size={28} /> Investor Ecosystem
          </h1>
          <p className="text-muted-foreground text-sm">Manage the Syndicate, approve public applications, and actively provision LP access.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: "ROSTER", label: "Active Roster" },
          { id: "PENDING", label: "Pending Applications" },
          { id: "PROVISION", label: "Provision Access (Direct Invite)" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-heading font-bold text-sm tracking-widest uppercase transition-colors relative ${
              activeTab === tab.id ? "text-saffron" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="inv-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-saffron" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* =========================================================
            TAB: ROSTER
           ========================================================= */}
        {activeTab === "ROSTER" && (
          <motion.div key="roster" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center">
                <h3 className="font-heading font-bold uppercase tracking-widest text-xs text-muted-foreground">Verified Investors ({approvedInvestors.length})</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Search firm..." className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-saffron text-sm w-64" />
                </div>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading Roster...</div>
              ) : approvedInvestors.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No approved investors found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {approvedInvestors.map((inv, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors group">
                        <td className="p-4 w-16">
                           <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center font-heading font-bold text-lg text-foreground">
                             {inv.firmName?.charAt(0) || "U"}
                           </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-foreground text-sm flex items-center gap-2">
                            {inv.firmName} <Shield size={12} className="text-green" />
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10}/> {inv.user?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-foreground">{inv.investorType}</p>
                          <p className="text-xs text-muted-foreground">{inv.ticketSize}</p>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                          {inv.sectors?.length ? inv.sectors.join(", ") : "Sector Agnostic"}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-[10px] font-bold uppercase tracking-widest text-saffron opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                            View Deal Flow
                          </button>
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
            TAB: PENDING
           ========================================================= */}
        {activeTab === "PENDING" && (
          <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-muted/30 border-b border-border">
                <h3 className="font-heading font-bold uppercase tracking-widest text-xs text-muted-foreground">Pending KYC & Verification ({pendingInvestors.length})</h3>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading Applications...</div>
              ) : pendingInvestors.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <Shield size={32} className="mb-2 opacity-20" />
                  No pending investor applications.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {pendingInvestors.map((inv, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-foreground text-sm">{inv.firmName}</p>
                          <p className="text-xs text-muted-foreground">{inv.user?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-foreground">{inv.investorType}</p>
                          <p className="text-xs text-muted-foreground">{inv.ticketSize}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded border border-border">PAN: {inv.pan}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors">
                              Reject
                            </button>
                            <button onClick={() => handleApprove(inv.id)} className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-green/10 text-green rounded hover:bg-green/20 transition-colors">
                              Verify & Approve
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
            TAB: PROVISION
           ========================================================= */}
        {activeTab === "PROVISION" && (
          <motion.div key="provision" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            
            <div className="grid md:grid-cols-5 gap-8">
              
              <div className="md:col-span-3">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2 flex items-center gap-2"><Send size={24} className="text-saffron"/> Direct Invitation</h3>
                  <p className="text-muted-foreground text-sm mb-8">Bypass the public application queue by directly provisioning access for verified partners.</p>

                  <form onSubmit={handleInvite} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Primary Email</label>
                        <input type="email" required value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="partner@vc.com"/>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Firm / Syndicate Name</label>
                        <input type="text" required value={inviteData.firmName} onChange={e => setInviteData({...inviteData, firmName: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="Sequoia Capital"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Investor Type</label>
                        <select value={inviteData.investorType} onChange={e => setInviteData({...inviteData, investorType: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors cursor-pointer">
                          <option>VC</option>
                          <option>Family Office</option>
                          <option>Angel Syndicate</option>
                          <option>Micro VC</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Typical Ticket Size</label>
                        <input type="text" value={inviteData.ticketSize} onChange={e => setInviteData({...inviteData, ticketSize: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="$100k - $500k"/>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Sectors (Comma separated)</label>
                      <input type="text" value={inviteData.sectors} onChange={e => setInviteData({...inviteData, sectors: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-saffron outline-none transition-colors" placeholder="FinTech, SaaS, DeepTech"/>
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
                      <p className="text-center text-xs text-foreground/70 mb-8">Secure temporary credentials have been generated. Send these to the partner securely.</p>
                      
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
                       <p className="text-sm text-muted-foreground">Fill out the form to generate a secure, temporary password for the invited investor.</p>
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
