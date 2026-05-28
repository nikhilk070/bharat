"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    const ring = ringRef.current;
    const tip = tipRef.current;
    if (!cur || !ring || !tip) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
      tip.style.left = (mx + 14) + 'px';
      tip.style.top = (my - 8) + 'px';
    };

    let reqId: number;
    const animate = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      reqId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    animate();

    const hoverElements = document.querySelectorAll('button, a, .sp, .sr');
    const enterHover = () => {
      ring.style.width = '42px';
      ring.style.height = '42px';
      ring.style.borderColor = 'rgba(244,114,32,.85)';
    };
    const leaveHover = () => {
      ring.style.width = '28px';
      ring.style.height = '28px';
      ring.style.borderColor = 'rgba(244,114,32,.55)';
    };

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', enterHover);
      el.addEventListener('mouseleave', leaveHover);
    });

    // Tooltip logic for states
    const states = document.querySelectorAll('.sp[data-s]');
    const showTip = (e: Event) => {
      tip.textContent = (e.target as HTMLElement).dataset.s || '';
      tip.style.opacity = '1';
    };
    const hideTip = () => {
      tip.style.opacity = '0';
    };

    states.forEach(p => {
      p.addEventListener('mouseenter', showTip);
      p.addEventListener('mouseleave', hideTip);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(reqId);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', enterHover);
        el.removeEventListener('mouseleave', leaveHover);
      });
      states.forEach(p => {
        p.removeEventListener('mouseenter', showTip);
        p.removeEventListener('mouseleave', hideTip);
      });
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef}></div>
      <div id="cur-r" ref={ringRef}></div>
      <div className="tip" id="tip" ref={tipRef}></div>
    </>
  );
}
