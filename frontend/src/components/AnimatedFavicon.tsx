"use client";
import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    let frame = 0;
    
    // Find existing favicons or create a new one
    let links = Array.from(document.querySelectorAll("link[rel*='icon']")) as HTMLLinkElement[];
    if (links.length === 0) {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.type = "image/svg+xml";
      document.head.appendChild(newLink);
      links = [newLink];
    }

    const animate = () => {
      frame += 0.2; // Speed of animation
      
      const saffronOffset = Math.sin(frame) * 4;
      const greenOffset = Math.sin(frame + Math.PI) * 4;

      const svg = `
        <svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(25, 10)">
            <rect x="0" y="${saffronOffset}" width="35" height="55" rx="8" fill="#F47421" transform="skewX(-18)" />
            <rect x="20" y="${25 + greenOffset}" width="35" height="55" rx="8" fill="#1A9E5A" transform="skewX(-18)" />
          </g>
        </svg>
      `;

      // Use base64 encoding for maximum cross-browser compatibility
      const base64Svg = typeof window !== 'undefined' ? btoa(svg.trim()) : '';
      const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
      
      links.forEach(link => {
        link.href = dataUrl;
        link.type = "image/svg+xml";
      });
    };

    const interval = setInterval(animate, 100);

    return () => clearInterval(interval);
  }, []);

  return <></>;
}
