"use client";
import { useEffect } from "react";

export default function Accelerator() {
  useEffect(() => {
    const obs = new IntersectionObserver(e => {
      e.forEach(x => { if (x.isIntersecting) x.target.classList.add('vis'); });
    }, { threshold: .12 });
    
    ['s1', 's2', 's3', 's4', 's5', 's6'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) { el.style.transitionDelay = (i * .09) + 's'; obs.observe(el); }
    });

    return () => obs.disconnect();
  }, []);

  return (
    <section className="accel sec" id="accelerator">
      <div className="al">
        <div>
          <div className="sey">
            <div className="seyl"></div><span className="seyt">Bharat Accelerator</span>
          </div>
          <h2 className="seh">90 DAYS.<br/>ONE <span style={{ color: "var(--or)" }}>TRANSFORMATION.</span></h2>
          <p className="sep">Not a cohort. Not a curriculum. BV partners working directly with you — rebuilding your
            GTM, revenue architecture, pitch, and MIS.</p>
          <div className="svcs">
            <div className="sr" id="s1">
              <div className="sri">🎯</div>
              <div>
                <div className="srn">GTM Architecture</div>
                <div className="srd">Full go-to-market rebuild. Channels. 90-day acquisition plan.</div>
              </div>
              <div className="sra">→</div>
            </div>
            <div className="sr" id="s2">
              <div className="sri">💡</div>
              <div>
                <div className="srn">USP & Positioning</div>
                <div className="srd">Find your sharpest positioning. Make a competitor irrelevant.</div>
              </div>
              <div className="sra">→</div>
            </div>
            <div className="sr" id="s3">
              <div className="sri">📊</div>
              <div>
                <div className="srn">MIS Development</div>
                <div className="srd">5 dashboards. Weekly rhythm. Complete financial visibility.</div>
              </div>
              <div className="sra">→</div>
            </div>
            <div className="sr" id="s4">
              <div className="sri">💰</div>
              <div>
                <div className="srn">Revenue Stream Design</div>
                <div className="srd">New revenue without new CAC. Always hiding in plain sight.</div>
              </div>
              <div className="sra">→</div>
            </div>
            <div className="sr" id="s5">
              <div className="sri">🎤</div>
              <div>
                <div className="srn">Investor Pitch Prep</div>
                <div className="srd">Deck rewrite. Narrative sharpening. Live rehearsal.</div>
              </div>
              <div className="sra">→</div>
            </div>
            <div className="sr" id="s6">
              <div className="sri">🏋️</div>
              <div>
                <div className="srn">The Gym — CXO Advisory</div>
                <div className="srd">Weekly 1:1s with the right CXO for your exact challenge.</div>
              </div>
              <div className="sra">→</div>
            </div>
          </div>
        </div>
        <div className="acw">
          <div className="ac">
            <div className="att">Average Outcome</div>
            <div className="acn">2.8<span>×</span></div>
            <div className="acl">MRR Growth in 90 days</div>
          </div>
          <div className="ac gc">
            <div className="att">CAC Impact</div>
            <div className="acn">44<span>%</span></div>
            <div className="acl">Average CAC reduction</div>
          </div>
          <div className="ac">
            <div className="att">Fundraising</div>
            <div className="acn">4.2<span>mo</span></div>
            <div className="acl">Avg. time to next round</div>
          </div>
          <div className="ac gc">
            <div className="att">Founder NPS</div>
            <div className="acn">100<span>%</span></div>
            <div className="acl">Would recommend BV Acceleration</div>
          </div>
        </div>
      </div>
    </section>
  );
}
