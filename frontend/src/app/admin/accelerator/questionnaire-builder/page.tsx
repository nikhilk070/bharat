"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Settings, Save, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Edit3, Type, List, AlignLeft } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

type Step = {
  title: string;
  fields: Field[];
};

type Schema = {
  steps: Step[];
};

const DEFAULT_NEW_FIELD: Field = { name: "new_field", label: "New Question", type: "text", required: true };

export default function QuestionnaireBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("USER_CHOICE");
  const [schema, setSchema] = useState<Schema>({ steps: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/accelerator/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setMode(data.onboardingMode || "USER_CHOICE");
        
        if (data.questionnaireSchema && data.questionnaireSchema.steps) {
          setSchema(data.questionnaireSchema);
        } else {
          // Fallback Default
          setSchema({
            steps: [
              {
                title: "Company Basics",
                fields: [
                  { name: "startupName", label: "Startup Name", type: "text", required: true },
                  { name: "problemStatement", label: "Core Problem Solved", type: "textarea", required: true }
                ]
              }
            ]
          });
        }
      } catch (err) {
        console.error(err);
        setError("Could not load settings. Backend might be down.");
        setSchema({ steps: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    // Auto-generate safe machine names for fields that were just added
    const cleanSchema = {
      steps: schema.steps.map(step => ({
        ...step,
        fields: step.fields.map(field => ({
          ...field,
          name: field.name === "new_field" 
            ? field.label.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20) + "_" + Math.floor(Math.random()*1000) 
            : field.name
        }))
      }))
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/accelerator/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ onboardingMode: mode, questionnaireSchema: cleanSchema })
      });
      if (!res.ok) throw new Error("Save failed");
      
      setSchema(cleanSchema); // Update local state with the cleaned names
      alert("Form configuration saved successfully!");
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  // --- Mutators ---
  const addStep = () => {
    setSchema(prev => ({
      steps: [...prev.steps, { title: "New Category", fields: [{ ...DEFAULT_NEW_FIELD }] }]
    }));
  };

  const removeStep = (sIndex: number) => {
    setSchema(prev => ({
      steps: prev.steps.filter((_, i) => i !== sIndex)
    }));
  };

  const updateStepTitle = (sIndex: number, title: string) => {
    setSchema(prev => ({
      steps: prev.steps.map((s, i) => i === sIndex ? { ...s, title } : s)
    }));
  };

  const moveStep = (sIndex: number, direction: -1 | 1) => {
    setSchema(prev => {
      const newSteps = [...prev.steps];
      if (sIndex + direction < 0 || sIndex + direction >= newSteps.length) return prev;
      const temp = newSteps[sIndex];
      newSteps[sIndex] = newSteps[sIndex + direction];
      newSteps[sIndex + direction] = temp;
      return { steps: newSteps };
    });
  };

  const addField = (sIndex: number) => {
    setSchema(prev => ({
      steps: prev.steps.map((s, i) => i === sIndex ? { ...s, fields: [...s.fields, { ...DEFAULT_NEW_FIELD }] } : s)
    }));
  };

  const removeField = (sIndex: number, fIndex: number) => {
    setSchema(prev => ({
      steps: prev.steps.map((s, i) => i === sIndex ? { ...s, fields: s.fields.filter((_, fi) => fi !== fIndex) } : s)
    }));
  };

  const updateField = (sIndex: number, fIndex: number, key: keyof Field, value: any) => {
    setSchema(prev => ({
      steps: prev.steps.map((s, i) => i === sIndex ? {
        ...s,
        fields: s.fields.map((f, fi) => fi === fIndex ? { ...f, [key]: value } : f)
      } : s)
    }));
  };

  const moveField = (sIndex: number, fIndex: number, direction: -1 | 1) => {
    setSchema(prev => ({
      steps: prev.steps.map((s, i) => {
        if (i !== sIndex) return s;
        const newFields = [...s.fields];
        if (fIndex + direction < 0 || fIndex + direction >= newFields.length) return s;
        const temp = newFields[fIndex];
        newFields[fIndex] = newFields[fIndex + direction];
        newFields[fIndex + direction] = temp;
        return { ...s, fields: newFields };
      })
    }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-saffron"></div>
        <div>
          <h2 className="font-heading font-bold text-3xl text-foreground flex items-center gap-3">
            <Settings className="text-saffron" size={28} /> Dynamic Form Builder
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Design the exact data payload required for startup onboarding.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-saffron text-white px-6 py-3 rounded-lg font-heading font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-105 disabled:opacity-50 shadow-[0_0_15px_rgba(244,114,32,0.3)] transition-all"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Mode Selector */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h3 className="font-heading font-bold text-lg text-foreground mb-2">Delivery Mode</h3>
        <p className="text-muted-foreground text-sm mb-6">How should founders interface with this schema?</p>
        <div className="flex flex-wrap gap-4">
          {[
            { id: "USER_CHOICE", label: "User Choice", desc: "Founders pick AI Chat or Form" },
            { id: "AI_ONLY", label: "AI Chat Only", desc: "Force conversational AI flow" },
            { id: "FORM_ONLY", label: "Standard Form Only", desc: "Force standard text form" }
          ].map(m => (
            <button 
              key={m.id} 
              onClick={() => setMode(m.id)} 
              className={`flex flex-col items-start px-5 py-4 rounded-xl border transition-all ${
                mode === m.id 
                  ? 'bg-saffron/10 border-saffron text-foreground shadow-[0_0_15px_rgba(244,114,32,0.1)]' 
                  : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="font-heading font-bold text-sm tracking-widest uppercase mb-1">{m.label}</span>
              <span className="text-[10px] opacity-70">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Builder Layout */}
      <div className="space-y-6">
        <LayoutGroup>
          <AnimatePresence>
            {schema.steps.map((step, sIndex) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={`step-${sIndex}`} 
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Step Header */}
                <div className="bg-muted/30 border-b border-border p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3 w-full max-w-md">
                    <div className="flex flex-col gap-1 text-muted-foreground/50">
                      <button onClick={() => moveStep(sIndex, -1)} disabled={sIndex === 0} className="hover:text-foreground disabled:opacity-0"><ChevronUp size={16} /></button>
                      <button onClick={() => moveStep(sIndex, 1)} disabled={sIndex === schema.steps.length - 1} className="hover:text-foreground disabled:opacity-0"><ChevronDown size={16} /></button>
                    </div>
                    <div className="w-full relative">
                      <Edit3 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                      <input 
                        type="text" 
                        value={step.title}
                        onChange={(e) => updateStepTitle(sIndex, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-border text-xl font-heading font-bold text-saffron w-full py-1 pr-8 focus:outline-none focus:border-saffron transition-colors"
                        placeholder="Category Title"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => removeStep(sIndex)}
                    className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Fields List */}
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {step.fields.map((field, fIndex) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        key={`field-${sIndex}-${fIndex}`}
                        className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-background border border-border p-3 rounded-xl group hover:border-saffron/30 transition-colors"
                      >
                        {/* Order Controls */}
                        <div className="flex flex-row md:flex-col gap-1 text-muted-foreground/50 order-3 md:order-none ml-auto md:ml-0">
                          <button onClick={() => moveField(sIndex, fIndex, -1)} disabled={fIndex === 0} className="hover:text-foreground disabled:opacity-0"><ChevronUp size={14} /></button>
                          <button onClick={() => moveField(sIndex, fIndex, 1)} disabled={fIndex === step.fields.length - 1} className="hover:text-foreground disabled:opacity-0"><ChevronDown size={14} /></button>
                        </div>

                        {/* Label Input */}
                        <div className="flex-1 w-full">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider ml-1 mb-1 block">Question Prompt</label>
                          <input 
                            type="text" 
                            value={field.label}
                            onChange={(e) => updateField(sIndex, fIndex, 'label', e.target.value)}
                            className="bg-muted/50 border border-transparent focus:border-saffron/50 rounded-lg px-3 py-2 text-sm text-foreground w-full outline-none transition-all"
                            placeholder="e.g., What is your revenue?"
                          />
                        </div>

                        {/* Type Select */}
                        <div className="w-full md:w-48">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider ml-1 mb-1 block">Input Type</label>
                          <div className="relative">
                            <select 
                              value={field.type}
                              onChange={(e) => updateField(sIndex, fIndex, 'type', e.target.value)}
                              className="appearance-none bg-muted/50 border border-transparent focus:border-saffron/50 rounded-lg px-3 py-2 text-sm text-foreground w-full outline-none transition-all cursor-pointer"
                            >
                              <option value="text" className="bg-background text-foreground">Short Text</option>
                              <option value="textarea" className="bg-background text-foreground">Long Text (Paragraph)</option>
                              <option value="select" className="bg-background text-foreground">Dropdown Selection</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                              {field.type === 'text' && <Type size={14} />}
                              {field.type === 'textarea' && <AlignLeft size={14} />}
                              {field.type === 'select' && <List size={14} />}
                            </div>
                          </div>
                        </div>

                        {/* Required Toggle */}
                        <div className="flex items-center gap-2 pt-0 md:pt-5 cursor-pointer" onClick={() => updateField(sIndex, fIndex, 'required', !field.required)}>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${field.required ? 'bg-saffron border-saffron' : 'border-border bg-transparent'}`}>
                            {field.required && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="text-xs text-muted-foreground select-none">Required</span>
                        </div>

                        {/* Delete Field */}
                        <div className="pt-0 md:pt-5 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => removeField(sIndex, fIndex)}
                            className="text-red-500/50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.button 
                    layout
                    onClick={() => addField(sIndex)}
                    className="w-full border border-dashed border-border hover:border-saffron/50 bg-transparent hover:bg-saffron/5 text-muted-foreground hover:text-saffron py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
                  >
                    <Plus size={16} /> Add Question
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>

        <button 
          onClick={addStep}
          className="w-full bg-card border border-border hover:border-saffron/50 text-muted-foreground hover:text-saffron py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm group"
        >
          <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-saffron/10 flex items-center justify-center transition-colors">
            <Plus size={20} />
          </div>
          <span className="font-heading font-bold text-sm tracking-widest uppercase">Add New Category</span>
        </button>

      </div>
    </motion.div>
  );
}
