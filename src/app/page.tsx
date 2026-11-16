import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  LineChart,
  Sliders,
  Ruler,
  Layers,
  Building2,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#DFE5E0] bg-gradient-to-b from-[#FFFFFF] to-[#F8F9F7]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] border border-[#B8DAC4] text-xs font-semibold text-[#153C2D]">
            <Sparkles className="w-3.5 h-3.5 text-[#245C43]" />
            Official Entry • CECECO Clean Energy Hackathon 2027
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#18211C] tracking-tight leading-tight">
            Energy efficiency <br className="hidden sm:inline" />
            <span className="text-[#245C43]">you can prove.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#68736C] leading-relaxed">
            The deterministic Measurement & Verification (M&V) platform for energy auditors, ESCOs, and the Azerbaijan Energy Efficiency Fund. Built on ASHRAE Guideline 14 Annex B and verified on a 152-building empirical research benchmark.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-sm font-semibold shadow-sm transition-all"
            >
              Explore 3 Live Demos
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/app/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#DFE5E0] bg-white hover:bg-black/5 text-[#18211C] text-sm font-semibold transition-all"
            >
              <FileSearch className="w-4 h-4 text-[#245C43]" />
              Run Public Data Audit
            </Link>
            <Link
              href="/research"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-transparent hover:border-[#DFE5E0] text-[#68736C] hover:text-[#18211C] text-sm font-medium transition-all"
            >
              View Research & Science
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="card-base p-4">
              <div className="text-2xl font-bold text-[#18211C]">152 Buildings</div>
              <div className="text-xs text-[#68736C]">Empirically benchmarked cohort (BDG2)</div>
            </div>
            <div className="card-base p-4">
              <div className="text-2xl font-bold text-[#245C43]">10x Math Flag</div>
              <div className="text-xs text-[#68736C]">Automated GHG error detection in BHOS filing</div>
            </div>
            <div className="card-base p-4">
              <div className="text-2xl font-bold text-[#18211C]">≤ 50% FSU</div>
              <div className="text-xs text-[#68736C]">ASHRAE Guideline 14 Annex B gate</div>
            </div>
            <div className="card-base p-4">
              <div className="text-2xl font-bold text-[#245C43]">K=20 Pooling</div>
              <div className="text-xs text-[#68736C]">≥ 80% power at ρ=0.33 correlation floor</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem & Pivot */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#245C43] mb-2">
            Market Reality & Economic Context
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#18211C]">
            Why Energy Dashboards Fail — And How EnerProof Solves It
          </h3>
          <p className="mt-3 text-sm text-[#68736C]">
            Azerbaijan’s subsidized non-residential electricity tariff (0.125 AZN / $0.073 per kWh) and fixed university state budgets make traditional SaaS monitoring dashboards economically unviable. EnerProof pivots from unassisted SaaS to an audit-to-action verification engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base p-6 space-y-3 border-l-4 border-l-[#B74740]">
            <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#991B1B]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#18211C]">1. Provenance Failures & Duplicate Filings</h4>
            <p className="text-xs text-[#68736C] leading-relaxed">
              Public institutional reports frequently copy forward annual consumption figures without independent meter logging. Our audit of the Baku Higher Oil School (BHOS) 2024 report revealed that all 36 monthly values identically duplicated 2023 readings.
            </p>
          </div>

          <div className="card-base p-6 space-y-3 border-l-4 border-l-[#A66A16]">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#92400E]">
              <LineChart className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#18211C]">2. Monthly Bill Variance & Under-Detection</h4>
            <p className="text-xs text-[#68736C] leading-relaxed">
              With only 12 utility bills per year, degrees-of-freedom constraints make it statistically impossible to prove minor operational savings (&lt; 8–10%) at 80% power. Monthly models trigger false alarms (up to 28% placebo rate) or fail to detect real savings.
            </p>
          </div>

          <div className="card-base p-6 space-y-3 border-l-4 border-l-[#245C43]">
            <div className="w-8 h-8 rounded-full bg-[#E7F1EA] flex items-center justify-center text-[#153C2D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#18211C]">3. The EnerProof Evidence Gate Solution</h4>
            <p className="text-xs text-[#68736C] leading-relaxed">
              EnerProof applies a two-stage deterministic Evidence Gate: pre-screening data quality, weather-normalizing consumption via degree-day Ridge regression, and refusing claims unless apparent savings clear empirical noise thresholds and ASHRAE FSU ≤ 50%.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Live Demonstration Tracks */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-y border-[#DFE5E0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#245C43] mb-2">
                Interactive Competition Workflows
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#18211C]">
                Experience EnerProof Across 3 Live Tracks
              </h3>
            </div>
            <Link
              href="/demo"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#245C43] hover:underline"
            >
              View Full Demo Hub
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Demo A */}
            <div className="card-base p-6 flex flex-col justify-between card-hover">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B]">
                  Demo Track A
                </span>
                <h4 className="text-lg font-bold text-[#18211C]">
                  Baku Higher Oil School Public Audit
                </h4>
                <p className="text-xs text-[#68736C] leading-relaxed">
                  Audit public electricity and natural gas records. Detect the exact 10x GHG emissions calculation error (497.79 t calculated vs ~4,978 t reported) and 36 identical duplicated monthly readings.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-[#18211C]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Gate 1: Duplicate Annual Profile Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Gate 2: Emissions Arithmetic Factor Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Gate 3: Dormitory Submetering Audit</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/app/audit?demo=bhos"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-medium"
                >
                  Launch Demo A
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Demo B */}
            <div className="card-base p-6 flex flex-col justify-between card-hover">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#E7F1EA] text-[#153C2D]">
                  Demo Track B
                </span>
                <h4 className="text-lg font-bold text-[#18211C]">
                  Student Residence Deep Retrofit
                </h4>
                <p className="text-xs text-[#68736C] leading-relaxed">
                  Interactive engineering calculators for LED lighting, HVAC setback, plug load cutoffs, solar thermal hot water, and boiler tuning. Evaluate simple payback under Azerbaijan tariffs and generate IPMVP measurement plans.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-[#18211C]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>5 Engineering ECM Calculators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Degree-Day Baseline Weather Normalization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Audit-Grade PDF & CSV Report Generator</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/app/interventions?demo=residence"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-medium"
                >
                  Launch Demo B
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Demo C */}
            <div className="card-base p-6 flex flex-col justify-between card-hover">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EBF8FF] text-[#2B6CB0]">
                  Demo Track C
                </span>
                <h4 className="text-lg font-bold text-[#18211C]">
                  Building Energy Research Lab
                </h4>
                <p className="text-xs text-[#68736C] leading-relaxed">
                  Inspect the empirical research pipeline: 152 university & lodging buildings, repeated synthetic null tests, empirical MDE curves across resolutions, and cross-building residual correlation (ρ = 0.33) in ESCO portfolio pooling.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-[#18211C]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Hourly, Daily & Monthly Comparison</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Synthetic Null vs Historical Placebo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C43]" />
                    <span>Portfolio K=1 to K=50 Pooling Engine</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/app/portfolio?demo=research"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-medium"
                >
                  Launch Demo C
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Gate Three-Tier Protocol */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#245C43] mb-2">
            Deterministic Decision Support
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#18211C]">
            The EnerProof Evidence Gate Protocol
          </h3>
          <p className="mt-3 text-sm text-[#68736C]">
            Unlike opaque machine learning models that always produce a positive savings number, EnerProof deterministically refuses or defers claims when data quality or statistical uncertainty bounds fail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base p-6 bg-[#E7F1EA]/30 border-[#B8DAC4] space-y-3">
            <span className="badge-green text-xs font-semibold px-2.5 py-1 rounded-full">
              EVIDENCE_SUPPORTS_ESTIMATE
            </span>
            <h4 className="text-sm font-bold text-[#153C2D]">Standard Support Issued</h4>
            <p className="text-xs text-[#18211C] leading-relaxed">
              Issued when apparent savings clear the calibrated empirical resolution threshold (e.g., ≥ 11.8% daily) AND Fractional Savings Uncertainty (FSU) satisfies ASHRAE Guideline 14 Annex B tolerance (≤ 50.0% at 95% confidence).
            </p>
          </div>

          <div className="card-base p-6 bg-[#FEF3C7]/30 border-[#FDE68A] space-y-3">
            <span className="badge-amber text-xs font-semibold px-2.5 py-1 rounded-full">
              ADDITIONAL_MEASUREMENT_REQUIRED
            </span>
            <h4 className="text-sm font-bold text-[#92400E]">Monitoring Duration Extension</h4>
            <p className="text-xs text-[#18211C] leading-relaxed">
              Issued when apparent savings exceed the noise threshold, but post-intervention monitoring observations (m) are insufficient, causing FSU to exceed 50%. The platform prescribes the exact number of additional monitoring days needed.
            </p>
          </div>

          <div className="card-base p-6 bg-[#FEE2E2]/30 border-[#FECACA] space-y-3">
            <span className="badge-red text-xs font-semibold px-2.5 py-1 rounded-full">
              INSUFFICIENT_EVIDENCE
            </span>
            <h4 className="text-sm font-bold text-[#991B1B]">Claim Refused</h4>
            <p className="text-xs text-[#18211C] leading-relaxed">
              Issued when data quality gates fail (missing data &gt; 5%, zero flatlines, duplicate annual profiles), or when apparent savings remain within the baseline noise floor (&lt; calibrated threshold). Certification is refused.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-[#FFFFFF] border border-[#DFE5E0] text-center text-xs text-[#68736C]">
          <span className="font-semibold text-[#18211C]">Statutory Notice:</span> Evidence classifications are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.
        </div>
      </section>

      <Footer />
    </div>
  );
}
