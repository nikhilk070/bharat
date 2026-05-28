"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? "up" : ""}>
      <div className="nl">
        <div className="nm">
          <div className="nma"></div>
          <div className="nmb"></div>
        </div>
        <div className="nw">BHARAT<small>VENTURES</small></div>
      </div>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/accelerator">Accelerator</Link></li>
        <li><Link href="/investors">Investors</Link></li>
        <li><Link href="/vivachana">Vivechana</Link></li>
      </ul>
      <div className="flex items-center gap-4">
        <Link href="/login">
          <button className="px-5 py-2.5 rounded-lg font-heading font-bold uppercase tracking-widest text-[11px] border border-border bg-transparent text-foreground hover:bg-muted transition-colors">
            Access Portal
          </button>
        </Link>
        <Link href="/accelerator/apply">
          <button className="px-5 py-2.5 rounded-lg font-heading font-bold uppercase tracking-widest text-[11px] bg-saffron text-white hover:bg-saffron-light transition-colors">
            Apply Now
          </button>
        </Link>
      </div>
    </nav>
  );
}
