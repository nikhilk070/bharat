"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, PieChart, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/analytics`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregates
  const avgHealth = data.length ? Math.round(data.reduce((acc, curr) => acc + curr.healthScore, 0) / data.length) : 0;
  const totalHoursConsumed = data.reduce((acc, curr) => acc + curr.hoursConsumed, 0);
  const totalAllocated = data.reduce((acc, curr) => acc + curr.allocatedHours, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground mb-2 flex items-center gap-3">
            <PieChart className="text-saffron" size={28} /> Ecosystem Analytics
          </h1>
          <p className="text-muted-foreground text-sm">Monitor accelerator health scores, Time-Bank consumption, and AI profiling metrics across the network.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-saffron/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center border border-saffron/20">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">Avg Network Health</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-heading font-bold text-foreground">{avgHealth}</span>
            <span className="text-sm font-bold text-muted-foreground mb-1">/100</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">Time-Bank Consumed</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-heading font-bold text-foreground">{totalHoursConsumed}</span>
            <span className="text-sm font-bold text-muted-foreground mb-1">hrs</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-green-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green/10 text-green flex items-center justify-center border border-green/20">
              <Activity size={20} />
            </div>
          </div>
          <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">Utilization Rate</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-heading font-bold text-foreground">
              {totalAllocated ? Math.round((totalHoursConsumed / totalAllocated) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="p-20 text-center text-muted-foreground bg-card border border-border rounded-2xl">
          Aggregating ecosystem metrics...
        </div>
      ) : data.length === 0 ? (
        <div className="p-20 text-center text-muted-foreground bg-card border border-border rounded-2xl flex flex-col items-center">
           <PieChart size={40} className="mb-4 opacity-20" />
           No data available. Onboard startups to populate analytics.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Health Score Distribution */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              Startup Health Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  />
                  <Bar dataKey="healthScore" fill="#f47220" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time-Bank Velocity */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              Time-Bank Consumption (Hrs)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }}/>
                  <Line type="monotone" dataKey="hoursConsumed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="Hours Used" />
                  <Line type="monotone" dataKey="allocatedHours" stroke="#888" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Total Allocated" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </motion.div>
  );
}
