"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function RequestsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/accelerator/requests`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchRequests();
  }, []);

  const dummyRequest = { id: "dummy", name: "[Example] Nexus AI", email: "founder@nexus.ai", time: "Requested 2 hrs ago" };

  const handleAccept = async (id: string) => {
    setLoading(id);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/accelerator/requests/${id}/accept`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to accept");
      
      alert("Startup accepted! Email with credentials has been sent.");
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error accepting startup");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Startup Requests & Invites</h2>
          <p className="text-muted-foreground text-sm">Review incoming applications and generate fast-track invites.</p>
        </div>
        <button className="bg-saffron text-foreground px-5 py-2.5 rounded-lg font-heading font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(244,114,32,0.3)]">
          + Direct Invite
        </button>
      </div>
      
      {/* Table Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        
        {/* Table Header / Filters */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted">
          <span className="font-heading font-bold text-xs tracking-widest uppercase text-muted-foreground">Pending Applications</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-background text-muted-foreground text-[10px] uppercase font-heading tracking-widest border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Startup Name</th>
                <th className="px-6 py-4 font-semibold">Founder Email</th>
                <th className="px-6 py-4 font-semibold">Submitted</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground italic">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-muted-foreground mb-2">No pending requests</p>
                    <p className="text-xs text-muted-foreground">New applications will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                <>
                  {requests.map(req => (
                    <tr key={req.id} className="border-b border-border hover:bg-muted transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground group-hover:text-saffron transition-colors">{req.name}</div>
                      </td>
                      <td className="px-6 py-4">{req.founder?.email}</td>
                      <td className="px-6 py-4 text-xs">{formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/accelerator/startups/${req.id}`}>
                            <button className="bg-muted border border-border px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-muted text-foreground">
                              View 360°
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleAccept(req.id)}
                            disabled={loading === req.id}
                            className="bg-saffron text-foreground px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-saffron-light disabled:opacity-50 transition-colors"
                          >
                            {loading === req.id ? "Accepting..." : "Accept"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
