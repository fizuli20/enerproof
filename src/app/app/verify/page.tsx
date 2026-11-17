"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  evaluateEvidenceGate,
  HISTORICAL_RESEARCH_COHORT_BENCHMARKS,
  BuildingEvidenceAssessment,
} from "@/lib/evidence/evidence-gate";
import { Resolution, DataQualitySummary } from "@/lib/types";
import { useProject } from "@/lib/store/project-context";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Sliders,
  Ruler,
  Info,
  Calendar,
  Layers,
  Activity,
  Zap,
} from "lucide-react";
import { ExpectedVsObservedVisual } from "@/components/visuals/ExpectedVsObservedVisual";

export default function VerifyPage() {
  const { project, setEvidenceAssessment: setStoreEvidenceAssessment } = useProject();

  const [resolution, setResolution] = useState<Resolution>("daily");
  const [baselineKwh, setBaselineKwh] = useState<number>(300000);
  const [apparentSavingsKwh, setApparentSavingsKwh] = useState<number>(45000); // 15%
  const [reportingObs, setReportingObs] = useState<number>(184);
  const [measurementBoundary, setMeasurementBoundary] = useState<
    "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C" | "EQUIPMENT_ISOLATION_OPTION_A_B"
  >("WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C");
  const [dataQualityPass, setDataQualityPass] = useState<boolean>(true);

  const dummyQuality: DataQualitySummary = {
    totalRows: reportingObs,
    missingRows: dataQualityPass ? 0 : 15,
    missingPct: dataQualityPass ? 0.0 : 8.2,
    zeroCount: 0,
    zeroPct: 0.0,
    maxConsecutiveZeros: 0,
    hasNegativeValues: !dataQualityPass,
    hasDuplicateAnnualProfile: false,
    isContinuousTimestamps: true,
    flags: dataQualityPass
      ? []
      : ["Missing data (8.2%) exceeds 5% gate", "Negative readings detected"],
    passed: dataQualityPass,
  };

  const assessment: BuildingEvidenceAssessment = evaluateEvidenceGate({
    context: measurementBoundary,
    apparentSavingsKwh,
    baselineEnergyKwh: baselineKwh,
    reportingObservations: reportingObs,
    dataQuality: dummyQuality,
    baselineModel: project.baselineResult,
    resolution,
  });

  // Sync with project context
  useEffect(() => {
    setStoreEvidenceAssessment(assessment);
  }, [
    apparentSavingsKwh,
    baselineKwh,
    reportingObs,
    resolution,
    dataQualityPass,
    measurementBoundary,
    project.baselineResult,
  ]);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="Post-Intervention Evidence Gate Assessment"
        subtitle="Building-specific statistical decision gate based on empirical calibration RMSE, sample size, and autocorrelation."
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
        {/* =================================================================== */}
        {/* THREE DISTINCT CATEGORIES OF SAVINGS RESULTS                       */}
        {/* =================================================================== */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#152E27]">
            Core Results Architecture &bull; 3 Distinct Metrics
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1: Estimated Engineering Savings */}
            <div className="card-editorial p-6 bg-white space-y-2 border-t-4 border-t-[#5D6D63]">
              <div className="flex items-center justify-between text-xs text-[#5D6D63]">
                <span className="font-mono font-semibold uppercase">1. Engineering Estimate</span>
                <Zap className="w-4 h-4 text-[#5D6D63]" />
              </div>
              <div className="text-2xl font-display font-bold text-[#101C18] font-mono-num">
                {apparentSavingsKwh.toLocaleString()} <span className="text-sm font-normal">kWh/yr</span>
              </div>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Calculated reduction based on fixture count, delta wattage, and planned runtime hours.
              </p>
              <div className="text-[11px] font-semibold text-[#5D6D63] pt-1">
                Status: Engineering Potential
              </div>
            </div>

            {/* Category 2: Observed Consumption Changes */}
            <div className="card-editorial p-6 bg-white space-y-2 border-t-4 border-t-[#9B641B]">
              <div className="flex items-center justify-between text-xs text-[#9B641B]">
                <span className="font-mono font-semibold uppercase">2. Observed Meter Delta</span>
                <Activity className="w-4 h-4 text-[#9B641B]" />
              </div>
              <div className="text-2xl font-display font-bold text-[#101C18] font-mono-num">
                {((apparentSavingsKwh / baselineKwh) * 100).toFixed(1)}% <span className="text-sm font-normal">reduction</span>
              </div>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Unadjusted utility bill change. Confounded by weather shifts, holiday schedules, and occupancy.
              </p>
              <div className="text-[11px] font-semibold text-[#9B641B] pt-1">
                Notice: Unadjusted for weather
              </div>
            </div>

            {/* Category 3: Evidence-Supported Assessments */}
            <div
              className={`card-editorial p-6 bg-white space-y-2 border-t-4 ${
                assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                  ? "border-t-[#152E27]"
                  : "border-t-[#B74740]"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-semibold uppercase text-[#152E27]">
                  3. Evidence Assessment
                </span>
                <ShieldCheck className="w-4 h-4 text-[#152E27]" />
              </div>
              <div className="text-xl font-display font-bold text-[#152E27]">
                {assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                  ? "Supported"
                  : "Action Required"}
              </div>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                {assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                  ? "Cleared building-specific statistical noise threshold and FSU uncertainty ceilings."
                  : "Additional measurements required before submitting this claim for financing."}
              </p>
              <div className="text-[11px] font-semibold text-[#152E27] pt-1">
                Evidence Gate: {assessment.classification}
              </div>
            </div>
          </div>

          {/* Interactive Three-Tier Savings Visualizer */}
          <div className="pt-2">
            <ExpectedVsObservedVisual />
          </div>
        </div>

        {/* Verification Status Banner */}
        <div
          className={`card-editorial p-6 sm:p-8 border-l-4 shadow-sm bg-white ${
            assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
              ? "border-l-[#152E27]"
              : assessment.classification === "ADDITIONAL_MEASUREMENT_REQUIRED"
              ? "border-l-[#9B641B]"
              : "border-l-[#B74740]"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block ${
                  assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                    ? "bg-[#152E27] text-[#D9FF91]"
                    : assessment.classification === "ADDITIONAL_MEASUREMENT_REQUIRED"
                    ? "bg-[#FEF3C7] text-[#9B641B]"
                    : "bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                {assessment.classification}
              </span>
              <h2 className="text-2xl font-display font-bold text-[#101C18]">
                {assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE" &&
                  "Evidence Supports Statistical Estimate"}
                {assessment.classification === "ADDITIONAL_MEASUREMENT_REQUIRED" &&
                  "Additional Monitoring Duration Required"}
                {assessment.classification === "INSUFFICIENT_EVIDENCE" &&
                  "Insufficient Evidence — Estimate Refused"}
              </h2>
              <p className="text-xs text-[#5D6D63] max-w-2xl leading-relaxed">
                {assessment.decisionRationale && assessment.decisionRationale.length > 0
                  ? assessment.decisionRationale[assessment.decisionRationale.length - 1]
                  : assessment.rationale[assessment.rationale.length - 1]}
              </p>
            </div>

            <div className="flex items-center gap-6 bg-[#F4F5F0] p-4 rounded-xl border border-[#DDE3DB] shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-[#5D6D63] uppercase font-mono font-bold">Apparent Savings</span>
                <div className="text-xl font-bold font-mono text-[#101C18]">
                  {assessment.apparentSavingsPct.toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#5D6D63]">
                  Gate:{" "}
                  {assessment.buildingSpecificThresholdPct !== null
                    ? `≥ ${assessment.buildingSpecificThresholdPct.toFixed(1)}%`
                    : assessment.thresholdType || "Option A/B"}
                </span>
              </div>
              <div className="w-px h-10 bg-[#DDE3DB]"></div>
              <div className="text-center">
                <span className="text-[10px] text-[#5D6D63] uppercase font-mono font-bold">ASHRAE FSU</span>
                <div
                  className={`text-xl font-bold font-mono ${
                    assessment.fsuPct !== null && assessment.fsuPct <= 50 ? "text-[#152E27]" : "text-[#B74740]"
                  }`}
                >
                  {assessment.fsuPct !== null ? `${assessment.fsuPct.toFixed(1)}%` : "N/A"}
                </div>
                <span className="text-[10px] text-[#5D6D63]">Target: ≤ 50.0%</span>
              </div>
              <div className="w-px h-10 bg-[#DDE3DB]"></div>
              <div className="text-center">
                <span className="text-[10px] text-[#5D6D63] uppercase font-mono font-bold">Gate Type</span>
                <div className="text-xs font-bold font-mono text-[#152E27] mt-1">
                  {assessment.thresholdType || "BUILDING_SPECIFIC"}
                </div>
                <span className="text-[10px] text-[#5D6D63]">Building-specific</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Parameter Controls */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DB]">
            <div>
              <h3 className="text-sm font-bold text-[#101C18] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#152E27]" />
                Building Evidence Gate Parameters
              </h3>
              <p className="text-xs text-[#5D6D63]">
                Configure building-specific measurement noise, calibration observations, and reporting window.
              </p>
            </div>
            {project.baselineResult && (
              <span className="lime-pill text-xs">
                Loaded from Trained Baseline
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Measurement Boundary:
              </label>
              <select
                value={measurementBoundary}
                onChange={(e) => setMeasurementBoundary(e.target.value as typeof measurementBoundary)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-semibold"
              >
                <option value="WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C">Whole Facility (Option C)</option>
                <option value="EQUIPMENT_ISOLATION_OPTION_A_B">Isolated Equipment (Option A/B)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Data Resolution:
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-semibold"
              >
                <option value="hourly">Hourly Interval</option>
                <option value="daily">Daily Interval</option>
                <option value="monthly">Monthly Utility</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Apparent Savings (kWh):
              </label>
              <input
                type="number"
                step="5000"
                value={apparentSavingsKwh}
                onChange={(e) => setApparentSavingsKwh(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#101C18] mb-1">
                Reporting Window (days):
              </label>
              <input
                type="number"
                step="10"
                value={reportingObs}
                onChange={(e) => setReportingObs(parseInt(e.target.value) || 1)}
                className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Historical Research Benchmark Comparison (Exploratory Only) */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDE3DB] gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#152E27]" />
              Historical Research Benchmark Reference (BDG2 Cohort)
            </span>
            <span className="text-[11px] text-[#9B641B] font-semibold bg-[#FEF3C7] px-2.5 py-0.5 rounded">
              Exploratory Reference Only &bull; Not Applied as Operational Threshold
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <div className="font-semibold text-[#101C18]">Hourly Resolution Benchmark</div>
              <div className="font-mono text-[#101C18] font-bold text-base mt-1">8.37% Empirical MDE</div>
              <div className="text-[11px] text-[#5D6D63] mt-0.5">BDG2 152-building median noise floor</div>
            </div>
            <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <div className="font-semibold text-[#101C18]">Daily Resolution Benchmark</div>
              <div className="font-mono text-[#101C18] font-bold text-base mt-1">11.80% Empirical MDE</div>
              <div className="text-[11px] text-[#5D6D63] mt-0.5">BDG2 daily calendar weather model</div>
            </div>
            <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <div className="font-semibold text-[#101C18]">Monthly Resolution Benchmark</div>
              <div className="font-mono text-[#101C18] font-bold text-base mt-1">13.64% Empirical MDE</div>
              <div className="text-[11px] text-[#5D6D63] mt-0.5">Low degrees of freedom penalty</div>
            </div>
          </div>

          <p className="text-[11px] text-[#5D6D63] leading-relaxed">
            <strong>Scientific Guardrail:</strong> Universal benchmark thresholds derived from historical cross-building cohorts are retained for comparative research evaluation. EnerProof exclusively computes building-specific decision thresholds based on the target facility&apos;s own baseline CV(RMSE), sample sizes, and residual autocorrelation.
          </p>
        </div>

        {/* Detailed Decision Rationale Log */}
        <div className="card-editorial p-6 sm:p-7 bg-white space-y-4">
          <h3 className="text-sm font-bold text-[#101C18] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#152E27]" />
            Evidence Gate Evaluation Log & Decision Path
          </h3>

          <div className="space-y-2 text-xs">
            {(assessment.decisionRationale || assessment.rationale).map((step: string, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-[#152E27] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[#101C18] leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Regulatory Disclaimer */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DB] text-xs text-[#5D6D63] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#152E27] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#101C18]">Statutory Notice &amp; Scientific Boundary:</strong> {assessment.disclaimer}
          </div>
        </div>
      </main>
    </div>
  );
}
