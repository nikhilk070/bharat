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
      {/* Connecting Line from Node to Card */}
      <motion.div 
        style={{ opacity: activeOpacity }}
        className={`absolute left-1/2 w-[1px] border-l border-dashed border-saffron/30 ${isEven ? 'bottom-8 h-12 md:h-16' : 'top-8 h-12 md:h-16'} -translate-x-1/2`}
      />

      {/* Glassmorphic Text Card */}
      <motion.div 
        style={{ opacity: activeOpacity }}
        className={`absolute w-48 md:w-64 text-center ${isEven ? 'bottom-20 md:bottom-28' : 'top-20 md:top-28'} left-1/2 -translate-x-1/2`}
      >
        <div className="bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl p-4 md:p-5 rounded-2xl hover:bg-card hover:border-saffron/30 transition-colors duration-300 group">
          <h4 className="font-heading font-bold text-sm md:text-lg text-foreground mb-1 md:mb-2 leading-tight group-hover:text-saffron transition-colors">{step.title}</h4>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed hidden md:block">{step.desc}</p>
        </div>
      </motion.div>

      {/* Pulsing Aura Behind Active Node */}
      <motion.div
        style={{ opacity: activeOpacity, scale: useTransform(progress, [threshold - 0.2, threshold], [0.5, 1.5]) }}
        className="absolute inset-0 bg-saffron/20 blur-xl rounded-full -z-10"
      />

      {/* The Node Itself */}
      <motion.div 
        style={{ scale }}
        className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-card shadow-xl overflow-hidden ring-4 ring-background"
      >
        {/* Inactive state background */}
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-muted border border-border rounded-full" 
        />
        
        {/* Active state background */}
        <div className="absolute inset-0 bg-gradient-to-br from-saffron to-saffron-light shadow-[inset_0_-2px_10px_rgba(0,0,0,0.2)] rounded-full" />

        {/* Icon (always above backgrounds) */}
        <div className="relative z-20 text-white mix-blend-overlay drop-shadow-md">
          <step.icon size={20} className="md:w-7 md:h-7" />
        </div>
      </motion.div>
    </div>
  );
}
