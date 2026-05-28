"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Rocket, FileText, CheckCircle2, ArrowRight, ArrowLeft, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StartupApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    startupName: "",
    industry: "",
    stage: "",
    website: "",
    founderName: "",
    email: "",
    password: "",
    problem: "",
    solution: "",
    revenue: "",
    pitchDeck: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, pitchDeck: e.target.files[0] });
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value as Blob | string);
        }
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/apply`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setStep(4); // Success step
      } else {
        const err = await res.json();
        alert(err.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-saffron/30">
      
      {/* Navbar */}
      <nav className="h-20 border-b border-border flex items-center px-8 md:px-16 justify-between bg-card z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center shadow-[0_0_15px_rgba(244,114,32,0.4)]">
            <span className="font-heading font-extrabold text-white text-sm">BV</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-widest uppercase">Bharat<span className="text-saffron">Venture</span></span>
        </div>
        <button onClick={() => router.push("/login")} className="text-sm font-heading font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          Sign In
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Left Side - Progress / Info */}
        <div className="hidden md:flex w-1/3 bg-muted border-r border-border p-12 flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-20 pointer-events-none"></div>
          
          <h2 className="font-heading font-extrabold text-4xl mb-4 relative z-10 text-foreground">
            Join the <span className="text-saffron">Elite</span> Network.
          </h2>
          <p className="text-muted-foreground mb-12 relative z-10 leading-relaxed">
            Bharat Accelerator is the operating system for India's fastest-growing startups. 
            Apply now to get access to our exclusive network of mentors, CXOs, and top-tier investors.
          </p>

          <div className="space-y-8 relative z-10 flex-1">
            <div className={`flex items-start gap-4 transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > 1 ? 'bg-saffron border-saffron text-white' : step === 1 ? 'border-saffron text-saffron' : 'border-muted-foreground text-muted-foreground'}`}>
                {step > 1 ? <CheckCircle2 size={16} /> : 1}
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg">Basic Information</h4>
                <p className="text-xs text-muted-foreground mt-1">Tell us about you and your startup.</p>
              </div>
            </div>

            <div className={`flex items-start gap-4 transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > 2 ? 'bg-saffron border-saffron text-white' : step === 2 ? 'border-saffron text-saffron' : 'border-muted-foreground text-muted-foreground'}`}>
                {step > 2 ? <CheckCircle2 size={16} /> : 2}
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg">Business Details</h4>
                <p className="text-xs text-muted-foreground mt-1">Your problem, solution, and traction.</p>
              </div>
            </div>

            <div className={`flex items-start gap-4 transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > 3 ? 'bg-saffron border-saffron text-white' : step === 3 ? 'border-saffron text-saffron' : 'border-muted-foreground text-muted-foreground'}`}>
                3
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg">Review & Submit</h4>
                <p className="text-xs text-muted-foreground mt-1">Finalize your application.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-16 flex items-center justify-center relative">
          <div className="w-full max-w-xl">
            
            {step === 4 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green" />
                </div>
                <h2 className="font-heading font-extrabold text-4xl text-foreground">Application Submitted</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Thank you for applying to Bharat Accelerator. Our investment team is reviewing your profile and will be in touch shortly.
                </p>
                <button onClick={() => router.push('/')} className="mt-8 bg-card border border-border text-foreground px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest hover:bg-muted transition-colors">
                  Return Home
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="mb-8">
                        <h2 className="font-heading font-bold text-3xl text-foreground flex items-center gap-3">
                          <Building2 className="text-saffron" /> Basic Information
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">Let's start with the foundational details.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Founder Full Name</label>
                          <input required type="text" name="founderName" value={formData.founderName} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Founder Email</label>
                          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors" placeholder="john@startup.com" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Password</label>
                          <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors" placeholder="Create a strong password" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Startup Name</label>
                          <input required type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors" placeholder="Acme Inc." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Website (Optional)</label>
                          <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Industry</label>
                          <select required name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors appearance-none">
                            <option value="" disabled>Select Industry</option>
                            <option value="Fintech">Fintech</option>
                            <option value="Healthtech">Healthtech</option>
                            <option value="SaaS">Enterprise SaaS</option>
                            <option value="Edtech">Edtech</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Deeptech">Deeptech</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Stage</label>
                          <select required name="stage" value={formData.stage} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors appearance-none">
                            <option value="" disabled>Select Stage</option>
                            <option value="Idea">Idea / Concept</option>
                            <option value="Prototype">Prototype / MVP</option>
                            <option value="Pre-revenue">Pre-revenue</option>
                            <option value="Early Revenue">Early Revenue</option>
                            <option value="Growth">Growth / Series A+</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button type="button" onClick={nextStep} className="bg-foreground text-background px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                          Next Step <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="mb-8">
                        <h2 className="font-heading font-bold text-3xl text-foreground flex items-center gap-3">
                          <Rocket className="text-saffron" /> Business Details
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">What problem are you solving?</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Problem</label>
                          <textarea required name="problem" value={formData.problem} onChange={handleInputChange} rows={3} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors resize-none" placeholder="Describe the problem you are solving..."></textarea>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Solution</label>
                          <textarea required name="solution" value={formData.solution} onChange={handleInputChange} rows={3} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors resize-none" placeholder="How does your product solve this problem?"></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Monthly Revenue (INR)</label>
                          <input required type="text" name="revenue" value={formData.revenue} onChange={handleInputChange} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-saffron transition-colors" placeholder="e.g. ₹5,00,000 or 0" />
                        </div>
                      </div>

                      <div className="pt-6 flex justify-between">
                        <button type="button" onClick={prevStep} className="bg-muted text-foreground px-6 py-3 rounded-lg font-heading font-bold uppercase tracking-widest hover:bg-border transition-colors flex items-center gap-2">
                          <ArrowLeft size={16} /> Back
                        </button>
                        <button type="button" onClick={nextStep} className="bg-foreground text-background px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                          Next Step <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="mb-8">
                        <h2 className="font-heading font-bold text-3xl text-foreground flex items-center gap-3">
                          <FileText className="text-saffron" /> Pitch Deck
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">Upload your deck to complete the application.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center bg-card hover:border-saffron/50 transition-colors cursor-pointer relative group">
                          <input type="file" required accept=".pdf,.ppt,.pptx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-saffron/10 transition-colors">
                            <UploadCloud className="text-muted-foreground group-hover:text-saffron transition-colors" size={32} />
                          </div>
                          <h4 className="font-heading font-bold text-lg text-foreground mb-1">
                            {formData.pitchDeck ? formData.pitchDeck.name : 'Upload Pitch Deck'}
                          </h4>
                          <p className="text-xs text-muted-foreground text-center max-w-xs">
                            {formData.pitchDeck ? 'File selected successfully. Ready to submit.' : 'Drag and drop your PDF or PPT file here, or click to browse (Max 10MB).'}
                          </p>
                        </div>

                        <div className="bg-muted p-4 rounded-xl border border-border flex items-start gap-4">
                          <div className="text-saffron mt-1"><CheckCircle2 size={18} /></div>
                          <div>
                            <h5 className="font-bold text-sm text-foreground">Terms & Conditions</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              By submitting this application, you agree to Bharat Accelerator's Terms of Service and Privacy Policy. Your data is secure and will only be used for evaluation purposes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 flex justify-between">
                        <button type="button" onClick={prevStep} className="bg-muted text-foreground px-6 py-3 rounded-lg font-heading font-bold uppercase tracking-widest hover:bg-border transition-colors flex items-center gap-2">
                          <ArrowLeft size={16} /> Back
                        </button>
                        <button type="submit" disabled={loading} className="bg-saffron text-white px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                          {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
