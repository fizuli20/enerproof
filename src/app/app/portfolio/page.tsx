"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PowerCurveChart } from "@/components/PowerCurveChart";
import {
  calculateUserPortfolio,
  simulateTheoreticalCorrelation,
  RESEARCH_BENCHMARK_PORTFOLIO_FINDINGS,
  UserBuildingItem,
} from "@/lib/portfolio/aggregator";
import { useProject } from "@/lib/store/project-context";
import {
  Building2,
  Layers,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  HelpCircle,
  BarChart2,
} from "lucide-react";

export default function PortfolioPage() {
  const { project } = useProject();

  const [activeTab, setActiveTab] = useState<"calculator" | "research">("calculator");

  // User Portfolio State
  const [includeAlignedResiduals, setIncludeAlignedResiduals] = useState<boolean>(false);
  const [userBuildings, setUserBuildings] = useState<UserBuildingItem[]>([
    {
      id: "bld-1",
      name: "Baku Student Residence Hall 1",
      baselineEnergyKwh: 300000,
      apparentSavingsKwh: 45000,
      implementationCostAzn: 17500,
      measurementCostAzn: 2500,
    },
    {
      id: "bld-2",
      name: "Baku Campus Academic Wing A",
      baselineEnergyKwh: 520000,
      apparentSavingsKwh: 68000,
      implementationCostAzn: 22000,
      measurementCostAzn: 3200,
    },
    {
      id: "bld-3",
      name: "Baku Engineering Laboratory Complex",
      baselineEnergyKwh: 440000,
      apparentSavingsKwh: 52000,
      implementationCostAzn: 19000,
      measurementCostAzn: 2800,
    },
    {
      id: "bld-4",
      name: "Central Campus Library",
      baselineEnergyKwh: 210000,
      apparentSavingsKwh: 28000,
      implementationCostAzn: 12000,
      measurementCostAzn: 1800,
    },
  ]);

  // If synthetic aligned residuals are toggled, populate them
  const evaluatedBuildings = userBuildings.map((b) => ({
    ...b,
    residuals: includeAlignedResiduals
      ? Array.from({ length: 30 }, (_, i) => Math.sin(i * 0.4) * 50 + (Math.random() - 0.5) * 20)
      : undefined,
  }));

  const userPortfolio = calculateUserPortfolio(
    evaluatedBuildings,
    project.tariffs.electricityTariffAznPerKwh
  );

  // Theoretical Simulation State (for Research tab)
  const [simBuildingCount, setSimBuildingCount] = useState<number>(20);
  const [simCorrelation, setSimCorrelation] = useState<number>(0.33);

  const simulation = simulateTheoreticalCorrelation({
    buildingCount: simBuildingCount,
    assumedIndividualCvRmsePct: 14.8,
    assumedCrossBuildingCorrelation: simCorrelation,
    assumedSavingsPct: 10.0,
    confidenceAlpha: 0.05,
  });

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="6. Multi-Building Portfolio Aggregation & Research Explorer"
        subtitle="Separated operational portfolio calculator and 152-building BDG2 empirical research benchmark."
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#DFE5E0] gap-4">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "calculator"
                ? "border-[#245C43] text-[#245C43]"
                : "border-transparent text-[#68736C] hover:text-[#18211C]"
            }`}
          >
            <Building2 className="w-4 h-4" />
            1. User Portfolio Calculator (Operational)
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "research"
                ? "border-[#245C43] text-[#245C43]"
                : "border-transparent text-[#68736C] hover:text-[#18211C]"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            2. Research Benchmark Explorer (BDG2 152 Buildings)
          </button>
        </div>

        {/* TAB 1: USER PORTFOLIO CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-base p-4">
                <div className="text-xs text-[#68736C]">Contract Buildings</div>
                <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                  K = {userPortfolio.buildingCount}
                </div>
                <div className="text-[11px] text-[#245C43] mt-1">Multi-facility pool</div>
              </div>

              <div className="card-base p-4">
                <div className="text-xs text-[#68736C]">Aggregated Baseline</div>
                <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                  {(userPortfolio.totalBaselineKwh / 1000).toLocaleString()} MWh
                </div>
                <div className="text-[11px] text-[#68736C] mt-1">
                  Apparent: {(userPortfolio.totalApparentSavingsKwh / 1000).toLocaleString()} MWh ({userPortfolio.weightedSavingsPct}%)
                </div>
              </div>

              <div className="card-base p-4">
                <div className="text-xs text-[#68736C]">Total Investment (CapEx + M&V)</div>
                <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                  {userPortfolio.totalInvestmentAzn.toLocaleString()} AZN
                </div>
                <div className="text-[11px] text-[#245C43] mt-1">
                  Annual Net: {userPortfolio.annualNetSavingsAzn.toLocaleString()} AZN/yr
                </div>
              </div>

              <div className="card-base p-4">
                <div className="text-xs text-[#68736C]">Portfolio Statistical Uncertainty</div>
                <div
                  className={`text-xl font-bold font-mono mt-1 ${
                    userPortfolio.portfolioUncertaintyStatus === "ESTABLISHED"
                      ? "text-[#245C43]"
                      : "text-[#A66A16]"
                  }`}
                >
                  {userPortfolio.portfolioUncertaintyStatus}
                </div>
                <div className="text-[11px] text-[#68736C] mt-1">
                  {userPortfolio.portfolioFsuPct !== null
                    ? `FSU: ±${userPortfolio.portfolioFsuPct}%`
                    : "Covariance matrix required"}
                </div>
              </div>
            </div>

            {/* Scientific Guardrail Box */}
            <div className="card-base p-5 bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#18211C] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#245C43]" />
                  Scientific Guardrail: Empirical Covariance Required
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#245C43]">
                  <input
                    type="checkbox"
                    checked={includeAlignedResiduals}
                    onChange={(e) => setIncludeAlignedResiduals(e.target.checked)}
                    className="w-4 h-4 accent-[#245C43]"
                  />
                  Simulate Aligned Residual Time-Series
                </label>
              </div>
              <p className="text-xs text-[#68736C] leading-relaxed">
                {userPortfolio.uncertaintyNotes}
              </p>
            </div>

            {/* Buildings List Table */}
            <div className="card-base p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#18211C]">
                  Portfolio Building Inventory ({userBuildings.length} Facilities)
                </h3>
              </div>

              <div className="overflow-x-auto border border-[#DFE5E0] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E7F1EA] text-[#153C2D] font-semibold">
                    <tr>
                      <th className="p-3">Building Name</th>
                      <th className="p-3">Baseline (kWh)</th>
                      <th className="p-3">Savings (kWh)</th>
                      <th className="p-3">Savings %</th>
                      <th className="p-3">CapEx (AZN)</th>
                      <th className="p-3">M&V Cost (AZN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE5E0] font-mono">
                    {userBuildings.map((b) => {
                      const pct = b.baselineEnergyKwh > 0 ? (b.apparentSavingsKwh / b.baselineEnergyKwh) * 100 : 0;
                      return (
                        <tr key={b.id} className="hover:bg-[#F8F9F7] text-[#18211C]">
                          <td className="p-3 font-sans font-semibold">{b.name}</td>
                          <td className="p-3">{b.baselineEnergyKwh.toLocaleString()}</td>
                          <td className="p-3 text-[#245C43] font-semibold">
                            {b.apparentSavingsKwh.toLocaleString()}
                          </td>
                          <td className="p-3">{pct.toFixed(1)}%</td>
                          <td className="p-3">{b.implementationCostAzn?.toLocaleString()}</td>
                          <td className="p-3">{b.measurementCostAzn?.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESEARCH BENCHMARK EXPLORER */}
        {activeTab === "research" && (
          <div className="space-y-6">
            {/* Archived Empirical Research Callout */}
            <div className="card-base p-6 border-l-4 border-l-[#245C43] space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Archived Empirical Benchmark
                </span>
                <span className="text-xs text-[#68736C] font-mono">
                  152 Commercial & Higher Education Buildings (BDG2)
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#18211C]">
                Cross-Building Residual Correlation Floor (&rho; = 0.33)
              </h3>
              <p className="text-xs text-[#68736C] leading-relaxed">
                {RESEARCH_BENCHMARK_PORTFOLIO_FINDINGS.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-[#F8F9F7] rounded border border-[#DFE5E0]">
                  <div className="text-[#68736C]">Observed Correlation Floor:</div>
                  <div className="text-lg font-bold font-mono text-[#18211C] mt-0.5">
                    &rho; = {RESEARCH_BENCHMARK_PORTFOLIO_FINDINGS.empiricalCorrelationFloor}
                  </div>
                  <div className="text-[11px] text-[#68736C]">Shared weather & calendar shocks</div>
                </div>
                <div className="p-3 bg-[#F8F9F7] rounded border border-[#DFE5E0]">
                  <div className="text-[#68736C]">Median Daily MDE (K=1):</div>
                  <div className="text-lg font-bold font-mono text-[#18211C] mt-0.5">
                    {RESEARCH_BENCHMARK_PORTFOLIO_FINDINGS.singleBuildingMedianMdeDailyPct}%
                  </div>
                  <div className="text-[11px] text-[#68736C]">Single isolated building</div>
                </div>
                <div className="p-3 bg-[#F8F9F7] rounded border border-[#DFE5E0]">
                  <div className="text-[#68736C]">Pooled MDE Floor (K=20):</div>
                  <div className="text-lg font-bold font-mono text-[#245C43] mt-0.5">
                    {RESEARCH_BENCHMARK_PORTFOLIO_FINDINGS.pooledMdeK20DailyPct}%
                  </div>
                  <div className="text-[11px] text-[#68736C]">Floor prevents asymptotic decay to 0</div>
                </div>
              </div>
            </div>

            {/* Theoretical Simulator Controls */}
            <div className="card-base p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFE5E0]">
                <div>
                  <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#245C43]" />
                    Theoretical Correlation Simulator (Illustrative Model)
                  </h3>
                  <p className="text-xs text-[#68736C]">
                    Simulate how cross-building correlation inflates pooled variance relative to independent sampling.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-[#18211C] mb-1">
                    <span>Portfolio Building Count (K):</span>
                    <span className="font-mono text-[#245C43] font-bold">{simBuildingCount} Buildings</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={simBuildingCount}
                    onChange={(e) => setSimBuildingCount(parseInt(e.target.value) || 1)}
                    className="w-full accent-[#245C43]"
                  />
                  <div className="flex justify-between text-[10px] text-[#68736C] mt-1">
                    <span>K=1</span>
                    <span>K=10</span>
                    <span>K=20</span>
                    <span>K=50</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#18211C] mb-1">
                    <span>Assumed Correlation (&rho;):</span>
                    <span className="font-mono text-[#245C43] font-bold">{simCorrelation.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={simCorrelation}
                    onChange={(e) => setSimCorrelation(parseFloat(e.target.value) || 0)}
                    className="w-full accent-[#245C43]"
                  />
                  <div className="flex justify-between text-[10px] text-[#68736C] mt-1">
                    <span>&rho;=0.0 (Pure Independence)</span>
                    <span>&rho;=0.33 (BDG2 Floor)</span>
                    <span>&rho;=0.80 (High)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-[#F8F9F7] border border-[#DFE5E0] text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <span className="text-[#68736C]">Independent Factor (1/&radic;K): </span>
                    <strong className="text-[#18211C]">{simulation.theoreticalIndependentNoiseFactor}</strong>
                  </div>
                  <div>
                    <span className="text-[#68736C]">Correlated Factor: </span>
                    <strong className="text-[#245C43]">{simulation.theoreticalCorrelatedNoiseFactor}</strong>
                  </div>
                  <div>
                    <span className="text-[#68736C]">Noise Inflation Ratio: </span>
                    <strong className="text-[#B74740]">{simulation.noiseInflationRatio}x</strong>
                  </div>
                </div>
                <div className="text-[11px] text-[#68736C] mt-2 italic">
                  {simulation.illustrativeDisclaimer}
                </div>
              </div>
            </div>

            {/* Power Curve Chart */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#18211C]">
                Empirical Detection Power Curve (BDG2 Benchmark)
              </h3>
              <PowerCurveChart />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
