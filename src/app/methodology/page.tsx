import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, ShieldCheck, Ruler, CheckCircle2, Sparkles } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F0]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Standards Alignment & Mathematical Formulation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#101C18] tracking-tight">
            EnerProof Technical Methodology
          </h1>
          <p className="text-base text-[#5D6D63] leading-relaxed">
            Mathematical formulation of the EnerProof Verification Engine, implementing ASHRAE Guideline 14-2014 Annex B, IPMVP Core Concepts, and empirical residual calibration.
          </p>
        </div>

        {/* 1. ASHRAE Guideline 14 Annex B Formulation */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
            <Ruler className="w-4 h-4" />
            1. Fractional Savings Uncertainty (FSU)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#101C18]">
            ASHRAE Guideline 14-2014 Annex B Formulation
          </h2>
          <p className="text-xs text-[#5D6D63] leading-relaxed">
            When reporting energy savings from whole-building or sub-metered utility data, apparent reductions cannot be treated as deterministic constants. ASHRAE Guideline 14 Annex B defines the Fractional Savings Uncertainty (FSU) at confidence level (1 - &alpha;) as:
          </p>

          <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] font-mono text-xs sm:text-sm text-[#101C18] overflow-x-auto text-center font-bold">
            FSU = t_(&alpha;/2, df) &times; [ CV(RMSE) / s ] &times; &radic;[ (1/m + 1/n) &times; (1 + r_1) / (1 - r_1) ]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#5D6D63]">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-[#101C18]">t_(&alpha;/2, df):</strong> Two-tailed Student t-statistic (1.96 for 95% confidence).</li>
              <li><strong className="text-[#101C18]">CV(RMSE):</strong> Coefficient of Variation of Root Mean Square Error of baseline model.</li>
              <li><strong className="text-[#101C18]">s:</strong> Apparent savings fraction (Apparent Savings / Baseline Consumption).</li>
            </ul>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-[#101C18]">n:</strong> Number of baseline monitoring intervals.</li>
              <li><strong className="text-[#101C18]">m:</strong> Number of post-intervention monitoring intervals.</li>
              <li><strong className="text-[#101C18]">r_1:</strong> Lag-1 residual serial autocorrelation coefficient (Cochrane-Orcutt correction).</li>
            </ul>
          </div>

          <div className="p-3.5 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] text-xs text-[#101C18]">
            <strong>ASHRAE 14 Acceptance Criterion:</strong> An energy savings claim is statistically valid only if FSU &le; 50.0% at 95% confidence. If FSU &gt; 50%, EnerProof issues <code className="font-mono font-bold text-[#152E27]">ADDITIONAL_MEASUREMENT_REQUIRED</code>.
          </div>
        </section>

        {/* 2. Degree-Day Weather Normalization */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
            2. Baseline Modeling & Degree-Day Normalization
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#101C18]">
            Degree-Day Ridge Weather Regression
          </h2>
          <p className="text-xs text-[#5D6D63] leading-relaxed">
            To isolate true energy conservation measures from weather fluctuations (such as hot Baku summers or cold Absheron winters), baseline consumption is modeled via multi-variable degree-day regression with L2 Ridge regularization:
          </p>

          <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] font-mono text-xs sm:text-sm text-[#101C18] overflow-x-auto text-center font-bold">
            E_baseline = &beta;_0 + &beta;_HDD &times; HDD + &beta;_CDD &times; CDD + &beta;_occ &times; Occupancy
          </div>

          <div className="space-y-3 text-xs text-[#5D6D63]">
            <p>
              Heating Degree Days (HDD) and Cooling Degree Days (CDD) are computed against the standard ASHRAE balance point temperature of 18.33°C (65°F):
            </p>
            <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] font-mono text-center text-[#101C18]">
              HDD = max(0, 18.33 - T_mean) &nbsp;&bull;&nbsp; CDD = max(0, T_mean - 18.33)
            </div>
            <p>
              <strong>Model Compliance Thresholds:</strong> Following ASHRAE Guideline 14 standards:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Daily Interval Models: CV(RMSE) &le; 25.0% and |NMBE| &le; 5.0%</li>
              <li>Monthly Utility Bill Models: CV(RMSE) &le; 15.0% and |NMBE| &le; 5.0%</li>
            </ul>
          </div>
        </section>

        {/* 3. IPMVP Option Selection Protocol */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
            3. Measurement & Verification Protocols
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#101C18]">
            IPMVP Option Selection Matrix
          </h2>
          <p className="text-xs text-[#5D6D63] leading-relaxed">
            The International Performance Measurement and Verification Protocol (IPMVP) provides four core options. EnerProof deterministically maps retrofit types and anticipated savings to the most cost-effective compliant option:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-sm font-display text-[#101C18]">IPMVP Option A: Retrofit Isolation (Key Parameter Measurement)</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-[10px] font-mono font-semibold">Lighting & Plug Loads</span>
              </div>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Used when equipment nominal power is constant or easily verified with spot measurements. Operating hours are logged with current switches or run-time loggers (e.g. 15-minute logging for 30 days).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-sm font-display text-[#101C18]">IPMVP Option B: Retrofit Isolation (All Parameter Measurement)</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-[10px] font-mono font-semibold">HVAC & Boiler Plants</span>
              </div>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Mandatory when anticipated savings (&lt; 12%) are below the whole-building noise threshold, or when systems exhibit continuous weather dependency. Direct submetering of chiller power, thermal BTU flow, or boiler fuel is required.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-sm font-display text-[#101C18]">IPMVP Option C: Whole Facility Verification</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-[10px] font-mono font-semibold">Deep Multi-Measure Retrofits</span>
              </div>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Used for comprehensive retrofits where total expected savings clear the whole-facility Evidence Gate threshold (&ge; 11.8% daily). Relies on utility revenue meter data with degree-day regression.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Limitations & Scope */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-4 border-l-4 border-l-[#9B641B]">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#9B641B]">
            4. Methodological Scope & Limitations
          </div>
          <h2 className="text-xl font-bold font-display text-[#101C18]">Scope Boundaries & Regulatory Notice</h2>
          <div className="space-y-2 text-xs text-[#5D6D63] leading-relaxed">
            <p>
              &bull; <strong>Decision Support, Not Statutory Certification:</strong> EnerProof determinations provide statistical evidence under modeled counterfactual assumptions. They do not substitute for on-site physical commissioning, statutory energy audit licensing under Azerbaijan law, or formal engineering seal.
            </p>
            <p>
              &bull; <strong>Counterfactual Non-Attribution:</strong> Apparent energy reductions indicate statistical consistency with projected savings. Without dedicated sub-metering (IPMVP Option B), whole-building meters cannot rule out unrecorded exogenous events (such as schedule curtailments or unnotified occupancy drops).
            </p>
            <p>
              &bull; <strong>Tariff Sensitivity:</strong> All financial ROI and payback estimates depend on the active utility tariff (default: 0.125 AZN/kWh). In Azerbaijan, subsidized electricity tariffs necessitate combining energy efficiency with subsidized Energy Efficiency Fund financing.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
