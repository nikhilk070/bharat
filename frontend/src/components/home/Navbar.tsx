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
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/login">
          <button className="nb" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Access Portal</button>
        </Link>
        <Link href="/accelerator/apply">
          <button className="nb">Apply Now</button>
        </Link>
      </div>
    </nav>
  );
}
