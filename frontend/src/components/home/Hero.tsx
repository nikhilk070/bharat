"use client";
import { useEffect, useState } from "react";
import IndiaMap from "./IndiaMap";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

const headings = [
  "THE THINK-TANK BEHIND INDIA'S NEXT GIANTS.",
  "भारत के अगले दिग्गजों के पीछे का थिंक-टैंक।",
  "ভারতের পরবর্তী জায়ান্টদের পেছনের থিঙ্ক-ট্যাঙ্ক।",
  "भारताच्या आगामी दिग्गजांमागील थिंक-टँक.",
  "ભારતના આગામી દિગ્ગજો પાછળની થિંક-ટેન્ક.",
  "இந்தியாவின் அடுத்த ஜாம்பவான்களை உருவாக்கும் திங்க்-டேங்க்.",
  "ಭಾರತದ ಮುಂದಿನ ದೈತ್ಯರ ಹಿಂದಿರುವ ಥಿಂಕ್-ಟ್ಯಾಂಕ್."
];

const TypewriterHeading = () => {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentString = headings[index];

    let timer: NodeJS.Timeout;
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % headings.length);
        }
      }, 20); // Fast delete speed
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentString.slice(0, displayedText.length + 1));
        if (displayedText.length === currentString.length) {
          // Pause before deleting
          timer = setTimeout(() => setIsDeleting(true), 2500);
        }
      }, 50); // Typing speed
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, index]);

  return (
    <div className="min-h-[90px] md:min-h-[80px] flex items-center justify-start mb-6">
      <h1 className="h1 !mb-0 text-left w-full !text-3xl md:!text-4xl lg:!text-5xl leading-tight" style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1 md:w-[4px] h-[0.9em] bg-saffron ml-2 align-baseline rounded-sm"
        />
      </h1>
    </div>
  );
};

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
        <TypewriterHeading />
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
