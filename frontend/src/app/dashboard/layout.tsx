"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, Clock, FileText, LifeBuoy, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("http://localhost:5000/api/accelerator/my-startup", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setStartup(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch startup", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isQuestionnaireComplete = startup?.status !== "REQUESTED" && startup?.status !== "INVITED";

  const links = [
    { href: "/dashboard/overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/profile", label: "My Profile", icon: <User size={18} /> },
    { href: "/dashboard/meetings", label: "Meetings", icon: <Clock size={18} /> },
    { href: "/dashboard/documents", label: "Action Center", icon: <FileText size={18} /> },
    { href: "/dashboard/support", label: "Support", icon: <LifeBuoy size={18} /> },
  ];

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-saffron">Loading Portal...</div>;
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-background">
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-white/10 max-w-7xl mx-auto">
        <div>
          <h1 className="font-heading font-bold text-3xl">Founder Portal</h1>
          <p className="text-muted text-sm">Welcome back, {startup?.name || 'Founder'}</p>
        </div>
        
        {startup && (
          <div className="text-right hidden md:block">
            <div className="text-3xl font-heading font-bold text-green">
              {startup.remainingHours || 0} <span className="text-lg text-white">hrs</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted font-heading">Time-Bank</div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-8 max-w-7xl mx-auto">
        <div className="md:col-span-1 space-y-2">
          {isQuestionnaireComplete ? links.map((link) => {
            const isActive = pathname.includes(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-heading font-semibold text-sm tracking-widest uppercase transition-all ${
                  isActive ? 'bg-white text-black' : 'text-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            );
          }) : (
            <div className="text-xs text-muted uppercase tracking-widest p-4 glass rounded-lg border-saffron/20 text-saffron mb-4">
              Complete the questionnaire to unlock dashboard navigation.
            </div>
          )}

          {!isQuestionnaireComplete && (
            <Link 
              href="/accelerator/questionnaire"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-heading font-semibold text-sm tracking-widest uppercase transition-all bg-saffron text-white hover:scale-105"
            >
              Start Onboarding
            </Link>
          )}

          <div className="pt-8 mt-8 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-heading font-semibold text-sm tracking-widest uppercase transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
        <div className="md:col-span-4 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
}
