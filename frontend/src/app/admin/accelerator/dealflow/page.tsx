"use client";

import { motion } from "framer-motion";
import { Eye, Lock, RefreshCw, Send, X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDealFlow() {
  const [startups, setStartups] = useState<any[]>([]);
  const [availableInvestors, setAvailableInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Track selected investor for each startup
  const [selectedInvestors, setSelectedInvestors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/investors/dealflow`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStartups(data.startups);
        setAvailableInvestors(data.availableInvestors);
      }
    } catch (err) {
      console.error("Failed to fetch deal flow matrix");
    } finally {
      setLoading(false);
    }
  };

  const handleGrant = async (startupId: string) => {
    const investorId = selectedInvestors[startupId];
    if (!investorId) return;

    setSyncing(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/investors/dealflow/grant`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ startupId, investorId })
      });
      if (res.ok) {
        // Reset selection and refresh
        setSelectedInvestors({ ...selectedInvestors, [startupId]: "" });
        await fetchMatrix();
      } else {
        alert("Failed to grant access. They may already have visibility.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleRevoke = async (startupId: string, investorId: string) => {
    setSyncing(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/investors/dealflow/revoke`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ startupId, investorId })
      });
      if (res.ok) {
        await fetchMatrix();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            Deal Flow Routing Matrix
          </h1>
          <p className="text-muted-foreground text-sm">Securely provision and revoke Due Diligence data room access for high-net-worth investors.</p>
        </div>
        <button 
          onClick={fetchMatrix}
          disabled={loading || syncing}
          className="bg-saffron text-black px-5 py-2.5 rounded-lg font-heading font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#f36b1d] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing..." : "Sync Matrix"}
        </button>
      </div>

      {/* Main List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl">
            Loading Deal Flow Matrix...
          </div>
        ) : startups.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl flex flex-col items-center">
            <AlertCircle size={40} className="mb-4 opacity-20" />
            No onboarded startups found. Complete legal onboarding for startups first.
          </div>
        ) : (
          startups.map((startup, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              key={startup.id} 
              className="bg-card border border-border rounded-2xl p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between shadow-sm hover:border-saffron/30 transition-colors"
            >
              
              {/* Startup Info */}
              <div className="w-full lg:w-1/3 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center font-heading font-bold text-foreground overflow-hidden">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover" />
                  ) : (
                    startup.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">{startup.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{startup.industry || 'Unknown Sector'}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold bg-green/10 text-green px-2 py-0.5 rounded uppercase tracking-wider">
                      <Lock size={10} /> Data Room Ready
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibilities */}
              <div className="w-full lg:flex-1 bg-muted/50 rounded-xl p-4 border border-border min-h-[90px]">
                <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Eye size={12} /> Granted Visibility
                </p>
                <div className="flex flex-wrap gap-2">
                  {startup.visibilities && startup.visibilities.length > 0 ? (
                    startup.visibilities.map((v: any) => (
                      <div key={v.id} className="group flex items-center gap-2 bg-background border border-border pl-3 pr-1 py-1 rounded-full text-xs font-semibold shadow-sm hover:border-red-500 transition-colors">
                        <span className="text-foreground">{v.investor.firmName}</span>
                        <button 
                          onClick={() => handleRevoke(startup.id, v.investorId)}
                          className="bg-muted hover:bg-red-500 hover:text-white p-1 rounded-full transition-colors text-muted-foreground"
                          title="Revoke Access"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No investors currently have access.</p>
                  )}
                </div>
              </div>

              {/* Grant Control */}
              <div className="w-full lg:w-64">
                <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">Provision Access</p>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saffron text-foreground cursor-pointer"
                    value={selectedInvestors[startup.id] || ""}
                    onChange={(e) => setSelectedInvestors({ ...selectedInvestors, [startup.id]: e.target.value })}
                  >
                    <option value="" disabled>Select Investor...</option>
                    {availableInvestors.map((inv) => (
                      <option key={inv.id} value={inv.id}>{inv.firmName}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleGrant(startup.id)}
                    disabled={!selectedInvestors[startup.id] || syncing}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send Secure Invite"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
