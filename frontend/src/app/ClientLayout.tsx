"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import CustomCursor from "@/components/home/CustomCursor";
import AnimatedFavicon from "@/components/AnimatedFavicon";
// import AnimatedFavicon from "@/components/AnimatedFavicon";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/login");

  return (
    <>
      {!isHidden && <CustomCursor />}
      <AnimatedFavicon />
      {!isHidden && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isHidden && <Footer />}
    </>
  );
}
