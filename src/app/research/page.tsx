import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PowerCurveChart } from "@/components/PowerCurveChart";
import { CheckCircle2, AlertTriangle, ShieldCheck, BarChart3, Layers, Database } from "lucide-react";
import Image from "next/image";

export default function ResearchPage() {
  const figures = [
    { id: "fig01", title: "Fig 1: Cohort Selection & Data Completeness Gates", file: "/research-figures/fig01_dataset_coverage_selection.png" },
    { id: "fig02", title: "Fig 2: Baseline Model Forecast Accuracy Across Resolutions", file: "/research-figures/fig02_forecast_accuracy_by_model_resolution.png" },
    { id: "fig03", title: "Fig 3: Predicted Counterfactual vs Measured Consumption", file: "/research-figures/fig03_predicted_vs_measured_consumption.png" },
    { id: "fig04", title: "Fig 4: Detection Power vs Simulated Savings Percentage", file: "/research-figures/fig04_detection_power_vs_savings.png" },
    { id: "fig05", title: "Fig 5: False Alarm Rates (Synthetic Null vs Historical Placebo)", file: "/research-figures/fig05_false_alarm_rates.png" },
    { id: "fig06", title: "Fig 6: Empirical Minimum Detectable Effect Distributions", file: "/research-figures/fig06_empirical_minimum_detectable_savings.png" },
    { id: "fig07", title: "Fig 7: Reporting Window Duration vs Uncertainty Bounds", file: "/research-figures/fig07_reporting_window_uncertainty.png" },
    { id: "fig08", title: "Fig 8: Individual vs Portfolio Detection Power Scaling", file: "/research-figures/fig08_individual_vs_portfolio_detection.png" },
    { id: "fig09", title: "Fig 9: Baku Higher Oil School (BHOS) Data Quality Audit", file: "/research-figures/fig09_bhos_data_quality_audit.png" },
    { id: "fig10", title: "Fig 10: BHOS Fuel & Electricity Seasonal Consumption Breakdown", file: "/research-figures/fig10_bhos_fuel_electricity_seasonality.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] text-xs font-semibold text-[#153C2D]">
            <Database className="w-3.5 h-3.5 text-[#245C43]" />
            Scientific Methodology & Empirical Benchmark
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#18211C] tracking-tight">
            EnerProof Scientific Research Dossier
          </h1>
          <p className="text-base text-[#68736C] leading-relaxed">
            Independent reproducibility audit, statistical power modeling, and empirical calibration across 152 buildings from the Building Data Genome 2 (BDG2) dataset. Conducted for the CECECO Clean Energy Hackathon 2027.
          </p>
        </div>

        {/* 1. Scientific Governance & Provenance */}
        <section className="card-base p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245C43]">
            <ShieldCheck className="w-4 h-4" />
            1. Data Provenance & Pre-Test Cohort Selection
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#68736C] leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#18211C]">The BDG2 Benchmark Cohort</h3>
              <p>
                To avoid self-serving synthetic assumptions, the EnerProof verification engine was tested against the peer-reviewed Building Data Genome 2 (BDG2) dataset (Miller et al., <em>Nature Scientific Data</em>, 2020), consisting of whole-building interval electricity meters and on-site weather records from university campuses.
              </p>
              <p>
                <strong>Initial Pre-Test Selection:</strong> Exactly 152 qualifying buildings (82 lodging/residential, 70 educational) were selected strictly on training/calibration completeness (January–June 2016 and January–June 2017) without inspecting test-period outcomes.
              </p>
              <p>
                <strong>Evaluation Period Abstentions:</strong> During the July–December 2017 held-out evaluation window, 9 buildings experienced missing meter telemetry or severe physical dropouts. In accordance with strict scientific gatekeeping, these 9 buildings were recorded as <em>cohort abstentions</em> rather than retroactively purged from the denominator.
              </p>
            </div>

            <div className="space-y-3 bg-[#F8F9F7] p-5 rounded-lg border border-[#DFE5E0]">
              <h4 className="text-sm font-bold text-[#18211C]">Authoritative Benchmark Metrics</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between border-b border-[#DFE5E0] pb-1">
                  <span>Initial Screened Cohort:</span>
                  <span className="font-mono font-semibold text-[#18211C]">152 buildings (82 lodging, 70 education)</span>
                </li>
                <li className="flex justify-between border-b border-[#DFE5E0] pb-1">
                  <span>Test-Period Dropouts (Abstentions):</span>
                  <span className="font-mono font-semibold text-[#B74740]">9 buildings (recorded as abstentions)</span>
                </li>
                <li className="flex justify-between border-b border-[#DFE5E0] pb-1">
                  <span>Completed Evaluation Sample:</span>
                  <span className="font-mono font-semibold text-[#245C43]">143 buildings</span>
                </li>
                <li className="flex justify-between border-b border-[#DFE5E0] pb-1">
                  <span>Simulation Granularity:</span>
                  <span className="font-mono font-semibold text-[#18211C]">Hourly-first with exact sum aggregation</span>
                </li>
                <li className="flex justify-between border-b border-[#DFE5E0] pb-1">
                  <span>Target False-Alarm Ceiling (α):</span>
                  <span className="font-mono font-semibold text-[#18211C]">5.0% (95% nominal confidence)</span>
                </li>
                <li className="flex justify-between">
                  <span>Target Statistical Power:</span>
                  <span className="font-mono font-semibold text-[#18211C]">80.0% (ASHRAE Guideline 14 Annex B)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Authoritative Resolution Comparison Table */}
        <section className="card-base p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#245C43] mb-1">
              2. Empirical Evidence Gate Benchmarks
            </div>
            <h2 className="text-2xl font-bold text-[#18211C]">
              Authoritative Resolution Comparison & Quality Gate Results
            </h2>
            <p className="mt-1 text-xs text-[#68736C]">
              Derived from 152 buildings, 50 repeated synthetic null draws with centered residuals, and matched 6-month evaluation windows.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#DFE5E0] rounded-lg overflow-hidden">
              <thead className="bg-[#E7F1EA] text-[#153C2D] font-bold">
                <tr>
                  <th className="p-3">Resolution Tier</th>
                  <th className="p-3">Primary Baseline Model</th>
                  <th className="p-3">Calibrated Threshold</th>
                  <th className="p-3">Synthetic Null FPR</th>
                  <th className="p-3">Historical Placebo FAR</th>
                  <th className="p-3">Cohort Empirical MDE</th>
                  <th className="p-3">Quality Gate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE5E0] bg-white">
                <tr className="hover:bg-[#F8F9F7]">
                  <td className="p-3 font-semibold text-[#18211C]">Hourly Interval</td>
                  <td className="p-3">Ridge weather regression</td>
                  <td className="p-3 font-mono font-bold">8.37%</td>
                  <td className="p-3 font-mono text-[#B74740]">6.98%</td>
                  <td className="p-3 font-mono text-[#B74740]">28.67%</td>
                  <td className="p-3 font-mono text-[#B74740]">UNESTABLISHED (FPR &gt; 5%)</td>
                  <td className="p-3">
                    <span className="badge-red px-2 py-0.5 rounded text-[10px] font-bold">FAIL_BOTH_CONTROLS</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#F8F9F7] bg-[#E7F1EA]/10">
                  <td className="p-3 font-semibold text-[#18211C]">Daily Interval</td>
                  <td className="p-3">Ridge weather regression</td>
                  <td className="p-3 font-mono font-bold text-[#245C43]">11.80%</td>
                  <td className="p-3 font-mono text-[#245C43] font-bold">4.21% (≤ 5%)</td>
                  <td className="p-3 font-mono text-[#B74740]">22.38%</td>
                  <td className="p-3 font-mono text-[#245C43] font-bold">15.0%</td>
                  <td className="p-3">
                    <span className="badge-green px-2 py-0.5 rounded text-[10px] font-bold">PASS_SYNTH_CONTROL</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#F8F9F7]">
                  <td className="p-3 font-semibold text-[#18211C]">Monthly Utility Bill</td>
                  <td className="p-3">Ridge weather regression</td>
                  <td className="p-3 font-mono font-bold">13.64%</td>
                  <td className="p-3 font-mono text-[#B74740]">6.81%</td>
                  <td className="p-3 font-mono text-[#B74740]">18.18%</td>
                  <td className="p-3 font-mono text-[#B74740]">UNESTABLISHED (FPR &gt; 5%)</td>
                  <td className="p-3">
                    <span className="badge-red px-2 py-0.5 rounded text-[10px] font-bold">FAIL_BOTH_CONTROLS</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg bg-[#FEF3C7]/40 border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
            <div className="font-bold">Crucial Scientific Finding on Historical Placebos:</div>
            <p>
              Historical placebo windows (pre-intervention periods tested as if interventions occurred) exhibited high false-alarm rates (18.2% to 28.7%) across all resolutions. This proves that real commercial and educational buildings undergo continuous operational drift, academic schedule changes, and unrecorded equipment swaps. A real-world placebo window cannot be treated as a confirmed stationary null control.
            </p>
          </div>
        </section>

        {/* 3. Interactive Power Curves */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#245C43] mb-1">
              3. Statistical Detection Power
            </div>
            <h2 className="text-2xl font-bold text-[#18211C]">
              Empirical Detection Power & Portfolio Pooling
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PowerCurveChart mode="resolution" />
            <PowerCurveChart mode="portfolio" />
          </div>
        </section>

        {/* 4. Negative Results & Corrected Claims */}
        <section className="card-base p-6 sm:p-8 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#B74740]">
            4. Negative Results & Corrected Assumptions
          </div>
          <h2 className="text-2xl font-bold text-[#18211C]">
            What Didn't Work: Scientific Corrections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#68736C]">
            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="font-bold text-[#B74740]">Correction 1: Single-Building 5% MDE is Unsupported</div>
              <p>
                In our initial exploratory runs, single buildings were hypothesized to detect 5% savings at 80% power. Rigorous repeated simulation demonstrated that empirical power for a 5% saving in single buildings is only <strong>24.7% (daily)</strong> and <strong>23.8% (hourly)</strong>. Claiming 80% power at 5% savings for unpooled buildings is scientifically unsupported.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="font-bold text-[#B74740]">Correction 2: Monthly Utility Bills Cannot Prove Minor Savings</div>
              <p>
                Monthly utility bills provide only 12 degrees of freedom annually. Under BDG2 evaluation, a 3% saving was detected in only <strong>17.4%</strong> of monthly test windows. Verifying minor operational or behavioral savings (&lt; 8–10%) requires interval telemetry or dedicated submetering.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="font-bold text-[#B74740]">Correction 3: Cross-Building Residual Correlation (ρ = 0.33)</div>
              <p>
                Naive ESCO portfolio models assume building residual errors are mutually independent, predicting noise diminishes as 1/√K. In reality, same-campus buildings share weather microclimates, academic calendars, and grid dynamics, creating an intra-site residual correlation of <strong>ρ ≈ 0.33</strong>. The portfolio noise floor asymptotes to σ√ρ, not zero.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="font-bold text-[#B74740]">Correction 4: Dormitory Behavioral Nudges Yield &lt; 1.5%</div>
              <p>
                While competition proposals often claim 8–10% savings from student awareness campaigns and posters, physical empirical literature confirms that purely behavioral nudges consistently deliver only <strong>1.1% to 1.5%</strong> persistent savings. Achieving &gt; 5% requires physical hardware controls (LEDs, HVAC setbacks, boiler tuning).
              </p>
            </div>
          </div>
        </section>

        {/* 5. Complete Research Figures Gallery */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#245C43] mb-1">
              5. Empirical Research Figures (10 Figures)
            </div>
            <h2 className="text-2xl font-bold text-[#18211C]">
              Generated Research Figures & Evidence
            </h2>
            <p className="mt-1 text-xs text-[#68736C]">
              Generated by the audited Experiment 2 Python pipeline (`enerproof-research/outputs/figures`).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {figures.map((fig) => (
              <div key={fig.id} className="card-base p-4 space-y-3 shadow-sm">
                <div className="font-semibold text-xs text-[#18211C]">{fig.title}</div>
                <div className="relative w-full aspect-[16/10] bg-[#F8F9F7] rounded overflow-hidden border border-[#DFE5E0]">
                  <img
                    src={fig.file}
                    alt={fig.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
