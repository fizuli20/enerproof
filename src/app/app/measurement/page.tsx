"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { generateMeasurementPlan } from "@/lib/measurement/planner";
import { useProject } from "@/lib/store/project-context";
import {
  Ruler,
  ShieldCheck,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { SmartMeterDiagram } from "@/components/visuals/SmartMeterDiagram";

export default function MeasurementPage() {
  const { project, setMeasurementPlan: setStoreMeasurementPlan } = useProject();

  const [category, setCategory] = useState<
    "lighting" | "hvac" | "plug_load" | "thermal_water" | "boiler" | "multi_measure"
  >("lighting");
  const [expectedSavingsPct, setExpectedSavingsPct] = useState<number>(15.0);
  const [baselineCvRmsePct, setBaselineCvRmsePct] = useState<number>(
    project.baselineResult?.cvRmsePct || 10.0
  );
  const [hasSubmetering, setHasSubmetering] = useState<boolean>(false);

  // Sync with project state if available
  useEffect(() => {
    if (project.baselineResult?.cvRmsePct) {
      setBaselineCvRmsePct(project.baselineResult.cvRmsePct);
    }
  }, [project.baselineResult]);

  const plan = generateMeasurementPlan({
    category,
    expectedSavingsPct,
    baselineCvRmsePct,
    resolution: "daily",
    hasSubmetering,
  });

  // Save generated plan to store
  useEffect(() => {
    setStoreMeasurementPlan(plan);
  }, [category, expectedSavingsPct, baselineCvRmsePct, hasSubmetering]);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="Measurement & Verification Strategy (IPMVP Guidance)"
        subtitle="Translate retrofit goals into an actionable measurement plan before spending capital."
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
        {/* Interactive Configuration Box */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDE3DB] gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#101C18] flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#152E27]" />
                Target Improvement &amp; Metering Context
              </h3>
              <p className="text-xs text-[#5D6D63]">
                Select your improvement type and meter setup to determine the most cost-effective measurement strategy.
              </p>
            </div>
            {project.baselineResult && (
              <span className="lime-pill text-xs">
                Active Baseline CV: {(project.baselineResult.cvRmsePct ?? project.baselineResult.trainingDiagnostics.cvRmsePct).toFixed(1)}%
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Improvement Type:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-medium"
              >
                <option value="lighting">LED Lighting Retrofit</option>
                <option value="hvac">HVAC Scheduling &amp; Setbacks</option>
                <option value="plug_load">Standby Plug Load Cutoffs</option>
                <option value="thermal_water">Solar Thermal Hot Water</option>
                <option value="boiler">Boiler Combustion Optimization</option>
                <option value="multi_measure">Deep Multi-Measure Retrofit</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Anticipated Savings (%):
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="50"
                value={expectedSavingsPct}
                onChange={(e) => setExpectedSavingsPct(parseFloat(e.target.value) || 10)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Baseline Noise / CV(RMSE) (%):
              </label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="40"
                value={baselineCvRmsePct}
                onChange={(e) => setBaselineCvRmsePct(parseFloat(e.target.value) || 10)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] font-mono text-xs"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs text-[#101C18] font-semibold">
                <input
                  type="checkbox"
                  checked={hasSubmetering}
                  onChange={(e) => setHasSubmetering(e.target.checked)}
                  className="w-4 h-4 accent-[#152E27]"
                />
                Dedicated Sub-Meter Installed?
              </label>
            </div>
          </div>
        </div>

        {/* Actionable Strategy Card: What to measure, how frequently, for how long */}
        <div className="card-editorial p-6 sm:p-8 space-y-6 border-l-4 border-l-[#152E27] bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE3DB]">
            <div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-[#152E27] text-[#D9FF91]">
                {plan.recommendedOption}
              </span>
              <h2 className="text-xl font-bold text-[#101C18] mt-2">
                {plan.optionTitle}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#5D6D63]">Target Sampling Uncertainty</span>
              <div className="text-lg font-bold text-[#152E27] font-mono">
                FSU &le; {plan.expectedFsuPct.toFixed(1)}%
              </div>
              <span className="text-[10px] text-[#5D6D63]">ASHRAE Guideline 14 tolerance &le; 50.0%</span>
            </div>
          </div>

          {/* Actionable Plan 4-Grid Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. What to measure & Boundary */}
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1.5">
              <div className="font-bold text-[#101C18] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#152E27]" />
                1. What to Measure &amp; Boundary Definition
              </div>
              <p className="text-[#5D6D63] leading-relaxed">
                {plan.meteringBoundary}
              </p>
            </div>

            {/* 2. Frequency & Duration */}
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1.5">
              <div className="font-bold text-[#101C18] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#152E27]" />
                2. Logging Frequency &amp; Duration
              </div>
              <p className="text-[#5D6D63] leading-relaxed">
                Log at <strong>{plan.loggingIntervalMinutes}-minute intervals</strong> for a minimum of <strong>{plan.minimumRecommendedDurationDays} days</strong> to establish verified operational hours.
              </p>
            </div>

            {/* 3. Recommended Metering Hardware */}
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1.5">
              <div className="font-bold text-[#101C18] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#152E27]" />
                3. Recommended Hardware
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#5D6D63]">
                {plan.recommendedHardware.map((hw, idx) => (
                  <li key={idx}>{hw}</li>
                ))}
              </ul>
            </div>

            {/* 4. Why it matters & Decision Rationale */}
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1.5">
              <div className="font-bold text-[#101C18] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#152E27]" />
                4. Why this Strategy was Chosen
              </div>
              <p className="text-[#5D6D63] leading-relaxed text-[11px]">
                {plan.rationale}
              </p>
            </div>
          </div>

          {/* Hardware & Data Logging Schematic */}
          <div className="pt-2 border-t border-[#DDE3DB] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-[#152E27] tracking-wider">
                  Telemetry &amp; Ingestion Architecture
                </span>
                <h4 className="text-sm font-bold text-[#101C18]">
                  Sub-Meter Data Pipeline &amp; Split-Core CT Installation
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F5F0] text-[#5D6D63]">
                Zero-Cloud Client Storage
              </span>
            </div>
            <SmartMeterDiagram />
          </div>

          {/* Risk Mitigation / Quality Assurance */}
          <div className="pt-2 space-y-2 text-xs">
            <h4 className="font-bold text-[#101C18]">Quality Assurance &amp; Risk Controls:</h4>
            <div className="space-y-2">
              {plan.riskMitigation.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#D9FF91]/10 text-[#152E27] border border-[#D9FF91]/40 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#152E27] shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Step CTA */}
          <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
            <span className="text-xs text-[#5D6D63]">
              Next: Test your post-retrofit data against this measurement boundary in the Evidence Gate.
            </span>
            <Link
              href="/app/verify"
              className="btn-lime text-xs py-2 px-4 rounded-lg font-semibold inline-flex items-center gap-1.5"
            >
              <span>Go to Evidence Gate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
