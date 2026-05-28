"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Clock, FileText, Target, Activity, Settings, 
  LogOut, Menu, ChevronRight, Bell, Shield, Search 
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navGroups = [
    {
      title: "Workspace",
      items: [
        { href: "/startup", label: "Dashboard", icon: <LayoutDashboard size={18} />, exact: true },
        { href: "/startup/kpis", label: "Goals & KPIs", icon: <Target size={18} /> },
        { href: "/startup/progress", label: "Growth Tracking", icon: <Activity size={18} /> },
      ]
    },
    {
      title: "Resources",
      items: [
        { href: "/startup/sessions", label: "Time-Bank & Mentors", icon: <Clock size={18} /> },
        { href: "/startup/vault", label: "Data Vault", icon: <FileText size={18} /> },
      ]
    },
    {
      title: "Settings",
      items: [
        { href: "/startup/settings", label: "Profile", icon: <Settings size={18} /> },
      ]
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-saffron/30">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="flex-shrink-0 bg-card border-r border-border flex flex-col z-20 h-screen"
      >
        <div className="h-20 flex items-center px-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-green to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(29,176,90,0.4)]">
              <span className="font-heading font-extrabold text-white text-sm">BV</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-widest uppercase">Startup<span className="text-green">OS</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 px-2">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((link) => {
                  const isActive = 'exact' in link && link.exact ? pathname === link.href : pathname.startsWith(link.href);
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-heading font-semibold text-xs tracking-widest uppercase transition-all group ${
                        isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${isActive ? 'text-green' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`}>
                          {link.icon}
                        </div>
                        {link.label}
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_5px_rgba(29,176,90,0.8)]"></div>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-heading font-semibold text-xs tracking-widest uppercase transition-all text-red-400/70 hover:bg-red-500/10 hover:text-red-400 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-muted hover:bg-muted text-muted-foreground transition-colors"
            >
              {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Bharat Venture</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-green">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-green transition-colors" />
              <input 
                type="text" 
                placeholder="Search mentors, docs..." 
                className="bg-muted border border-border rounded-full pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-green transition-all w-64"
              />
            </div>
            <ThemeToggle />
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green rounded-full border border-[#050505]"></span>
            </button>
            <div className="h-8 w-px bg-muted"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border group-hover:border-border transition-all">
                <Shield size={14} className="text-green" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto relative bg-background p-6 md:p-10">
          <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-20 pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green/5 via-transparent to-saffron/5 pointer-events-none z-0"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
