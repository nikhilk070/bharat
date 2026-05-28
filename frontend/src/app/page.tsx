import Hero from "@/components/home/Hero";
import JourneyTimeline from "@/components/home/JourneyTimeline";
import Marquee from "@/components/home/Marquee";
import Verticals from "@/components/home/Verticals";
import CXONetwork from "@/components/home/CXONetwork";
import Reach from "@/components/home/Reach";
import Accelerator from "@/components/home/Accelerator";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <JourneyTimeline />
      <Marquee />
      <Verticals />
      <CXONetwork />
      <Reach />
      <Accelerator />
      <CTA />
    </>
  );
}
