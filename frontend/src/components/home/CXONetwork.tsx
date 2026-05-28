"use client";
import { useEffect } from "react";

export default function CXONetwork() {
  useEffect(() => {
    const obs = new IntersectionObserver(e => {
      e.forEach(x => { if (x.isIntersecting) x.target.classList.add('vis'); });
    }, { threshold: .12 });
    
    [['c1', 0], ['c2', 0.1], ['c3', 0.2], ['c4', 0.3]].forEach(([id, d]) => {
      const el = document.getElementById(id as string);
      if (el) { el.style.transitionDelay = d + 's'; obs.observe(el); }
    });

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="cxo sec" id="network">
        <div className="cxol">
          <div>
            <div className="sey">
              <div className="seyl"></div><span className="seyt">The Think-Tank</span>
            </div>
            <h2 className="seh">100 CXOs.<br/>ONE BHARAT.</h2>
            <p className="sep">At the heart of Bharat Ventures is a living network of 100 CXOs — founders, CEOs, CFOs,
              CMOs, and operators who have built companies across every sector of India's economy.</p>
            <p className="sep" style={{ marginBottom: "26px" }}>When you join BV, you don't get advisors. You get the people
              who've already solved your exact problem in Indian markets.</p>
            <button className="bp">Meet the Network</button>
          </div>
          <div style={{ position: "relative" }}>
            <div className="cxog">100</div>
            <div className="cxogr">
              <div className="cxoc" id="c1">
                <div className="cxov">100<span>+</span></div>
                <div className="cxolb">Active CXOs</div>
              </div>
              <div className="cxoc" id="c2">
                <div className="cxov">18<span>+</span></div>
                <div className="cxolb">Industries</div>
              </div>
              <div className="cxoc" id="c3">
                <div className="cxov">₹2,400<span>Cr</span></div>
                <div className="cxolb">Value Created</div>
              </div>
              <div className="cxoc" id="c4">
                <div className="cxov">28<span>+</span></div>
                <div className="cxolb">States</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="divl"></div>
    </>
  );
}
