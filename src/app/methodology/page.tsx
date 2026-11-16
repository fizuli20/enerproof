import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, ShieldCheck, Ruler, CheckCircle2 } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] text-xs font-semibold text-[#153C2D]">
            <BookOpen className="w-3.5 h-3.5 text-[#245C43]" />
            Standards Alignment & Mathematical Formulation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#18211C] tracking-tight">
            EnerProof Technical Methodology
          </h1>
          <p className="text-base text-[#68736C] leading-relaxed">
            Mathematical formulation of the EnerProof Verification Engine, implementing ASHRAE Guideline 14-2014 Annex B, IPMVP Core Concepts, and empirical residual calibration.
          </p>
        </div>

        {/* 1. ASHRAE Guideline 14 Annex B Formulation */}
        <section className="card-base p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245C43]">
            <Ruler className="w-4 h-4" />
            1. Fractional Savings Uncertainty (FSU)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18211C]">
            ASHRAE Guideline 14-2014 Annex B Formulation
          </h2>
          <p className="text-xs text-[#68736C] leading-relaxed">
            When reporting energy savings from whole-building or sub-metered utility data, apparent reductions cannot be treated as deterministic constants. ASHRAE Guideline 14 Annex B defines the Fractional Savings Uncertainty (FSU) at confidence level (1 - α) as:
          </p>

          <div className="p-4 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] font-mono text-xs sm:text-sm text-[#18211C] overflow-x-auto text-center">
            FSU = t_(&alpha;/2, df) &times; [ CV(RMSE) / s ] &times; &radic;[ (1/m + 1/n) &times; (1 + r_1) / (1 - r_1) ]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#68736C]">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-[#18211C]">t_(&alpha;/2, df):</strong> Two-tailed Student t-statistic (1.96 for 95% confidence).</li>
              <li><strong className="text-[#18211C]">CV(RMSE):</strong> Coefficient of Variation of Root Mean Square Error of baseline model.</li>
              <li><strong className="text-[#18211C]">s:</strong> Apparent savings fraction (Apparent Savings / Baseline Consumption).</li>
            </ul>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-[#18211C]">n:</strong> Number of baseline monitoring intervals.</li>
              <li><strong className="text-[#18211C]">m:</strong> Number of post-intervention monitoring intervals.</li>
              <li><strong className="text-[#18211C]">r_1:</strong> Lag-1 residual serial autocorrelation coefficient (Cochrane-Orcutt correction).</li>
            </ul>
          </div>

          <div className="p-3 bg-[#E7F1EA] rounded border border-[#B8DAC4] text-xs text-[#153C2D]">
            <strong>ASHRAE 14 Acceptance Criterion:</strong> An energy savings claim is statistically valid only if FSU &le; 50.0% at 95% confidence (or 68% confidence depending on jurisdiction). If FSU &gt; 50%, EnerProof issues <code className="font-bold">ADDITIONAL_MEASUREMENT_REQUIRED</code>.
          </div>
        </section>

        {/* 2. Degree-Day Weather Normalization */}
        <section className="card-base p-6 sm:p-8 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245C43]">
            2. Baseline Modeling & Degree-Day Normalization
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18211C]">
            Degree-Day Ridge Weather Regression
          </h2>
          <p className="text-xs text-[#68736C] leading-relaxed">
            To isolate true energy conservation measures from weather fluctuations (such as hot Baku summers or cold Absheron winters), baseline consumption is modeled via multi-variable degree-day regression with L2 Ridge regularization:
          </p>

          <div className="p-4 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] font-mono text-xs sm:text-sm text-[#18211C] overflow-x-auto text-center">
            E_baseline = &beta;_0 + &beta;_HDD &times; HDD + &beta;_CDD &times; CDD + &beta;_occ &times; Occupancy
          </div>

          <div className="space-y-3 text-xs text-[#68736C]">
            <p>
              Heating Degree Days (HDD) and Cooling Degree Days (CDD) are computed against the standard ASHRAE balance point temperature of 18.33°C (65°F):
            </p>
            <div className="p-3 bg-[#FFFFFF] rounded border border-[#DFE5E0] font-mono text-center">
              HDD = max(0, 18.33 - T_mean) &nbsp;&nbsp;|&nbsp;&nbsp; CDD = max(0, T_mean - 18.33)
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
        <section className="card-base p-6 sm:p-8 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245C43]">
            3. Measurement & Verification Protocols
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18211C]">
            IPMVP Option Selection Matrix
          </h2>
          <p className="text-xs text-[#68736C] leading-relaxed">
            The International Performance Measurement and Verification Protocol (IPMVP) provides four core options. EnerProof deterministically maps retrofit types and anticipated savings to the most cost-effective compliant option:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#DFE5E0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#18211C]">IPMVP Option A: Retrofit Isolation (Key Parameter Measurement)</span>
                <span className="badge-green text-[10px] font-semibold px-2 py-0.5 rounded">Lighting & Plug Loads</span>
              </div>
              <p className="text-xs text-[#68736C]">
                Used when equipment nominal power is constant or easily verified with spot measurements. Operating hours are logged with current switches or run-time loggers (e.g. 15-minute logging for 30 days).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#DFE5E0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#18211C]">IPMVP Option B: Retrofit Isolation (All Parameter Measurement)</span>
                <span className="badge-blue text-[10px] font-semibold px-2 py-0.5 rounded">HVAC & Boiler Plants</span>
              </div>
              <p className="text-xs text-[#68736C]">
                Mandatory when anticipated savings (&lt; 12%) are below the whole-building noise threshold, or when systems exhibit continuous weather dependency. Direct submetering of chiller power, thermal BTU flow, or boiler fuel is required.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#DFE5E0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#18211C]">IPMVP Option C: Whole Facility Verification</span>
                <span className="badge-amber text-[10px] font-semibold px-2 py-0.5 rounded">Deep Multi-Measure Retrofits</span>
              </div>
              <p className="text-xs text-[#68736C]">
                Used for comprehensive retrofits where total expected savings clear the whole-facility Evidence Gate threshold (&ge; 11.8% daily). Relies on utility revenue meter data with degree-day regression.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Limitations & Scope */}
        <section className="card-base p-6 sm:p-8 space-y-4 border-l-4 border-l-[#A66A16]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A66A16]">
            4. Methodological Scope & Limitations
          </div>
          <h2 className="text-xl font-bold text-[#18211C]">Scope Boundaries & Regulatory Notice</h2>
          <div className="space-y-2 text-xs text-[#68736C] leading-relaxed">
            <p>
              • <strong>Decision Support, Not Statutory Certification:</strong> EnerProof determinations provide statistical evidence under modeled counterfactual assumptions. They do not substitute for on-site physical commissioning, statutory energy audit licensing under Azerbaijan law, or formal engineering seal.
            </p>
            <p>
              • <strong>Counterfactual Non-Attribution:</strong> Apparent energy reductions indicate statistical consistency with projected savings. Without dedicated sub-metering (IPMVP Option B), whole-building meters cannot rule out unrecorded exogenous events (such as schedule curtailments or unnotified occupancy drops).
            </p>
            <p>
              • <strong>Tariff Sensitivity:</strong> All financial ROI and payback estimates depend on the active utility tariff (default: 0.125 AZN/kWh). In Azerbaijan, subsidized electricity tariffs necessitate combining energy efficiency with subsidized Energy Efficiency Fund financing.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
