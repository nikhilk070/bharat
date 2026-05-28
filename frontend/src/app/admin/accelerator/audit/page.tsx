"use client";

import { motion } from "framer-motion";
import { Activity, Search, ShieldAlert, CheckCircle, UserPlus, FileSignature, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/audit`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("APPROVE") || action.includes("ACCEPTED")) return <CheckCircle className="text-green" size={16} />;
    if (action.includes("INVITE") || action.includes("CREATE")) return <UserPlus className="text-blue-500" size={16} />;
    if (action.includes("SIGN") || action.includes("DOCUMENT")) return <FileSignature className="text-saffron" size={16} />;
    return <Activity className="text-muted-foreground" size={16} />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={28} /> Audit & Activity Logs
          </h1>
          <p className="text-muted-foreground text-sm">Real-time enterprise compliance tracking of all administrative actions across the platform.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search logs (e.g. CXO_APPROVED)" className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-saffron text-sm" />
        </div>
        <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-saffron text-foreground cursor-pointer">
          <option>All Entities</option>
          <option>Users & CXOs</option>
          <option>Startups</option>
          <option>Investors</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Fetching secure logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Activity size={32} className="mb-2 opacity-20" />
            No activity recorded yet.
          </div>
        ) : (
          <div className="relative border-l border-border ml-4 space-y-8 py-4">
            {logs.map((log, idx) => (
              <div key={idx} className="relative pl-8 group">
                <div className="absolute -left-3 top-1 bg-card border-2 border-border p-1 rounded-full group-hover:border-saffron transition-colors">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-1">
                  <h4 className="font-heading font-bold text-sm text-foreground tracking-wide">{log.action}</h4>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock size={10} /> {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-3 text-xs mt-2 overflow-x-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Entity ID ({log.entityType})</p>
                      <p className="font-mono text-foreground/80">{log.entityId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Admin ID</p>
                      <p className="font-mono text-foreground/80">{log.adminId || 'System'}</p>
                    </div>
                  </div>
                  {log.details && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Payload Details</p>
                      <pre className="font-mono text-[10px] text-saffron bg-saffron/5 p-2 rounded">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}
