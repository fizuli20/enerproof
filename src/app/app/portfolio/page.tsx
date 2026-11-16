"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PowerCurveChart } from "@/components/PowerCurveChart";
import {
  aggregatePortfolio,
  EMPIRICAL_CROSS_BUILDING_CORRELATION,
  BuildingPortfolioItem,
} from "@/lib/portfolio/aggregator";
import { Building2, Layers, AlertCircle, ShieldCheck } from "lucide-react";

export default function PortfolioPage() {
  const [buildingCount, setBuildingCount] = useState<number>(20);
  const [perBuildingBaseline, setPerBuildingBaseline] = useState<number>(500000);
  const [targetSavingsPct, setTargetSavingsPct] = useState<number>(10.0);

  // Generate synthetic portfolio items
  const buildings: BuildingPortfolioItem[] = Array.from(
    { length: buildingCount },
    (_, i) => ({
      id: `bld-${i + 1}`,
      name: `Campus Facility ${i + 1}`,
      baselineKwh: perBuildingBaseline,
      apparentSavingsKwh: (perBuildingBaseline * targetSavingsPct) / 100,
    })
  );

  const portfolio = aggregatePortfolio(buildings);

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="6. Multi-Building Portfolio Aggregation (ESCO Contracts)"
        subtitle="Cross-building noise pooling, correlation floors (ρ = 0.33), and portfolio statistical power."
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Top Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Pooled Buildings</div>
            <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
              K = {portfolio.buildingCount}
            </div>
            <div className="text-[11px] text-[#245C43] mt-1">Multi-building contract</div>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Pooled Baseline</div>
            <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
              {(portfolio.totalBaselineKwh / 1000).toLocaleString()} MWh
            </div>
            <div className="text-[11px] text-[#68736C] mt-1">Annual portfolio scale</div>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Empirical Portfolio MDE</div>
            <div className="text-2xl font-bold text-[#245C43] mt-1 font-mono">
              {portfolio.empiricalPortfolioMdePct.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#68736C] mt-1">
              At ρ = {portfolio.crossBuildingCorrelation} correlation
            </div>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Detection Power (at 10%)</div>
            <div
              className={`text-2xl font-bold font-mono mt-1 ${
                portfolio.pooledDetectionPowerPct >= 80 ? "text-[#245C43]" : "text-[#B74740]"
              }`}
            >
              {portfolio.pooledDetectionPowerPct.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#68736C] mt-1">
              {portfolio.pooledDetectionPowerPct >= 80 ? "≥ 80% Target Met" : "< 80% Target"}
            </div>
          </div>
        </div>

        {/* Portfolio Parameter Controls */}
        <div className="card-base p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFE5E0]">
            <div>
              <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#245C43]" />
                ESCO Portfolio Size & Baseline Settings
              </h3>
              <p className="text-xs text-[#68736C]">
                Simulate how grouping K buildings into a single performance contract reduces variance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-[#18211C] mb-1">
                <span>Building Count (K):</span>
                <span className="font-mono text-[#245C43] font-bold">{buildingCount} Buildings</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={buildingCount}
                onChange={(e) => setBuildingCount(parseInt(e.target.value) || 1)}
                className="w-full accent-[#245C43]"
              />
              <div className="flex justify-between text-[10px] text-[#68736C] mt-1">
                <span>Single (K=1)</span>
                <span>K=10</span>
                <span>K=20 (82% Power)</span>
                <span>Large (K=50)</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Average Baseline per Building (kWh):
              </label>
              <input
                type="number"
                step="50000"
                value={perBuildingBaseline}
                onChange={(e) => setPerBuildingBaseline(parseInt(e.target.value) || 100000)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Target Simulated Savings (%):
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="30"
                value={targetSavingsPct}
                onChange={(e) => setTargetSavingsPct(parseFloat(e.target.value) || 5)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Empirical vs Theoretical Noise Floor Analysis */}
        <div className="card-base p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#18211C]">
            Theoretical Independence vs Empirical Correlation Noise Floor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="font-semibold text-[#18211C]">
                Naive Independent Assumption: 1/&radic;K
              </div>
              <div className="text-xl font-bold font-mono text-[#68736C]">
                Theoretical MDE: {portfolio.theoreticalPortfolioMdePct.toFixed(1)}%
              </div>
              <p className="text-[#68736C] leading-relaxed">
                Assumes building residual errors are purely independent white noise. Predicts that pooling 20 buildings reduces uncertainty to 3.4% and 50 buildings to 2.1%.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#E7F1EA]/40 border border-[#B8DAC4] space-y-2">
              <div className="font-semibold text-[#153C2D]">
                Empirical Research Finding: Intra-Site Correlation (ρ = 0.33)
              </div>
              <div className="text-xl font-bold font-mono text-[#245C43]">
                Empirical MDE: {portfolio.empiricalPortfolioMdePct.toFixed(1)}%
              </div>
              <p className="text-[#18211C] leading-relaxed">
                Accounts for shared weather anomalies and operational cycles across campus buildings. Noise reduction asymptotes to &sigma;&radic;&rho;, preventing artificially low naive claims.
              </p>
            </div>
          </div>
        </div>

        {/* Power Curve Chart */}
        <PowerCurveChart mode="portfolio" />
      </main>
    </div>
  );
}
