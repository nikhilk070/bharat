"use client";
import { useEffect } from "react";
import IndiaMap from "./IndiaMap";
import Link from "next/link";

export default function Hero() {
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.pageYOffset;
      const hm = document.getElementById('hmap');
      if (hm) hm.style.transform = `translateY(calc(-50% + ${sy * .25}px))`;
      const hc = document.querySelector('.hcont') as HTMLElement;
      if (hc) { 
        hc.style.opacity = Math.max(0, 1 - sy / 560).toString(); 
        hc.style.transform = `translateY(${sy * .14}px)`; 
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hgrid"></div>
      <div id="parts"></div>

      <div className="hcont">
        <div className="ey">
          <div className="eyl"></div><span className="eyt">Jaipur HQ · Pan-India · 100 CXOs</span>
        </div>
        <h1 className="h1">BUILDING<br/><span className="or">INDIA'S</span><br/>BOLD <span className="gr">FUTURE.</span></h1>
        <p className="hp">A think-tank of 100 CXOs. Three verticals. One mission — to accelerate founders building
          India's next great companies from every corner of the country.</p>
        <div className="hbtns">
          <Link href="/login" style={{ textDecoration: 'none' }}><button className="bp">Join the Network</button></Link>
          <a href="#pillars" style={{ textDecoration: 'none' }}><button className="bg">Explore Verticals</button></a>
        </div>
        <div className="hstats">
          <div>
            <div className="hsn">100<span>+</span></div>
            <div className="hsl">CXO Think-Tank</div>
          </div>
          <div>
            <div className="hsn">28<span>+</span></div>
            <div className="hsl">States Connected</div>
          </div>
          <div>
            <div className="hsn">3<span>×</span></div>
            <div className="hsl">Verticals</div>
          </div>
        </div>
      </div>

      <div className="hmap" id="hmap">
        <IndiaMap isHero={true} />
      </div>
      <div className="sind">
        <div className="sil"></div><span className="sit">Scroll</span>
      </div>
    </section>
  );
}
