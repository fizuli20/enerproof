import Link from "next/link";
import { EnerProofLogo } from "./EnerProofLogo";
import { ExternalLink, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#101C18] text-[#DDE3DB] py-16 mt-auto border-t border-[#152E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <EnerProofLogo variant="light" size="md" showTagline />
            </Link>
            <p className="text-xs text-[#8EA094] leading-relaxed">
              Energy efficiency you can prove. EnerProof helps buildings waste less energy, plan smarter upgrades, and understand whether their improvements make a measurable difference.
            </p>
            <div className="text-xs text-[#8EA094] pt-1">
              Founder: <span className="font-semibold text-white">Fizuli Hasanov</span>
            </div>
            <div className="pt-2">
              <Link
                href="/judge"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D9FF91] text-[#101C18] hover:bg-[#C5F375] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Experience in 3 Minutes</span>
              </Link>
            </div>
          </div>

          {/* Product Workflow */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D9FF91] mb-4">
              Workflow Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8EA094]">
              <li><Link href="/app/audit" className="hover:text-white transition-colors">1. Data Quality & Provenance</Link></li>
              <li><Link href="/app/baseline" className="hover:text-white transition-colors">2. Degree-Day Regression</Link></li>
              <li><Link href="/app/interventions" className="hover:text-white transition-colors">3. Energy-Saving Opportunities</Link></li>
              <li><Link href="/app/measurement" className="hover:text-white transition-colors">4. Measurement Boundary (IPMVP)</Link></li>
              <li><Link href="/app/verify" className="hover:text-white transition-colors">5. Evidence Gate Results</Link></li>
              <li><Link href="/app/portfolio" className="hover:text-white transition-colors">6. Portfolio Covariance Lab</Link></li>
              <li><Link href="/app/reports" className="hover:text-white transition-colors">7. Investment-Grade Reports</Link></li>
            </ul>
          </div>

          {/* Research & Hackathon */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D9FF91] mb-4">
              Research & Science
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8EA094]">
              <li><Link href="/judge" className="hover:text-white transition-colors">Judge 3-Minute Experience</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Preloaded Test Scenarios</Link></li>
              <li><Link href="/research" className="hover:text-white transition-colors">152-Building Empirical Study</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition-colors">Measurement Uncertainty & Equations</Link></li>
              <li>
                <a
                  href="https://www.cececo.org/projects/cececo-clean-energy-hackathon-2027"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  CECECO Clean Energy Hackathon 2027
                  <ExternalLink className="w-3 h-3 text-[#5D6D63]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Source */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D9FF91] mb-4">
              Trust & Source
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8EA094]">
              <li><Link href="/privacy" className="hover:text-white transition-colors">100% Client-Side Data Privacy</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About & Founder Motivation</Link></li>
              <li>
                <a
                  href="https://github.com/fizuli20/enerproof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  GitHub Repository (fizuli20/enerproof)
                  <ExternalLink className="w-3 h-3 text-[#5D6D63]" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-[#5D6D63]">
                Release Tag: <code className="text-[#D9FF91] font-mono">v3.0.0-cececo</code>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#152E27] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5D6D63] gap-4">
          <p>&copy; 2027 EnerProof. Developed by Fizuli Hasanov for CECECO Clean Energy Hackathon 2027.</p>
          <p className="max-w-xl text-left sm:text-right text-[11px] text-[#5D6D63]">
            Analytical decision-support tool based on modeled counterfactuals. Does not constitute formal statutory certification or guarantee causal attribution.
          </p>
        </div>
      </div>
    </footer>
  );
}
