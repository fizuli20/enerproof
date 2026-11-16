import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FileSearch,
  Sliders,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Download,
} from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] text-xs font-semibold text-[#153C2D] mb-3">
            Evaluation Hub • CECECO Clean Energy Hackathon 2027
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211C] tracking-tight">
            EnerProof Interactive Demonstration Hub
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#68736C]">
            Explore three fully functional, reproducible demonstration tracks designed for clean energy judges, auditors, and ESCO contract managers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card A */}
          <div className="card-base p-6 flex flex-col justify-between border-t-4 border-t-[#B74740] shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B]">
                  Demo Track A
                </span>
                <span className="text-xs text-[#68736C]">Public Data Audit</span>
              </div>

              <h2 className="text-xl font-bold text-[#18211C]">
                Baku Higher Oil School (BHOS) Energy Filing Audit
              </h2>

              <p className="text-xs text-[#68736C] leading-relaxed">
                Audits real public energy and GHG disclosures from the BHOS campus (2022–2024). Tests data provenance across three deterministic audit gates.
              </p>

              <div className="p-3 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] space-y-2 text-xs">
                <div className="font-semibold text-[#18211C]">Key Audit Findings:</div>
                <div className="flex items-start gap-2 text-[#991B1B]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>10x Emissions Discrepancy:</strong> Reported 4,978 tonnes CO₂ vs calculated 497.79 tonnes (from 995,575 kWh @ 0.5 kg/kWh).
                  </span>
                </div>
                <div className="flex items-start gap-2 text-[#991B1B]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% Data Duplication:</strong> All 36 monthly readings in 2024 duplicate 2023 values identically.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#18211C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Temporal Independence Gate (Profile Matching)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Emissions Factor Arithmetic Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Spatial Submetering & Seasonality Breakdown</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/app/audit?demo=bhos"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Launch Demo A: Public Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="card-base p-6 flex flex-col justify-between border-t-4 border-t-[#245C43] shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E7F1EA] text-[#153C2D]">
                  Demo Track B
                </span>
                <span className="text-xs text-[#68736C]">ECM Decision Engine</span>
              </div>

              <h2 className="text-xl font-bold text-[#18211C]">
                Student Residence Deep Retrofit & M&V
              </h2>

              <p className="text-xs text-[#68736C] leading-relaxed">
                Interactive engineering evaluation of a 500-occupant university dormitory in Baku. Simulates retrofits, financial returns, and generates IPMVP measurement plans.
              </p>

              <div className="p-3 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] space-y-2 text-xs">
                <div className="font-semibold text-[#18211C]">Engineering Calculators Included:</div>
                <ul className="list-disc list-inside space-y-1 text-[#68736C]">
                  <li>LED Lighting & Occupancy Sensors (Payback: ~1.9 yrs)</li>
                  <li>HVAC Night Setbacks & Schedules (54.6 MWh/yr)</li>
                  <li>Smart Power Strips / Plug Load Cutoffs</li>
                  <li>Solar Thermal Hot Water Pre-Heating (45°C ΔT)</li>
                  <li>Boiler O₂ Trim & Flue Gas Economizer</li>
                </ul>
              </div>

              <div className="space-y-1.5 text-xs text-[#18211C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Interactive Azerbaijan Tariff (0.125 AZN/kWh)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Degree-Day Baseline Weather Normalization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>1-Click Investment-Grade PDF Export</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/app/interventions?demo=residence"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Launch Demo B: Residence Retrofit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="card-base p-6 flex flex-col justify-between border-t-4 border-t-[#2B6CB0] shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBF8FF] text-[#2B6CB0]">
                  Demo Track C
                </span>
                <span className="text-xs text-[#68736C]">Research Lab</span>
              </div>

              <h2 className="text-xl font-bold text-[#18211C]">
                Building Energy Research Lab (152 Buildings)
              </h2>

              <p className="text-xs text-[#68736C] leading-relaxed">
                Inspect the scientific foundation: 152 buildings from BDG2, repeated synthetic null distributions, empirical MDE curves, and cross-building correlation in ESCO portfolios.
              </p>

              <div className="p-3 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] space-y-2 text-xs">
                <div className="font-semibold text-[#18211C]">Key Research Insights:</div>
                <ul className="list-disc list-inside space-y-1 text-[#68736C]">
                  <li>Single-building 5% saving power is ~24.7% (not 80%)</li>
                  <li>Monthly bills fail to detect minor operational savings</li>
                  <li>ESCO Portfolio (K=20) achieves 82.0% power for 10% saving</li>
                  <li>Noise floor asymptotes at ρ = 0.33 correlation</li>
                </ul>
              </div>

              <div className="space-y-1.5 text-xs text-[#18211C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Resolution Comparison (Hourly vs Daily vs Monthly)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Empirical False-Alarm Rates & Placebo Tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#245C43]" />
                  <span>Interactive Portfolio Aggregator (K=1 to 50)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/app/portfolio?demo=research"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Launch Demo C: Research Lab
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
