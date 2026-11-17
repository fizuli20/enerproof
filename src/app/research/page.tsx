import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PowerCurveChart } from "@/components/PowerCurveChart";
import { CheckCircle2, AlertTriangle, ShieldCheck, BarChart3, Layers, Database, Sparkles } from "lucide-react";
import { ResearchHeroVisual } from "@/components/visuals/ResearchHeroVisual";

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
    <div className="min-h-screen flex flex-col bg-[#F4F5F0]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            Scientific Methodology & Empirical Benchmark
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#101C18] tracking-tight">
            EnerProof Scientific Research Dossier
          </h1>
          <p className="text-base text-[#5D6D63] leading-relaxed">
            Independent reproducibility audit, statistical power modeling, and empirical calibration across 152 buildings from the Building Data Genome 2 (BDG2) dataset. Conducted for the CECECO Clean Energy Hackathon 2027.
          </p>
        </div>

        {/* Visual Benchmark Summary Card */}
        <ResearchHeroVisual />

        {/* 1. Scientific Governance & Provenance */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
            <ShieldCheck className="w-4 h-4" />
            1. Data Provenance & Pre-Test Cohort Selection
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#5D6D63] leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-base font-bold font-display text-[#101C18]">The BDG2 Benchmark Cohort</h3>
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

            <div className="space-y-3 bg-[#F4F5F0] p-5 rounded-xl border border-[#DDE3DB]">
              <h4 className="text-sm font-bold font-display text-[#101C18]">Authoritative Benchmark Metrics</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between border-b border-[#DDE3DB] pb-1">
                  <span>Initial Screened Cohort:</span>
                  <span className="font-mono font-semibold text-[#101C18]">152 buildings (82 lodging, 70 education)</span>
                </li>
                <li className="flex justify-between border-b border-[#DDE3DB] pb-1">
                  <span>Test-Period Dropouts (Abstentions):</span>
                  <span className="font-mono font-semibold text-[#B74740]">9 buildings (recorded as abstentions)</span>
                </li>
                <li className="flex justify-between border-b border-[#DDE3DB] pb-1">
                  <span>Completed Evaluation Sample:</span>
                  <span className="font-mono font-semibold text-[#152E27]">143 buildings</span>
                </li>
                <li className="flex justify-between border-b border-[#DDE3DB] pb-1">
                  <span>Simulation Granularity:</span>
                  <span className="font-mono font-semibold text-[#101C18]">Hourly-first with exact sum aggregation</span>
                </li>
                <li className="flex justify-between border-b border-[#DDE3DB] pb-1">
                  <span>Target False-Alarm Ceiling (&alpha;):</span>
                  <span className="font-mono font-semibold text-[#101C18]">5.0% (95% nominal confidence)</span>
                </li>
                <li className="flex justify-between">
                  <span>Target Statistical Power:</span>
                  <span className="font-mono font-semibold text-[#101C18]">80.0% (ASHRAE Guideline 14 Annex B)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Authoritative Resolution Comparison Table */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27] mb-1">
              2. Empirical Evidence Gate Benchmarks
            </div>
            <h2 className="text-2xl font-bold font-display text-[#101C18]">
              Authoritative Resolution Comparison & Quality Gate Results
            </h2>
            <p className="mt-1 text-xs text-[#5D6D63]">
              Derived from 152 buildings, 50 repeated synthetic null draws with centered residuals, and matched 6-month evaluation windows.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#DDE3DB] rounded-lg overflow-hidden">
              <thead className="bg-[#F4F5F0] text-[#101C18] font-bold border-b border-[#DDE3DB]">
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
              <tbody className="divide-y divide-[#DDE3DB] bg-white font-mono">
                <tr className="hover:bg-[#F4F5F0]/50">
                  <td className="p-3 font-sans font-semibold text-[#101C18]">Hourly Interval</td>
                  <td className="p-3 font-sans">Ridge weather regression</td>
                  <td className="p-3 font-bold">8.37%</td>
                  <td className="p-3 text-[#B74740]">6.98%</td>
                  <td className="p-3 text-[#B74740]">28.67%</td>
                  <td className="p-3 text-[#B74740]">UNESTABLISHED (FPR &gt; 5%)</td>
                  <td className="p-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#991B1B]">FAIL_BOTH_CONTROLS</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F5F0]/50 bg-[#152E27]/5">
                  <td className="p-3 font-sans font-semibold text-[#101C18]">Daily Interval</td>
                  <td className="p-3 font-sans">Ridge weather regression</td>
                  <td className="p-3 font-bold text-[#152E27]">11.80%</td>
                  <td className="p-3 text-[#152E27] font-bold">4.21% (&le; 5%)</td>
                  <td className="p-3 text-[#B74740]">22.38%</td>
                  <td className="p-3 text-[#152E27] font-bold">
                    83.9% at 15% savings
                    <span className="block text-[10px] font-normal text-[#92400E]">MDE unestablished (Placebo FAR &gt; 5%)</span>
                  </td>
                  <td className="p-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#92400E]">PASS_SYNTH_FAIL_PLACEBO</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F5F0]/50">
                  <td className="p-3 font-sans font-semibold text-[#101C18]">Monthly Utility Bill</td>
                  <td className="p-3 font-sans">Ridge weather regression</td>
                  <td className="p-3 font-bold">13.64%</td>
                  <td className="p-3 text-[#B74740]">6.81%</td>
                  <td className="p-3 text-[#B74740]">18.18%</td>
                  <td className="p-3 text-[#B74740]">UNESTABLISHED (FPR &gt; 5%)</td>
                  <td className="p-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#991B1B]">FAIL_BOTH_CONTROLS</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
            <div className="font-bold">Crucial Scientific Finding on Historical Placebos & Quality Gate Verdicts:</div>
            <p className="leading-relaxed">
              While the daily interval model achieves a synthetic null false positive rate of 4.21% (&le; 5.0%), it does <strong>not</strong> pass the full scientific gate because its historical placebo false alarm rate reaches <strong>22.38%</strong>. Real commercial and educational buildings undergo continuous operational drift, academic schedule changes, and unrecorded equipment swaps. Because historical placebos exhibit 18.2% to 28.7% false alarms across all resolutions, satisfying synthetic null controls alone is insufficient proof of real-world calibration.
            </p>
          </div>
        </section>

        {/* 3. Interactive Power Curves */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27] mb-1">
              3. Statistical Detection Power
            </div>
            <h2 className="text-2xl font-bold font-display text-[#101C18]">
              Empirical Detection Power & Portfolio Pooling
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PowerCurveChart mode="resolution" />
            <PowerCurveChart mode="portfolio" />
          </div>
        </section>

        {/* 4. Negative Results & Corrected Claims */}
        <section className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#B74740]">
            4. Negative Results & Corrected Assumptions
          </div>
          <h2 className="text-2xl font-bold font-display text-[#101C18]">
            What Didn't Work: Scientific Corrections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5D6D63]">
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="font-bold font-display text-[#B74740]">Correction 1: Single-Building MDE Remains Unestablished</div>
              <p className="leading-relaxed">
                In initial exploratory runs, single buildings were hypothesized to detect minor savings. In the corrected BDG2 cohort, daily ridge models achieve <strong>83.9% detection at 15% simulated savings</strong> under synthetic null, but empirical power at 5% simulated savings is only <strong>46.9%</strong>. More fundamentally, because real-world historical placebo false alarms reach <strong>22.38%</strong> (exceeding the 5.0% target), the formal minimum detectable effect (MDE) remains strictly <strong>UNESTABLISHED</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="font-bold font-display text-[#B74740]">Correction 2: Monthly Utility Bills Cannot Prove Minor Savings</div>
              <p className="leading-relaxed">
                Monthly utility bills provide only 12 degrees of freedom annually. Under BDG2 evaluation, a 3% saving was detected in only <strong>17.4%</strong> of monthly test windows. Verifying minor operational or behavioral savings (&lt; 8–10%) requires interval telemetry or dedicated submetering.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="font-bold font-display text-[#B74740]">Correction 3: Cross-Building Residual Correlation (Illustrative &rho; = 0.33 Model)</div>
              <p className="leading-relaxed">
                Naive ESCO portfolio models assume building residual errors are mutually independent, predicting noise diminishes as 1/&radic;K. In shared microclimate simulations, an illustrative cross-building correlation of <strong>&rho; &asymp; 0.33</strong> models shared weather shocks, causing portfolio noise to asymptote to &sigma;&radic;&rho; rather than zero. For arbitrary user facilities, empirical residual covariance (&Sigma;) must be directly provided; otherwise, portfolio uncertainty is strictly returned as <strong>UNESTABLISHED</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="font-bold font-display text-[#B74740]">Correction 4: Dormitory Behavioral Nudges Yield &lt; 1.5%</div>
              <p className="leading-relaxed">
                While competition proposals often claim 8–10% savings from student awareness campaigns and posters, physical empirical literature confirms that purely behavioral nudges consistently deliver only <strong>1.1% to 1.5%</strong> persistent savings. Achieving &gt; 5% requires physical hardware controls (LEDs, HVAC setbacks, boiler tuning).
              </p>
            </div>
          </div>
        </section>

        {/* 5. Complete Research Figures Gallery */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27] mb-1">
              5. Empirical Research Figures (10 Figures)
            </div>
            <h2 className="text-2xl font-bold font-display text-[#101C18]">
              Generated Research Figures & Evidence
            </h2>
            <p className="mt-1 text-xs text-[#5D6D63]">
              Generated by the audited Experiment 2 Python pipeline (`enerproof-research/outputs/figures`).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {figures.map((fig) => (
              <div key={fig.id} className="card-editorial p-4 bg-white space-y-3 shadow-sm">
                <div className="font-semibold text-xs text-[#101C18]">{fig.title}</div>
                <div className="relative w-full aspect-[16/10] bg-[#F4F5F0] rounded-lg overflow-hidden border border-[#DDE3DB]">
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
