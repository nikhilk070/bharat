"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function QuestionnaireWizard({ onSubmit, loading, schema }: { onSubmit: (data: any) => void, loading?: boolean, schema: any }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({});

  const updateData = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (!schema || !schema.steps || schema.steps.length === 0) return <div>Loading...</div>;

  const totalSteps = schema.steps.length;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      onSubmit(data);
    } else {
      nextStep();
    }
  };

  return (
    <div className="glass rounded-3xl border border-white/10 overflow-hidden w-full max-w-2xl mx-auto shadow-2xl">
      {/* Progress Bar */}
      <div className="flex border-b border-white/10 bg-white/5">
        {schema.steps.map((_: any, i: number) => (
          <div key={i} className="flex-1 h-1.5 relative">
            <div className={`absolute inset-0 transition-all duration-500 ${step >= i + 1 ? 'bg-saffron' : 'bg-transparent'}`}></div>
          </div>
        ))}
      </div>

      <div className="p-8 md:p-12">
        <h2 className="font-heading font-bold text-3xl mb-2">
          {schema.steps[step - 1]?.title}
        </h2>
        <p className="text-muted text-sm mb-8">Step {step} of {totalSteps}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div key={`step${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              {schema.steps[step - 1]?.fields.map((field: any, idx: number) => (
                <div key={idx}>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-heading">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required={field.required} 
                      value={data[field.name] || ''} 
                      onChange={(e) => updateData(field.name, e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-saffron" 
                      rows={3}
                    ></textarea>
                  ) : field.type === 'select' ? (
                    <select 
                      required={field.required} 
                      value={data[field.name] || ''} 
                      onChange={(e) => updateData(field.name, e.target.value)} 
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-saffron appearance-none"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input 
                      required={field.required} 
                      type="text"
                      value={data[field.name] || ''} 
                      onChange={(e) => updateData(field.name, e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-saffron" 
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-6 border-t border-white/10">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="text-muted hover:text-white px-4 py-2 font-heading uppercase text-xs tracking-widest transition-colors flex items-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div></div>}

            <button type="submit" disabled={loading} className="bg-saffron text-white px-8 py-3 rounded-lg font-heading font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
              {step === totalSteps ? (loading ? 'Submitting...' : 'Submit Profile') : 'Next Step'} {step < totalSteps && <ArrowRight size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
