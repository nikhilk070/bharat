"use client";
import { useEffect } from "react";
import IndiaMap from "./IndiaMap";

export default function Reach() {
  useEffect(() => {
    const obs = new IntersectionObserver(e => {
      e.forEach(x => { if (x.isIntersecting) x.target.classList.add('vis'); });
    }, { threshold: .12 });
    
    ['ci1', 'ci2', 'ci3', 'ci4', 'ci5', 'ci6', 'ci7', 'ci8'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) { el.style.transitionDelay = (i * .07) + 's'; obs.observe(el); }
    });

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="reach sec" id="reach">
        <div className="rl">
          <div>
            <div className="sey">
              <div className="seyl"></div><span className="seyt">Pan-India Presence</span>
            </div>
            <h2 className="seh">EVERY CORNER<br/>OF <span style={{ color: "var(--or)" }}>INDIA.</span></h2>
            <p className="sep">Headquartered in Jaipur, connected everywhere. We go where the founders are — because the
              next great Indian company isn't always built in a metro.</p>
            <div className="cities">
              <div className="cit" id="ci1">
                <div className="cd" style={{ width: "11px", height: "11px" }}></div>
                <div className="cn">Jaipur</div><span className="ct hq-pill">Headquarters</span>
              </div>
              <div className="cit" id="ci2">
                <div className="cd g-dot"></div>
                <div className="cn">Mumbai</div><span className="ct ac-pill">Active</span>
              </div>
              <div className="cit" id="ci3">
                <div className="cd g-dot"></div>
                <div className="cn">Delhi NCR</div><span className="ct ac-pill">Active</span>
              </div>
              <div className="cit" id="ci4">
                <div className="cd g-dot"></div>
                <div className="cn">Bengaluru</div><span className="ct ac-pill">Active</span>
              </div>
              <div className="cit" id="ci5">
                <div className="cd g-dot"></div>
                <div className="cn">Hyderabad</div><span className="ct ac-pill">Active</span>
              </div>
              <div className="cit" id="ci6">
                <div className="cd g-dot"></div>
                <div className="cn">Ahmedabad</div><span className="ct ac-pill">Active</span>
              </div>
              <div className="cit" id="ci7">
                <div className="cd g-dot"></div>
                <div className="cn">Kolkata</div><span className="ct ac-pill">Active</span>
              </div>
              <div className="cit" id="ci8">
                <div className="cd" style={{ background: "var(--muted)", boxShadow: "none" }}></div>
                <div className="cn">Chennai · Pune · Indore</div><span className="ct ex-pill">Expanding</span>
              </div>
            </div>
          </div>
          
          <div className="rmw">
            <IndiaMap />
          </div>
        </div>
      </section>
      <div className="divl"></div>
    </>
  );
}
