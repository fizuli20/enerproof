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
  Sparkles,
} from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F0]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Evaluation Hub &bull; CECECO Clean Energy Hackathon 2027
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#101C18] tracking-tight">
            EnerProof Interactive Demonstration Hub
          </h1>
          <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
            Explore three fully functional, reproducible demonstration tracks designed for clean energy judges, auditors, and ESCO contract managers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card A */}
          <div className="card-editorial p-6 flex flex-col justify-between border-t-4 border-t-[#B74740] bg-white shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B]">
                  Demo Track A
                </span>
                <span className="text-xs text-[#5D6D63] font-mono">Public Data Audit</span>
              </div>

              <h2 className="text-xl font-bold font-display text-[#101C18]">
                Baku Higher Oil School (BHOS) Energy Filing Audit
              </h2>

              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Audits real public energy and GHG disclosures from the BHOS campus (2022–2024). Tests data provenance across three deterministic audit gates.
              </p>

              <div className="p-3.5 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] space-y-2 text-xs">
                <div className="font-semibold text-[#101C18]">Key Audit Findings:</div>
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

              <div className="space-y-1.5 text-xs text-[#101C18]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Temporal Independence Gate (Profile Matching)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Emissions Factor Arithmetic Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Spatial Submetering & Seasonality Breakdown</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/app/audit?demo=bhos"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#152E27] hover:bg-[#101C18] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Launch Demo A: Public Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="card-editorial p-6 flex flex-col justify-between border-t-4 border-t-[#152E27] bg-white shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#152E27] text-[#D9FF91]">
                  Demo Track B
                </span>
                <span className="text-xs text-[#5D6D63] font-mono">ECM Decision Engine</span>
              </div>

              <h2 className="text-xl font-bold font-display text-[#101C18]">
                Student Residence Deep Retrofit & M&V
              </h2>

              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Interactive engineering evaluation of a 500-occupant university dormitory in Baku. Simulates retrofits, financial returns, and generates IPMVP measurement plans.
              </p>

              <div className="p-3.5 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] space-y-2 text-xs">
                <div className="font-semibold text-[#101C18]">Engineering Calculators Included:</div>
                <ul className="list-disc list-inside space-y-1 text-[#5D6D63]">
                  <li>LED Lighting & Occupancy Sensors (Payback: ~1.9 yrs)</li>
                  <li>HVAC Night Setbacks & Schedules (54.6 MWh/yr)</li>
                  <li>Smart Power Strips / Plug Load Cutoffs</li>
                  <li>Solar Thermal Hot Water Pre-Heating (45°C &Delta;T)</li>
                  <li>Boiler O₂ Trim & Flue Gas Economizer</li>
                </ul>
              </div>

              <div className="space-y-1.5 text-xs text-[#101C18]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Bounded Engineering Parameter Inputs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>IPMVP Measurement Protocol Selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Lifecycle Cost & Financial Sensitivity Analysis</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/app/interventions"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg btn-lime text-xs font-semibold shadow-sm transition-all"
              >
                Launch Demo B: Retrofit Planner
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="card-editorial p-6 flex flex-col justify-between border-t-4 border-t-[#9B641B] bg-white shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                  Demo Track C
                </span>
                <span className="text-xs text-[#5D6D63] font-mono">Statistical Research</span>
              </div>

              <h2 className="text-xl font-bold font-display text-[#101C18]">
                152-Building Empirical Research Benchmark
              </h2>

              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Reproducible empirical validation across 152 buildings from Building Data Genome 2. Demonstrates residual correlation floors and statistical power limits.
              </p>

              <div className="p-3.5 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] space-y-2 text-xs">
                <div className="font-semibold text-[#101C18]">Research Findings Explored:</div>
                <ul className="list-disc list-inside space-y-1 text-[#5D6D63]">
                  <li>Illustrative cross-building correlation floor (&rho; &asymp; 0.33) in microclimate simulations</li>
                  <li>Single-building power @ 5%: 24.7% daily vs 23.8% hourly (MDE &ge; 15.0%)</li>
                  <li>Portfolio pooling prevents naive 1/&radic;K collapse; uncalibrated portfolios return UNESTABLISHED</li>
                  <li>False alarm rate reality: Synthetic FPR 4.2% vs historical placebo FAR 22.4%</li>
                </ul>
              </div>

              <div className="space-y-1.5 text-xs text-[#101C18]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Empirical Power Curves & MDE Distributions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Theoretical Cross-Building Simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  <span>Full Research Figures Dossier (10 Figures)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/research"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#DDE3DB] bg-white hover:bg-black/5 text-[#101C18] text-xs font-semibold shadow-sm transition-all"
              >
                Launch Demo C: Research Explorer
                <ArrowRight className="w-4 h-4 text-[#5D6D63]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Link to 3-Minute Judge Experience */}
        <div className="card-editorial p-6 bg-white border border-[#DDE3DB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#152E27] text-[#D9FF91] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#101C18]">
                Are you evaluating EnerProof for the Clean Energy Hackathon?
              </div>
              <div className="text-xs text-[#5D6D63] mt-0.5">
                We built a dedicated, zero-friction 3-minute interactive journey that walks through building context, savings calculations, measurement trade-offs, and deterministic Evidence Gate results.
              </div>
            </div>
          </div>
          <Link
            href="/judge"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-lime text-xs font-semibold shrink-0 shadow-sm"
          >
            Open 3-Minute Judge Experience
            <ArrowRight className="w-4 h-4 text-[#101C18]" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
