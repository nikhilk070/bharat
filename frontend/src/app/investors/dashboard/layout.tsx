"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function InvestorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const links = [
    { href: "/investors/dashboard", label: "Deal Flow", icon: <LayoutDashboard size={18} /> },
    { href: "/investors/dashboard/portfolio", label: "My Portfolio", icon: <Briefcase size={18} /> },
    { href: "/investors/dashboard/data-rooms", label: "Data Rooms", icon: <FileText size={18} /> },
    { href: "/investors/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-white/5 bg-[#0A0A0A] px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <Link href="/investors" className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-white/40 group-hover:text-saffron transition-colors" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-green to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <span className="font-heading font-extrabold text-white text-sm">BV</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-widest uppercase">Investor<span className="text-green">Syndicate</span></span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-widest transition-all ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon} {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-red-400/80 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
