"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, Activity, Building2, CheckCircle2, UserPlus, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboardOverview() {
  const kpis = [
    { title: "Total Startups", value: "124", change: "+12% this month", icon: <Building2 className="text-muted-foreground" />, link: "/admin/accelerator/onboarded" },
    { title: "Pending Requests", value: "18", change: "4 new today", icon: <UserPlus className="text-saffron" />, link: "/admin/accelerator/requests" },
    { title: "Active Deals", value: "8", change: "2 closing soon", icon: <Activity className="text-green" />, link: "/admin/accelerator/onboarding" },
    { title: "Time-Bank Hours", value: "1,450", change: "+120h this week", icon: <Clock className="text-blue-400" />, link: "/admin/accelerator/meetings" },
  ];

  // Mock Data for Charts
  const growthData = [
    { name: 'Jan', startups: 40 }, { name: 'Feb', startups: 60 }, { name: 'Mar', startups: 55 },
    { name: 'Apr', startups: 85 }, { name: 'May', startups: 100 }, { name: 'Jun', startups: 124 },
  ];

  const industryData = [
    { name: 'Fintech', value: 35 }, { name: 'Healthtech', value: 25 }, 
    { name: 'Edtech', value: 20 }, { name: 'SaaS', value: 44 }
  ];
  const COLORS = ['#F47220', '#22c55e', '#60a5fa', '#a855f7'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-4xl text-foreground mb-2">Welcome to Command Center</h1>
        <p className="text-muted-foreground">Here is what's happening across the Bharat Accelerator ecosystem today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Link href={kpi.link} key={idx} className="block">
            <div className="bg-card border border-border p-6 rounded-2xl hover:border-border transition-all hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-muted transition-colors">
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-muted-foreground text-xs font-heading font-bold uppercase tracking-widest mb-1">{kpi.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-heading font-bold text-foreground">{kpi.value}</span>
                <span className="text-[10px] text-green/80 bg-green/10 px-2 py-1 rounded mb-1">{kpi.change}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Startup Growth Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-saffron" size={20} />
            <h3 className="font-heading font-bold text-lg text-foreground">Startup Onboarding Growth</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F47220" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F47220" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="startups" stroke="#F47220" strokeWidth={3} fillOpacity={1} fill="url(#colorStartups)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="text-green" size={20} />
            <h3 className="font-heading font-bold text-lg text-foreground">Industry Focus</h3>
          </div>
          <div className="h-48 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {industryData.map((ind, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-xs text-muted-foreground">{ind.name} ({ind.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">Recent Pipeline Activity</h3>
            <Link href="/admin/accelerator/requests" className="text-xs text-saffron hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Nexus AI", action: "Submitted Questionnaire", time: "2 hours ago", status: "Action Required" },
              { name: "HealthTech Solutions", action: "Completed AI Profiling", time: "5 hours ago", status: "Under Review" },
              { name: "AgriChain", action: "Uploaded Cap Table", time: "1 day ago", status: "Action Required" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-saffron animate-pulse"></div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{activity.name}</h4>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground mb-1">{activity.time}</p>
                  <span className="text-[9px] uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-muted-foreground">{activity.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-saffron/20 to-transparent border border-saffron/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-2xl group-hover:bg-saffron/20 transition-all"></div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">Invite Startup</h3>
            <p className="text-sm text-muted-foreground mb-6 relative z-10">Generate a secure link to bypass the waitlist and invite a high-value startup.</p>
            <button className="bg-saffron text-foreground px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform w-full shadow-xl">
              Create Invite
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">AI Profiling Engine</span>
                <span className="flex items-center gap-2 text-green"><CheckCircle2 size={14} /> Online</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Data Rooms (AWS)</span>
                <span className="flex items-center gap-2 text-green"><CheckCircle2 size={14} /> Online</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
