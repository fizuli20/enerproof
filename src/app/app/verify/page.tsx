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
} from "lucide-react";

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

  const cohortRef = HISTORICAL_RESEARCH_COHORT_BENCHMARKS[resolution];

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="5. Post-Intervention Evidence Gate Assessment"
        subtitle="Building-specific statistical decision gate based on empirical calibration RMSE, sample size, and autocorrelation."
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Verification Status Banner */}
        <div
          className={`card-base p-6 sm:p-8 border-l-4 shadow-sm ${
            assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
              ? "border-l-[#245C43] bg-gradient-to-r from-[#FFFFFF] to-[#E7F1EA]/20"
              : assessment.classification === "ADDITIONAL_MEASUREMENT_REQUIRED"
              ? "border-l-[#A66A16] bg-gradient-to-r from-[#FFFFFF] to-[#FEF3C7]/20"
              : "border-l-[#B74740] bg-gradient-to-r from-[#FFFFFF] to-[#FEE2E2]/20"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block ${
                  assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                    ? "badge-green"
                    : assessment.classification === "ADDITIONAL_MEASUREMENT_REQUIRED"
                    ? "badge-amber"
                    : "badge-red"
                }`}
              >
                {assessment.classification}
              </span>
              <h2 className="text-2xl font-bold text-[#18211C]">
                {assessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE" &&
                  "Evidence Supports Statistical Estimate"}
                {assessment.classification === "ADDITIONAL_MEASUREMENT_REQUIRED" &&
                  "Additional Monitoring Duration Required"}
                {assessment.classification === "INSUFFICIENT_EVIDENCE" &&
                  "Insufficient Evidence — Estimate Refused"}
              </h2>
              <p className="text-xs text-[#68736C] max-w-2xl leading-relaxed">
                {assessment.decisionRationale && assessment.decisionRationale.length > 0
                  ? assessment.decisionRationale[assessment.decisionRationale.length - 1]
                  : assessment.rationale[assessment.rationale.length - 1]}
              </p>
            </div>

            <div className="flex items-center gap-6 bg-white p-4 rounded-lg border border-[#DFE5E0] shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-[#68736C] uppercase font-bold">Apparent Savings</span>
                <div className="text-xl font-bold font-mono text-[#18211C]">
                  {assessment.apparentSavingsPct.toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#68736C]">
                  Gate:{" "}
                  {assessment.buildingSpecificThresholdPct !== null
                    ? `≥ ${assessment.buildingSpecificThresholdPct.toFixed(1)}%`
                    : assessment.thresholdType || "Option A/B"}
                </span>
              </div>
              <div className="w-px h-10 bg-[#DFE5E0]"></div>
              <div className="text-center">
                <span className="text-[10px] text-[#68736C] uppercase font-bold">ASHRAE FSU</span>
                <div
                  className={`text-xl font-bold font-mono ${
                    assessment.fsuPct !== null && assessment.fsuPct <= 50 ? "text-[#245C43]" : "text-[#B74740]"
                  }`}
                >
                  {assessment.fsuPct !== null ? `${assessment.fsuPct.toFixed(1)}%` : "N/A"}
                </div>
                <span className="text-[10px] text-[#68736C]">Target: ≤ 50.0%</span>
              </div>
              <div className="w-px h-10 bg-[#DFE5E0]"></div>
              <div className="text-center">
                <span className="text-[10px] text-[#68736C] uppercase font-bold">Gate Type</span>
                <div className="text-xs font-bold font-mono text-[#245C43] mt-1">
                  {assessment.thresholdType || "BUILDING_SPECIFIC"}
                </div>
                <span className="text-[10px] text-[#68736C]">Building-specific</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Parameter Controls */}
        <div className="card-base p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFE5E0]">
            <div>
              <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#245C43]" />
                Building Evidence Gate Parameters
              </h3>
              <p className="text-xs text-[#68736C]">
                Configure building-specific measurement noise, calibration observations, and reporting window.
              </p>
            </div>
            {project.baselineResult && (
              <span className="badge-green text-xs font-semibold px-2.5 py-1 rounded">
                Loaded from Trained Baseline
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Measurement Boundary:
              </label>
              <select
                value={measurementBoundary}
                onChange={(e) => setMeasurementBoundary(e.target.value as typeof measurementBoundary)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] text-xs font-semibold"
              >
                <option value="WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C">Whole Facility (Option C)</option>
                <option value="EQUIPMENT_ISOLATION_OPTION_A_B">Isolated Equipment (Option A/B)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Data Resolution:
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] text-xs font-semibold"
              >
                <option value="hourly">Hourly Interval</option>
                <option value="daily">Daily Interval</option>
                <option value="monthly">Monthly Utility</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Apparent Savings (kWh):
              </label>
              <input
                type="number"
                step="5000"
                value={apparentSavingsKwh}
                onChange={(e) => setApparentSavingsKwh(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Reporting Window (days):
              </label>
              <input
                type="number"
                step="10"
                value={reportingObs}
                onChange={(e) => setReportingObs(parseInt(e.target.value) || 1)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Historical Research Benchmark Comparison (Exploratory Only) */}
        <div className="card-base p-5 bg-[#F8F9F7] border border-[#DFE5E0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68736C] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#245C43]" />
              Historical Research Benchmark Reference (BDG2 Cohort)
            </span>
            <span className="text-[11px] text-[#A66A16] font-semibold">
              Exploratory Reference Only • Not Applied as Operational Threshold
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded border border-[#DFE5E0]">
              <div className="font-semibold text-[#18211C]">Hourly Resolution Benchmark</div>
              <div className="font-mono text-[#18211C] font-bold mt-1">8.37% Empirical MDE</div>
              <div className="text-[11px] text-[#68736C] mt-0.5">BDG2 152-building median noise floor</div>
            </div>
            <div className="p-3 bg-white rounded border border-[#DFE5E0]">
              <div className="font-semibold text-[#18211C]">Daily Resolution Benchmark</div>
              <div className="font-mono text-[#18211C] font-bold mt-1">11.80% Empirical MDE</div>
              <div className="text-[11px] text-[#68736C] mt-0.5">BDG2 daily calendar weather model</div>
            </div>
            <div className="p-3 bg-white rounded border border-[#DFE5E0]">
              <div className="font-semibold text-[#18211C]">Monthly Resolution Benchmark</div>
              <div className="font-mono text-[#18211C] font-bold mt-1">13.64% Empirical MDE</div>
              <div className="text-[11px] text-[#68736C] mt-0.5">Low degrees of freedom penalty</div>
            </div>
          </div>
          <p className="text-[11px] text-[#68736C] leading-relaxed">
            <strong>Scientific Guardrail:</strong> Universal benchmark thresholds derived from historical cross-building cohorts are retained for comparative research evaluation. EnerProof exclusively computes building-specific decision thresholds based on the target facility&apos;s own baseline CV(RMSE), sample sizes, and residual autocorrelation.
          </p>
        </div>

        {/* Detailed Decision Rationale Log */}
        <div className="card-base p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#245C43]" />
            Evidence Gate Evaluation Log & Decision Path
          </h3>

          <div className="space-y-2 text-xs">
            {(assessment.decisionRationale || assessment.rationale).map((step: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-[#E7F1EA] text-[#153C2D] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[#18211C] leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Regulatory Disclaimer */}
        <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#DFE5E0] text-xs text-[#68736C] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#245C43] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#18211C]">Statutory Notice & Scientific Boundary:</strong> {assessment.disclaimer}
          </div>
        </div>
      </main>
    </div>
  );
}
