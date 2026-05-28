"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, FileText, Users, Search, Rocket } from "lucide-react";

const steps = [
  { title: "Application & AI Scoring", desc: "Chanakya analyzes pitch and generates health score.", icon: Sparkles },
  { title: "Legal Onboarding", desc: "2-Stage term sheet & equity agreements.", icon: FileText },
  { title: "CXO Mentorship", desc: "Think-Tank pairing and time-bank allocation.", icon: Users },
  { title: "Due Diligence", desc: "Data vaults opened for verified ecosystem analysis.", icon: Search },
  { title: "Investor Deal Flow", desc: "Routed to Deal Matrix for syndicate investment.", icon: Rocket },
];

export default function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Title */}
        <div className="absolute top-20 text-center px-4 w-full">
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl uppercase tracking-widest text-foreground">
            The Accelerator <span className="text-saffron">Journey</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Scroll to follow the exact onboarding and investment flow within the Bharat Ventures OS.
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className="relative w-full max-w-6xl mx-auto h-[400px] flex items-center justify-center">
          
          {/* Background SVG Path */}
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-16">
            <svg width="100%" height="200" preserveAspectRatio="none" viewBox="0 0 1000 200" className="opacity-10">
               <path d="M 0,100 Q 250,180 500,100 T 1000,100" fill="none" stroke="currentColor" strokeWidth="6" />
            </svg>
          </div>

          {/* Active Animated SVG Path */}
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-16">
            <svg width="100%" height="200" preserveAspectRatio="none" viewBox="0 0 1000 200" className="text-saffron">
               <motion.path 
                 d="M 0,100 Q 250,180 500,100 T 1000,100" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="6"
                 style={{ pathLength: smoothProgress }}
               />
            </svg>
          </div>

          {/* Nodes Container */}
          <div className="absolute inset-0 flex items-center px-4 md:px-16">
            <div className="relative w-full h-full flex items-center">
              {steps.map((step, index) => {
                // Nodes are positioned exactly along the X axis
                const threshold = (index + 1) / steps.length;
                return (
                  <Node 
                    key={index} 
                    step={step} 
                    index={index} 
                    total={steps.length}
                    progress={smoothProgress}
                    threshold={threshold}
                  />
                );
              })}
            </div>
          </div>
          
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0.9, 1], [1, 0]) }}
          className="absolute bottom-10 flex flex-col items-center text-muted-foreground animate-bounce"
        >
          <span className="text-xs uppercase tracking-widest font-heading font-bold mb-2">Keep Scrolling</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-saffron to-transparent"></div>
        </motion.div>
        
      </div>
    </section>
  );
}

function Node({ step, index, total, progress, threshold }: any) {
  const leftPosition = `${(index / (total - 1)) * 100}%`;
  
  // Dynamic y offsets to align with the Q 250,180 500,100 T 1000,100 SVG path
  let yOffset = 0;
  if (index === 1) yOffset = 40; // dips down at 25%
  if (index === 3) yOffset = -40; // arcs up at 75%
  
  const scale = useTransform(progress, [threshold - 0.2, threshold], [0.8, 1.1]);
  
  // Fix background color transform to handle color strings properly, or just use opacity tricks
  // We can use a simpler approach: When progress >= threshold, set active classes.
  // We can use framer motion color interpolation or just opacity overlays.
  const overlayOpacity = useTransform(progress, [threshold - 0.2, threshold], [1, 0]);
  const activeOpacity = useTransform(progress, [threshold - 0.2, threshold], [0.4, 1]);
  
  const isEven = index % 2 === 0;

  return (
    <div 
      className="absolute" 
      style={{ left: leftPosition, top: `calc(50% + ${yOffset}px)`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div 
        style={{ opacity: activeOpacity }}
        className={`absolute w-32 md:w-48 text-center ${isEven ? 'bottom-16 md:bottom-20' : 'top-16 md:top-20'} left-1/2 -translate-x-1/2`}
      >
        <h4 className="font-heading font-bold text-[10px] md:text-sm text-foreground mb-1 leading-tight">{step.title}</h4>
        <p className="text-[8px] md:text-[10px] text-muted-foreground leading-tight hidden md:block">{step.desc}</p>
      </motion.div>

      <motion.div 
        style={{ scale }}
        className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-card shadow-xl overflow-hidden"
      >
        {/* Inactive state background */}
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-muted border-4 border-border rounded-full" 
        />
        
        {/* Active state background */}
        <div className="absolute inset-0 bg-gradient-to-br from-saffron to-saffron-light border-4 border-saffron/30 rounded-full" />

        {/* Icon (always above backgrounds) */}
        <div className="relative z-20 text-white mix-blend-overlay">
          <step.icon size={20} className="md:w-8 md:h-8" />
        </div>
      </motion.div>
    </div>
  );
}
