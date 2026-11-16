import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Award, User, Target, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] text-xs font-semibold text-[#153C2D]">
            <Award className="w-3.5 h-3.5 text-[#245C43]" />
            CECECO Clean Energy Hackathon 2027
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211C] tracking-tight">
            About EnerProof
          </h1>
          <p className="text-base text-[#68736C] leading-relaxed">
            Energy efficiency you can prove. An evidence-aware verification engine designed to bring mathematical integrity to energy efficiency projects in Azerbaijan and beyond.
          </p>
        </div>

        {/* Founder & Competition Card */}
        <div className="card-base p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#DFE5E0]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#245C43] text-white flex items-center justify-center font-bold text-xl">
                FH
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#18211C]">Fizuli Hasanov</h2>
                <p className="text-xs text-[#68736C]">Founder & Lead Developer • EnerProof</p>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href="https://github.com/fizuli20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#245C43] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    github.com/fizuli20
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-[#68736C] uppercase tracking-wider block">
                Competition Track
              </span>
              <span className="text-sm font-bold text-[#18211C] block">
                Bringing Clean Energy to Everyday Life
              </span>
              <a
                href="https://www.cececo.org/projects/cececo-clean-energy-hackathon-2027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#245C43] hover:underline inline-flex items-center gap-1 font-medium mt-1"
              >
                CECECO Clean Energy Hackathon 2027
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4 text-xs text-[#68736C] leading-relaxed">
            <h3 className="text-sm font-bold text-[#18211C]">The Inspiration</h3>
            <p>
              Azerbaijan is currently adopting mandatory energy efficiency norms, an Energy Efficiency Fund, and strict statutory audit criteria. However, clean-energy adoption faces two severe obstacles:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                <strong>Low Electricity Tariffs:</strong> Non-residential power costs approximately 0.125 AZN ($0.073) per kWh. Standalone SaaS monitoring software cannot justify its licensing costs purely through operational energy savings without performance guarantees.
              </li>
              <li>
                <strong>Provenance Breakdown in Public Data:</strong> Institutional sustainability reports frequently contain human calculation errors (such as the 10x GHG discrepancy uncovered in the Baku Higher Oil School 2022 filing) or copy-forwarded data profiles (36 identical monthly points across 2023–2024).
              </li>
            </ol>
            <p>
              EnerProof was built to solve this provenance crisis. Rather than selling another unassisted dashboard, EnerProof functions as an <strong>audit-to-action verification engine</strong>. It equips certified auditors, ESCOs, and fund administrators with a deterministic tool that screens raw meter data, applies degree-day normalization, calculates ASHRAE Guideline 14 uncertainty, and issues investment-grade PDF reports.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base p-5 space-y-2">
            <div className="w-8 h-8 rounded bg-[#E7F1EA] flex items-center justify-center text-[#245C43]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#18211C]">Deterministic Refusal</h4>
            <p className="text-xs text-[#68736C]">
              EnerProof never guesses. If data quality is flawed or statistical uncertainty exceeds 50%, the platform refuses certification and prescribes exact monitoring steps.
            </p>
          </div>

          <div className="card-base p-5 space-y-2">
            <div className="w-8 h-8 rounded bg-[#EBF8FF] flex items-center justify-center text-[#2B6CB0]">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#18211C]">Empirical Grounding</h4>
            <p className="text-xs text-[#68736C]">
              Tested on 152 real university campus buildings from the BDG2 dataset, with repeated synthetic controls and accounting for intra-site correlation (ρ = 0.33).
            </p>
          </div>

          <div className="card-base p-5 space-y-2">
            <div className="w-8 h-8 rounded bg-[#FEF3C7] flex items-center justify-center text-[#A66A16]">
              <User className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#18211C]">Privacy First</h4>
            <p className="text-xs text-[#68736C]">
              All calculations and CSV parsing run client-side in your browser. No building telemetry or proprietary utility bills are ever uploaded to third-party cloud servers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
