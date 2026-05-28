import Link from "next/link";

export default function CTA() {
  return (
    <section className="cta sec">
      <h2 className="ctah">READY TO BUILD<br/><span className="or">INDIA'S</span> BOLD<br/><span className="gr">FUTURE?</span></h2>
      <p className="ctap">Apply to the BV Acceleration Programme or connect with our 100-CXO network. One conversation
        changes everything.</p>
      <div className="ctab">
        <Link href="/accelerator/apply">
          <button className="bp">Apply to Accelerate</button>
        </Link>
        <button className="bg">Join the Network</button>
      </div>
    </section>
  );
}
