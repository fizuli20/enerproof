import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#DFE5E0] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#245C43] flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-[#18211C]">EnerProof</span>
            </div>
            <p className="text-xs text-[#68736C] leading-relaxed">
              Energy efficiency you can prove. Deterministic Measurement & Verification (M&V) decision support engine for energy auditors, ESCOs, and the Azerbaijan Energy Efficiency Fund.
            </p>
            <div className="text-xs text-[#68736C] pt-2">
              Founder: <span className="font-semibold text-[#18211C]">Fizuli Hasanov</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#18211C] mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-[#68736C]">
              <li><Link href="/app/audit" className="hover:text-[#245C43]">Pre-Intervention Audit</Link></li>
              <li><Link href="/app/baseline" className="hover:text-[#245C43]">Degree-Day Regression</Link></li>
              <li><Link href="/app/interventions" className="hover:text-[#245C43]">Engineering Calculators</Link></li>
              <li><Link href="/app/measurement" className="hover:text-[#245C43]">IPMVP Measurement Plan</Link></li>
              <li><Link href="/app/verify" className="hover:text-[#245C43]">Evidence Gate Assessment</Link></li>
              <li><Link href="/app/portfolio" className="hover:text-[#245C43]">Portfolio Aggregator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#18211C] mb-3">
              Research & Science
            </h4>
            <ul className="space-y-2 text-xs text-[#68736C]">
              <li><Link href="/demo" className="hover:text-[#245C43]">Live Demos (A, B, C)</Link></li>
              <li><Link href="/research" className="hover:text-[#245C43]">152-Building BDG2 Benchmark</Link></li>
              <li><Link href="/methodology" className="hover:text-[#245C43]">ASHRAE 14 Annex B Formulation</Link></li>
              <li>
                <a
                  href="https://www.cececo.org/projects/cececo-clean-energy-hackathon-2027"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#245C43]"
                >
                  CECECO Clean Energy Hackathon 2027
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#18211C] mb-3">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs text-[#68736C]">
              <li><Link href="/privacy" className="hover:text-[#245C43]">Client-Side Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-[#245C43]">About the Project</Link></li>
              <li>
                <a
                  href="https://github.com/fizuli20/enerproof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#245C43]"
                >
                  GitHub Repository (fizuli20/enerproof)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DFE5E0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#68736C] gap-4">
          <p>© 2027 EnerProof. Developed by Fizuli Hasanov for CECECO Clean Energy Hackathon 2027.</p>
          <p className="max-w-xl text-right text-[11px] text-[#68736C]">
            Disclaimer: EnerProof assessments are analytical decision-support estimates under modeled counterfactuals. They do not constitute statutory certification or legal proof of causation.
          </p>
        </div>
      </div>
    </footer>
  );
}
