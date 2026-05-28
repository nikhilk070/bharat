"use client";

import { motion } from "framer-motion";
import { FileText, Download, Users, TrendingUp, Clock, AlertCircle, CheckCircle2, Building2, UploadCloud, ChevronRight, Activity, Calendar, X } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isDocModalOpen, setDocModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isStageModalOpen, setStageModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchStartup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/startups/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStartup(data.startup);
      } else {
        console.error("Startup not found");
      }
    } catch (error) {
      console.error("Error fetching startup:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartup();
  }, [id]);

  // Handlers
  const handleUploadDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/accelerator/documents", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startupId: id,
          heading: formData.get("heading"),
          fileUrl: formData.get("fileUrl") || undefined,
          signatureRequired: formData.get("signatureRequired") === "true",
        })
      });
      setDocModalOpen(false);
      fetchStartup();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleScheduleEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/accelerator/meetings", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startupId: id,
          heading: formData.get("heading"),
          scheduledAt: formData.get("scheduledAt"),
          durationHours: parseInt(formData.get("durationHours") as string, 10),
          meetingLink: formData.get("meetingLink"),
          isOffline: formData.get("isOffline") === "true",
        })
      });
      setEventModalOpen(false);
      fetchStartup();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAdvanceStage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const token = localStorage.getItem("token");
      
      if (startup.status === "QUESTIONNAIRE_SUBMITTED" || startup.status === "AI_PROFILED" || startup.status === "REQUESTED") {
        await fetch(`http://localhost:5000/api/accelerator/startups/${id}/allocate`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            allocatedHours: parseInt(formData.get("allocatedHours") as string, 10),
            allocatedDays: parseInt(formData.get("allocatedDays") as string, 10),
          })
        });
      } else if (startup.status === "UNDER_REVIEW") {
        await fetch(`http://localhost:5000/api/accelerator/startups/${id}/decision`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            decision: formData.get("decision")
          })
        });
      }
      setStageModalOpen(false);
      fetchStartup();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div className="text-muted-foreground animate-pulse p-10">Loading 360° Profile...</div>;
  if (!startup) return <div className="p-10 text-muted-foreground">Startup not found.</div>;

  const profile = startup.aiProfileData || {};
  const documents = startup.documents || [];
  const events = startup.events || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20 max-w-[1600px] mx-auto">
      
      {/* 1. HEADER & GLOBAL ACTIONS */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${
              startup.status === 'ONBOARDED' ? 'bg-green/10 text-green border-green/30' :
              startup.status === 'UNDER_REVIEW' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
              'bg-saffron/10 text-saffron border-saffron/30'
            }`}>
              {startup.status.replace('_', ' ')}
            </span>
            <span className="text-muted-foreground text-xs font-heading tracking-widest uppercase">ID: {startup.id.substring(0,8)}</span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl mb-2 text-foreground">{startup.name}</h2>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5"><Building2 size={16} /> {startup.industry || profile.industry || 'Unknown'}</span>
            <span className="flex items-center gap-1.5"><TrendingUp size={16} /> {startup.stage || profile.stage || 'Unknown'}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">|</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">Founder: {startup.founder?.email}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          {startup.status !== 'ONBOARDED' && startup.status !== 'REJECTED' && (
            <button 
              onClick={() => setStageModalOpen(true)}
              className="bg-saffron text-foreground px-6 py-3 rounded-lg font-heading font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(244,114,32,0.3)]"
            >
              Advance Stage
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile & Questionnaire */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-2 text-foreground">
              <Activity className="text-saffron" size={20} /> AI Profile Analysis
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] text-green uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                  <CheckCircle2 size={14} /> Identified Strengths
                </h4>
                <ul className="space-y-3">
                  {(profile.strengths || ['Strong founder background', 'Clear market gap identified']).map((s: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-green/20 pl-3">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] text-saffron uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                  <AlertCircle size={14} /> Key Risks / Red Flags
                </h4>
                <ul className="space-y-3">
                  {(profile.risks || ['High competitive density', 'Unclear monetization strategy']).map((r: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-saffron/20 pl-3">{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-xl flex items-center gap-2 text-foreground">
                <FileText className="text-muted-foreground" size={20} /> Document Room
              </h3>
              <button 
                onClick={() => setDocModalOpen(true)}
                className="text-[10px] bg-muted hover:bg-muted text-muted-foreground px-3 py-1.5 rounded uppercase tracking-widest font-bold transition-colors flex items-center gap-2"
              >
                <UploadCloud size={14} /> Request Document
              </button>
            </div>

            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 bg-muted border border-border rounded-xl flex justify-between items-center hover:border-border transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground group-hover:text-saffron transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{doc.heading}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Status: {doc.status}</div>
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Download size={18} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground mb-3">No documents uploaded by this startup yet.</p>
                <button onClick={() => setDocModalOpen(true)} className="text-xs text-saffron underline hover:text-saffron-light">Send Document Request</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Operations & Meta */}
        <div className="space-y-6">
          
          <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
             <h4 className="font-heading font-bold mb-6 flex items-center gap-2 text-foreground"><Clock size={18} className="text-blue-400" /> Time-Bank Management</h4>
             
             <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-muted p-4 rounded-xl border border-border">
                 <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Allocated</div>
                 <div className="text-2xl font-heading font-bold text-foreground">{startup.allocatedHours || 0}h</div>
               </div>
               <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                 <div className="text-[10px] text-blue-400/70 uppercase tracking-widest mb-1">Remaining</div>
                 <div className="text-2xl font-heading font-bold text-blue-400">{startup.remainingHours || 0}h</div>
               </div>
             </div>

             <div className="space-y-4">
               <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-between">
                 Scheduled Events
                 <button onClick={() => setEventModalOpen(true)} className="text-saffron hover:underline">Add</button>
               </div>
               {events.length > 0 ? events.map((event: any) => (
                 <div key={event.id} className="flex gap-3 items-start">
                   <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                     <Calendar size={14} className="text-muted-foreground" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-foreground">{event.heading}</div>
                     <div className="text-xs text-muted-foreground mt-1">{new Date(event.scheduledAt).toLocaleString()} ({event.durationHours}h)</div>
                   </div>
                 </div>
               )) : (
                 <div className="text-xs text-muted-foreground italic">No events scheduled.</div>
               )}
             </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
             <h4 className="font-heading font-bold mb-4 flex items-center gap-2 text-foreground"><Users size={18} className="text-muted-foreground" /> Investor Interest</h4>
             <p className="text-muted-foreground text-xs leading-relaxed mb-4">
               When this startup reaches the ONBOARDED stage, they will be visible in the Investor Syndicate Deal-Flow.
             </p>
             <div className="bg-muted border border-border rounded-xl p-4 flex items-center justify-between">
               <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Active Pledges</div>
               <div className="text-lg font-heading font-bold text-green">{startup.investments?.length || 0}</div>
             </div>
          </div>
        </div>
      </div>
      
      {/* MODALS */}

      {/* Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setDocModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">Request/Upload Document</h3>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Document Heading</label>
                <input required name="heading" type="text" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="e.g. Founder Agreement" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">File URL (Optional)</label>
                <input name="fileUrl" type="url" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="signatureRequired" id="sigReq" value="true" className="w-4 h-4 accent-saffron" />
                <label htmlFor="sigReq" className="text-sm text-muted-foreground">Signature Required?</label>
              </div>
              <button disabled={formLoading} type="submit" className="w-full bg-saffron text-foreground font-bold py-3 rounded mt-4 disabled:opacity-50">
                {formLoading ? 'Processing...' : 'Add Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setEventModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">Schedule Event</h3>
            <form onSubmit={handleScheduleEvent} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Meeting Heading</label>
                <input required name="heading" type="text" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="e.g. Mentorship Session" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Date & Time</label>
                  <input required name="scheduledAt" type="datetime-local" className="w-full bg-muted border border-border rounded p-3 text-foreground [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Duration (Hours)</label>
                  <input required name="durationHours" type="number" min="1" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="e.g. 2" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Meeting Link</label>
                <input name="meetingLink" type="url" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="https://zoom.us/..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="isOffline" id="isOff" value="true" className="w-4 h-4 accent-saffron" />
                <label htmlFor="isOff" className="text-sm text-muted-foreground">Is Offline Event?</label>
              </div>
              <button disabled={formLoading} type="submit" className="w-full bg-saffron text-foreground font-bold py-3 rounded mt-4 disabled:opacity-50">
                {formLoading ? 'Processing...' : 'Schedule Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stage Modal */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setStageModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">Advance Stage</h3>
            
            <form onSubmit={handleAdvanceStage} className="space-y-4">
              
              {(startup.status === 'QUESTIONNAIRE_SUBMITTED' || startup.status === 'AI_PROFILED' || startup.status === 'REQUESTED') && (
                <>
                  <p className="text-sm text-muted-foreground mb-4">You are moving this startup to <b>UNDER REVIEW</b>. Please allocate Time-Bank hours.</p>
                  <div>
                    <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Allocated Hours</label>
                    <input required name="allocatedHours" type="number" min="1" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="e.g. 20" />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Allocated Days (Deadline)</label>
                    <input required name="allocatedDays" type="number" min="1" className="w-full bg-muted border border-border rounded p-3 text-foreground" placeholder="e.g. 7" />
                  </div>
                </>
              )}

              {startup.status === 'UNDER_REVIEW' && (
                <>
                  <p className="text-sm text-muted-foreground mb-4">Make a final decision on this startup to move them out of Under Review.</p>
                  <div>
                    <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Decision</label>
                    <select required name="decision" className="w-full bg-muted border border-border rounded p-3 text-foreground">
                      <option value="ONBOARDED">Approve & Onboard</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </div>
                </>
              )}

              <button disabled={formLoading} type="submit" className="w-full bg-saffron text-foreground font-bold py-3 rounded mt-4 disabled:opacity-50">
                {formLoading ? 'Processing...' : 'Confirm Action'}
              </button>
            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
}
