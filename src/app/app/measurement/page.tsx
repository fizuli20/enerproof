"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { generateMeasurementPlan } from "@/lib/measurement/planner";
import { Ruler, ShieldCheck, Cpu, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function MeasurementPage() {
  const [category, setCategory] = useState<
    "lighting" | "hvac" | "plug_load" | "thermal_water" | "boiler" | "multi_measure"
  >("lighting");
  const [expectedSavingsPct, setExpectedSavingsPct] = useState<number>(15.0);
  const [baselineCvRmsePct, setBaselineCvRmsePct] = useState<number>(10.0);
  const [hasSubmetering, setHasSubmetering] = useState<boolean>(false);

  const plan = generateMeasurementPlan({
    category,
    expectedSavingsPct,
    baselineCvRmsePct,
    resolution: "daily",
    hasSubmetering,
  });

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="4. Measurement & Verification Plan (IPMVP Alignment)"
        subtitle="Deterministic mapping of retrofit measures to IPMVP Option A, Option B, or Option C protocols."
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Interactive Configuration Box */}
        <div className="card-base p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFE5E0]">
            <div>
              <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#245C43]" />
                Retrofit Project Parameters
              </h3>
              <p className="text-xs text-[#68736C]">
                Configure measure characteristics to generate an IPMVP-compliant measurement plan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Measure Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] text-xs font-medium"
              >
                <option value="lighting">LED Lighting Retrofit</option>
                <option value="hvac">HVAC Scheduling & Setbacks</option>
                <option value="plug_load">Plug Load Cutoffs</option>
                <option value="thermal_water">Solar Thermal Hot Water</option>
                <option value="boiler">Boiler Combustion Optimization</option>
                <option value="multi_measure">Deep Multi-Measure Retrofit</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Anticipated Savings (%):
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="50"
                value={expectedSavingsPct}
                onChange={(e) => setExpectedSavingsPct(parseFloat(e.target.value) || 10)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Baseline CV(RMSE) (%):
              </label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="40"
                value={baselineCvRmsePct}
                onChange={(e) => setBaselineCvRmsePct(parseFloat(e.target.value) || 10)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs text-[#18211C] font-semibold">
                <input
                  type="checkbox"
                  checked={hasSubmetering}
                  onChange={(e) => setHasSubmetering(e.target.checked)}
                  className="w-4 h-4 accent-[#245C43]"
                />
                Dedicated Sub-Meter Installed?
              </label>
            </div>
          </div>
        </div>

        {/* Recommended IPMVP Protocol Specification */}
        <div className="card-base p-6 sm:p-8 space-y-6 border-l-4 border-l-[#245C43]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DFE5E0]">
            <div>
              <span className="badge-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {plan.recommendedOption}
              </span>
              <h2 className="text-xl font-bold text-[#18211C] mt-2">
                {plan.optionTitle}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#68736C]">Expected Uncertainty</span>
              <div className="text-lg font-bold text-[#245C43] font-mono">
                FSU &le; {plan.expectedFsuPct.toFixed(1)}%
              </div>
              <span className="text-[10px] text-[#68736C]">ASHRAE limit &le; 50.0%</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-[#18211C] mb-1">Methodology & Decision Rationale:</h4>
              <p className="text-[#68736C] leading-relaxed bg-[#F8F9F7] p-3 rounded border border-[#DFE5E0]">
                {plan.rationale}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#18211C] mb-1">Measurement Boundary Definition:</h4>
              <p className="text-[#18211C] font-mono bg-white p-2.5 rounded border border-[#DFE5E0]">
                {plan.meteringBoundary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="card-base p-4 bg-[#FFFFFF]">
                <div className="font-bold text-[#18211C] flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#245C43]" />
                  Sampling & Monitoring Duration
                </div>
                <ul className="space-y-1.5 text-[#68736C]">
                  <li className="flex justify-between">
                    <span>Logging Interval:</span>
                    <strong className="text-[#18211C] font-mono">{plan.loggingIntervalMinutes} minutes</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Minimum Reporting Duration:</span>
                    <strong className="text-[#18211C] font-mono">{plan.minimumRecommendedDurationDays} days</strong>
                  </li>
                </ul>
              </div>

              <div className="card-base p-4 bg-[#FFFFFF]">
                <div className="font-bold text-[#18211C] flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-[#245C43]" />
                  Recommended Metering Hardware
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#68736C]">
                  {plan.recommendedHardware.map((hw, idx) => (
                    <li key={idx}>{hw}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-[#18211C] mb-2">Quality Assurance & Risk Controls:</h4>
              <div className="space-y-2">
                {plan.riskMitigation.map((risk, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#E7F1EA]/50 text-[#153C2D] border border-[#B8DAC4] flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#245C43] shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
