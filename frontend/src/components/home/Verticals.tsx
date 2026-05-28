"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Verticals() {
  useEffect(() => {
    const obs = new IntersectionObserver(e => {
      e.forEach(x => { if (x.isIntersecting) x.target.classList.add('vis'); });
    }, { threshold: .12 });
    
    [['p1', 0], ['p2', 0.14], ['p3', 0.28]].forEach(([id, d]) => {
      const el = document.getElementById(id as string);
      if (el) {
        el.style.transitionDelay = d + 's';
        obs.observe(el);
      }
    });

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="pillars sec" id="pillars">
        <div className="sey">
          <div className="seyl"></div><span className="seyt">Three Verticals. One Ecosystem.</span>
        </div>
        <h2 className="seh">THE BHARAT<br/>VENTURES SYSTEM</h2>
        <p className="sep">Built around 100 CXOs who serve as the living think-tank — three verticals working in concert to
          take a founder from idea to scale.</p>
        <div className="pg">
          <Link href="/accelerator" className="pc" id="p1" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="pcn">01 / Program</div>
            <div className="pci">🚀</div>
            <div className="pct">BHARAT<br/>ACCELERATOR</div>
            <p className="pcd">Propelling high-growth startups from early traction to global scale through AI-driven matching and legal automation.</p>
            <ul className="pcl">
              <li>AI-Driven Startup Profiling</li>
              <li>Time-Bank Mentorship</li>
              <li>Automated Legal & NDAs</li>
              <li>Direct Pitching to VCs</li>
              <li>Growth Engine Blueprints</li>
              <li>Seamless Onboarding</li>
            </ul>
            <div className="pca">→</div>
          </Link>
          <Link href="/investors" className="pc gc" id="p2" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="pcn">02 / Network</div>
            <div className="pci">💼</div>
            <div className="pct">PRIVATE<br/>SYNDICATE</div>
            <p className="pcd">An exclusive command center for LPs and Angel Investors to access highly vetted deal flows and track live equity.</p>
            <ul className="pcl">
              <li>Secure Data Rooms</li>
              <li>Live Equity Tracking</li>
              <li>Curated AI-Vetted Deal Flow</li>
              <li>Direct Founder Access</li>
              <li>Real-time Cap Table Advisory</li>
              <li>Seamless Co-investments</li>
            </ul>
            <div className="pca">→</div>
          </Link>
          <Link href="/vivachana" className="pc" id="p3" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="pcn">03 / Think-Tank</div>
            <div className="pci">🧠</div>
            <div className="pct">VIVACHANA<br/>CXO NETWORK</div>
            <p className="pcd">A curated sanctuary for industry veterans and strategic advisors to mentor startups using our unique Time-Bank model.</p>
            <ul className="pcl">
              <li>Time-Bank Mentorship Model</li>
              <li>Strategic Startup Pairing</li>
              <li>Earn Vested Advisory Shares</li>
              <li>Exclusive CXO Directory</li>
              <li>Board & Governance Roles</li>
              <li>Enterprise Market Entry</li>
            </ul>
            <div className="pca">→</div>
          </Link>
        </div>
      </section>
      <div className="divl"></div>
    </>
  );
}
