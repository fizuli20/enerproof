"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  evaluateEvidenceGate,
  CALIBRATED_BENCHMARK_THRESHOLDS,
} from "@/lib/evidence/evidence-gate";
import { Resolution, DataQualitySummary } from "@/lib/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Sliders,
  Ruler,
  Info,
} from "lucide-react";

export default function VerifyPage() {
  const [resolution, setResolution] = useState<Resolution>("daily");
  const [baselineKwh, setBaselineKwh] = useState<number>(300000);
  const [apparentSavingsKwh, setApparentSavingsKwh] = useState<number>(45000); // 15%
  const [cvRmsePct, setCvRmsePct] = useState<number>(9.8);
  const [baselineObs, setBaselineObs] = useState<number>(181);
  const [reportingObs, setReportingObs] = useState<number>(184);
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

  const assessment = evaluateEvidenceGate({
    apparentSavingsKwh,
    baselineKwh,
    cvRmsePct,
    baselineObservations: baselineObs,
    reportingObservations: reportingObs,
    resolution,
    dataQuality: dummyQuality,
  });

  const benchmark = CALIBRATED_BENCHMARK_THRESHOLDS[resolution];

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="5. Post-Intervention Evidence Gate Assessment"
        subtitle="Deterministic decision support evaluating apparent savings against empirical noise thresholds and ASHRAE FSU limits."
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
                  "Monitoring Duration Extension Required"}
                {assessment.classification === "INSUFFICIENT_EVIDENCE" &&
                  "Insufficient Evidence — Estimate Refused"}
              </h2>
              <p className="text-xs text-[#68736C] max-w-2xl leading-relaxed">
                {assessment.decisionRationale[assessment.decisionRationale.length - 1]}
              </p>
            </div>

            <div className="flex items-center gap-6 bg-white p-4 rounded-lg border border-[#DFE5E0] shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-[#68736C] uppercase font-bold">Apparent Savings</span>
                <div className="text-xl font-bold font-mono text-[#18211C]">
                  {assessment.apparentSavingsPct.toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#68736C]">
                  Gate: &ge; {assessment.calibratedThresholdPct.toFixed(1)}%
                </span>
              </div>
              <div className="w-px h-10 bg-[#DFE5E0]"></div>
              <div className="text-center">
                <span className="text-[10px] text-[#68736C] uppercase font-bold">ASHRAE FSU</span>
                <div
                  className={`text-xl font-bold font-mono ${
                    assessment.fsuPct <= 50 ? "text-[#245C43]" : "text-[#B74740]"
                  }`}
                >
                  {assessment.fsuPct.toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#68736C]">Limit: &le; 50.0%</span>
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
                Evidence Gate Sensitivity Controls
              </h3>
              <p className="text-xs text-[#68736C]">
                Simulate different apparent savings, data quality scenarios, and monitoring horizons.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Data Resolution:
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] text-xs font-semibold"
              >
                <option value="hourly">Hourly (Gate: 8.4%)</option>
                <option value="daily">Daily (Gate: 11.8%)</option>
                <option value="monthly">Monthly (Gate: 13.6%)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Baseline (kWh):
              </label>
              <input
                type="number"
                step="10000"
                value={baselineKwh}
                onChange={(e) => setBaselineKwh(parseInt(e.target.value) || 1)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Savings (kWh):
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
                CV(RMSE) (%):
              </label>
              <input
                type="number"
                step="0.5"
                value={cvRmsePct}
                onChange={(e) => setCvRmsePct(parseFloat(e.target.value) || 1)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Post-Period (m):
              </label>
              <input
                type="number"
                step="10"
                value={reportingObs}
                onChange={(e) => setReportingObs(parseInt(e.target.value) || 1)}
                className="w-full p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-xs"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs font-semibold text-[#18211C]">
                <input
                  type="checkbox"
                  checked={dataQualityPass}
                  onChange={(e) => setDataQualityPass(e.target.checked)}
                  className="w-4 h-4 accent-[#245C43]"
                />
                Data Quality Pass
              </label>
            </div>
          </div>
        </div>

        {/* Detailed Decision Rationale Log */}
        <div className="card-base p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#245C43]" />
            Evidence Gate Evaluation Log & Decision Path
          </h3>

          <div className="space-y-2 text-xs">
            {assessment.decisionRationale.map((step, idx) => (
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
