"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  generateEnerProofReport,
  ReportType,
} from "@/lib/reports/pdf-generator";
import { BaseEcmResult } from "@/lib/interventions/calculators";
import { useProject } from "@/lib/store/project-context";
import {
  FileText,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function ReportsPage() {
  const { project, setMetadata, exportProjectJson } = useProject();

  const [reportType, setReportType] = useState<ReportType>("comprehensive");
  const [currentDate, setCurrentDate] = useState("November 17, 2026");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  const handleDownloadPdf = () => {
    const doc = generateEnerProofReport(project, reportType);
    doc.save(`EnerProof_${reportType}_${project.metadata.name.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadJson = () => {
    exportProjectJson();
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Measure Name",
      "Category",
      "CapEx AZN",
      "M&V AZN",
      "Total Investment AZN",
      "Annual kWh Savings",
      "Annual Net Savings AZN",
      "Simple Payback Years",
      "Avoided CO2 Tonnes",
      "Notes",
    ];
    const rows = project.interventions.map((ecm: BaseEcmResult) => [
      `"${ecm.name}"`,
      ecm.category,
      ecm.implementationCostAzn,
      ecm.measurementCostAzn,
      ecm.totalInitialInvestmentAzn,
      ecm.annualKwhSavings,
      ecm.annualNetSavingsAzn,
      ecm.simplePaybackYears !== null ? ecm.simplePaybackYears : "No positive payback",
      ecm.avoidedCo2TonnesYear !== null ? ecm.avoidedCo2TonnesYear : "Unvalidated",
      `"${ecm.notes}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r: (string | number)[]) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EnerProof_ECMs_${project.metadata.name.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  const totalCapEx = project.interventions.reduce((a: number, b: BaseEcmResult) => a + b.implementationCostAzn, 0);
  const totalInvestment = project.interventions.reduce((a: number, b: BaseEcmResult) => a + b.totalInitialInvestmentAzn, 0);
  const totalNetSavingsAzn = project.interventions.reduce((a: number, b: BaseEcmResult) => a + b.annualNetSavingsAzn, 0);
  const combinedPayback =
    totalNetSavingsAzn > 0
      ? (totalInvestment / totalNetSavingsAzn).toFixed(1) + " yrs"
      : "No positive payback";
  const totalCo2 = project.interventions.reduce(
    (a: number, b: BaseEcmResult) => a + (b.avoidedCo2TonnesYear || 0),
    0
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="Investment-Grade Report & Data Export"
        subtitle="Export reproducible verification reports, open JSON project state, and ECM feasibility data."
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full space-y-6 mx-auto">
        {/* Stale Warning Banner if upstream modified */}
        {project.staleFlags.reportsStale && (
          <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>
                <strong>Notice:</strong> Upstream parameters were updated. This report dynamically synchronizes with current project state.
              </span>
            </div>
          </div>
        )}

        {/* Report Template Selector & Action Bar */}
        <div className="card-editorial p-6 bg-white space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE3DB]">
            <div>
              <h3 className="text-sm font-bold font-display text-[#101C18] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#152E27]" />
                Select Report Scope & Document Format
              </h3>
              <p className="text-xs text-[#5D6D63] mt-0.5">
                Generate tailored documentation for auditors, ESCOs, or the Energy Efficiency Fund.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#152E27] hover:bg-[#101C18] text-[#D9FF91] text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF ({reportType})
              </button>
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDE3DB] bg-white hover:bg-black/5 text-xs font-medium text-[#101C18]"
              >
                <FileCode className="w-3.5 h-3.5 text-[#5D6D63]" />
                Full Project JSON
              </button>
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDE3DB] bg-white hover:bg-black/5 text-xs font-medium text-[#101C18]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#5D6D63]" />
                ECMs CSV
              </button>
            </div>
          </div>

          {/* 5 Distinct Report Types */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
            <button
              onClick={() => setReportType("comprehensive")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "comprehensive"
                  ? "border-[#152E27] bg-[#152E27] text-white shadow-sm"
                  : "border-[#DDE3DB] bg-[#F4F5F0] text-[#5D6D63] hover:bg-white"
              }`}
            >
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${reportType === "comprehensive" ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
                Type 1
              </div>
              <div className={`mt-0.5 font-semibold ${reportType === "comprehensive" ? "text-white" : "text-[#101C18]"}`}>
                Comprehensive Audit
              </div>
              <div className={`text-[10px] mt-1 ${reportType === "comprehensive" ? "text-white/80" : "text-[#5D6D63]"}`}>
                Complete dossier
              </div>
            </button>

            <button
              onClick={() => setReportType("data_quality_audit")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "data_quality_audit"
                  ? "border-[#152E27] bg-[#152E27] text-white shadow-sm"
                  : "border-[#DDE3DB] bg-[#F4F5F0] text-[#5D6D63] hover:bg-white"
              }`}
            >
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${reportType === "data_quality_audit" ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
                Type 2
              </div>
              <div className={`mt-0.5 font-semibold ${reportType === "data_quality_audit" ? "text-white" : "text-[#101C18]"}`}>
                Data Quality Screening
              </div>
              <div className={`text-[10px] mt-1 ${reportType === "data_quality_audit" ? "text-white/80" : "text-[#5D6D63]"}`}>
                Pre-intervention gate audit
              </div>
            </button>

            <button
              onClick={() => setReportType("intervention_feasibility")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "intervention_feasibility"
                  ? "border-[#152E27] bg-[#152E27] text-white shadow-sm"
                  : "border-[#DDE3DB] bg-[#F4F5F0] text-[#5D6D63] hover:bg-white"
              }`}
            >
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${reportType === "intervention_feasibility" ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
                Type 3
              </div>
              <div className={`mt-0.5 font-semibold ${reportType === "intervention_feasibility" ? "text-white" : "text-[#101C18]"}`}>
                ECM Feasibility
              </div>
              <div className={`text-[10px] mt-1 ${reportType === "intervention_feasibility" ? "text-white/80" : "text-[#5D6D63]"}`}>
                Lifecycle payback financials
              </div>
            </button>

            <button
              onClick={() => setReportType("measurement_plan")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "measurement_plan"
                  ? "border-[#152E27] bg-[#152E27] text-white shadow-sm"
                  : "border-[#DDE3DB] bg-[#F4F5F0] text-[#5D6D63] hover:bg-white"
              }`}
            >
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${reportType === "measurement_plan" ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
                Type 4
              </div>
              <div className={`mt-0.5 font-semibold ${reportType === "measurement_plan" ? "text-white" : "text-[#101C18]"}`}>
                IPMVP M&V Plan
              </div>
              <div className={`text-[10px] mt-1 ${reportType === "measurement_plan" ? "text-white/80" : "text-[#5D6D63]"}`}>
                Option A/B/C protocols
              </div>
            </button>

            <button
              onClick={() => setReportType("post_intervention_assessment")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "post_intervention_assessment"
                  ? "border-[#152E27] bg-[#152E27] text-white shadow-sm"
                  : "border-[#DDE3DB] bg-[#F4F5F0] text-[#5D6D63] hover:bg-white"
              }`}
            >
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${reportType === "post_intervention_assessment" ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
                Type 5
              </div>
              <div className={`mt-0.5 font-semibold ${reportType === "post_intervention_assessment" ? "text-white" : "text-[#101C18]"}`}>
                Evidence Gate Result
              </div>
              <div className={`text-[10px] mt-1 ${reportType === "post_intervention_assessment" ? "text-white/80" : "text-[#5D6D63]"}`}>
                Statistical noise verification
              </div>
            </button>
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="card-editorial p-8 bg-white shadow-md space-y-8 border border-[#DDE3DB]">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDE3DB]">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
                ENERPROOF AUDIT REPORT &bull; {reportType.toUpperCase()}
              </span>
              <h1 className="text-2xl font-bold font-display text-[#101C18] mt-1">
                {reportType === "comprehensive" && "Comprehensive M&V Audit & Verification Report"}
                {reportType === "data_quality_audit" && "Pre-Intervention Data Quality & Screening Report"}
                {reportType === "intervention_feasibility" && "Energy Conservation Feasibility & Financial Assessment"}
                {reportType === "measurement_plan" && "IPMVP Measurement & Verification Plan"}
                {reportType === "post_intervention_assessment" && "Post-Intervention Evidence Gate Assessment"}
              </h1>
              <div className="text-xs text-[#5D6D63] mt-1">
                Project: <strong className="text-[#101C18]">{project.metadata.name}</strong> &bull; Location: {project.metadata.location}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-[#5D6D63] font-mono">
              <div>Auditor: <strong className="text-[#101C18]">{project.metadata.leadAuditor}</strong></div>
              <div>Tariff: {project.tariffs.electricityTariffAznPerKwh.toFixed(3)} AZN/kWh</div>
              <div>Date: {currentDate}</div>
            </div>
          </div>

          {/* 1. Evidence Gate Determination */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#101C18] uppercase tracking-wider">
              1. Executive Summary & Evidence Gate Determination
            </h3>
            {project.evidenceAssessment ? (
              <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-mono font-bold uppercase tracking-wider">
                    {project.evidenceAssessment.classification}
                  </span>
                  <div className="text-sm font-bold font-display text-[#101C18] mt-1.5">
                    Threshold Established via Building Calibration Noise
                  </div>
                </div>
                <div className="text-left sm:text-right text-xs font-mono">
                  <div className="font-bold text-[#152E27]">
                    Apparent Savings: {project.evidenceAssessment.apparentSavingsPct.toFixed(1)}%
                  </div>
                  <div className="text-[#5D6D63] text-[11px] mt-0.5">
                    Gate: {project.evidenceAssessment.buildingSpecificThresholdPct !== null ? `${project.evidenceAssessment.buildingSpecificThresholdPct.toFixed(1)}%` : "Option A/B"} &bull; FSU: {project.evidenceAssessment.fsuPct !== null ? `${project.evidenceAssessment.fsuPct.toFixed(1)}%` : "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E]">
                Post-intervention evidence assessment not yet executed. Run Results module to populate determination.
              </div>
            )}
          </div>

          {/* 2. Public Audit Case Findings */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#101C18] uppercase tracking-wider">
              2. Facility Baseline & Public Audit Findings
            </h3>
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] text-xs text-[#5D6D63] space-y-2">
              <p>
                <strong>Baku Higher Oil School (BHOS) Energy Filing Context:</strong> Audited 36 months of institutional electricity disclosures (2022–2024). Identified a 10x arithmetic reporting discrepancy in published 2022 GHG emissions (497.79 metric tonnes actual vs 4,978 tonnes reported) and verified 100% duplication across 2023 and 2024 calendar records.
              </p>
            </div>
          </div>

          {/* 3. ECM Summary Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#101C18] uppercase tracking-wider">
              3. Proposed Energy Conservation Package Financials
            </h3>
            <div className="overflow-x-auto border border-[#DDE3DB] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F5F0] text-[#101C18] font-semibold border-b border-[#DDE3DB]">
                  <tr>
                    <th className="p-2.5">Measure</th>
                    <th className="p-2.5">CapEx (AZN)</th>
                    <th className="p-2.5">M&V (AZN)</th>
                    <th className="p-2.5">Annual kWh</th>
                    <th className="p-2.5">Net AZN/yr</th>
                    <th className="p-2.5">Payback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DB] font-mono">
                  {project.interventions.map((ecm: BaseEcmResult) => (
                    <tr key={ecm.id} className="text-[#101C18]">
                      <td className="p-2.5 font-sans font-medium">{ecm.name}</td>
                      <td className="p-2.5">{ecm.implementationCostAzn.toLocaleString()}</td>
                      <td className="p-2.5">{ecm.measurementCostAzn.toLocaleString()}</td>
                      <td className="p-2.5 text-[#152E27] font-semibold">{ecm.annualKwhSavings.toLocaleString()}</td>
                      <td className="p-2.5">{ecm.annualNetSavingsAzn.toLocaleString()}</td>
                      <td className="p-2.5">
                        {ecm.simplePaybackYears !== null ? `${ecm.simplePaybackYears.toFixed(1)} yrs` : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F4F5F0] font-mono font-bold border-t border-[#DDE3DB]">
                  <tr>
                    <td className="p-2.5 font-sans">Combined Package Total</td>
                    <td className="p-2.5">{totalCapEx.toLocaleString()}</td>
                    <td className="p-2.5">{(totalInvestment - totalCapEx).toLocaleString()}</td>
                    <td className="p-2.5 text-[#152E27]">
                      {project.interventions.reduce((a: number, b: BaseEcmResult) => a + b.annualKwhSavings, 0).toLocaleString()}
                    </td>
                    <td className="p-2.5">{totalNetSavingsAzn.toLocaleString()}</td>
                    <td className="p-2.5">{combinedPayback}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 4. IPMVP Measurement Protocol */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#101C18] uppercase tracking-wider">
              4. IPMVP Measurement & Verification Protocol Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">Lighting Measurement (IPMVP Option A)</div>
                <div className="text-[#5D6D63] text-[11px] mt-1">
                  Circuit-level power transducer logging for 14 continuous days to confirm actual operating wattage, paired with occupancy logging. Eliminates whole-building weather noise.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">HVAC Scheduling Measurement (IPMVP Option B)</div>
                <div className="text-[#5D6D63] text-[11px] mt-1">
                  Dedicated chiller and air handling unit interval sub-metering throughout the cooling season (26 weeks) to isolate thermal scheduling from miscellaneous plug loads.
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Regulatory Disclaimer */}
          <div className="pt-4 border-t border-[#DDE3DB] text-[11px] text-[#5D6D63] leading-relaxed">
            <strong>Regulatory & Professional Disclaimer:</strong> This document is generated algorithmically by the EnerProof platform to support Measurement & Verification (M&V) analysis under IPMVP and ASHRAE Guideline 14 principles. An Evidence Gate classification of <em>EVIDENCE_SUPPORTS_ESTIMATE</em> indicates that the observed change clears statistical noise requirements for the selected measurement boundary; it does not constitute a legal certification or a financial warranty of savings.
          </div>
        </div>
      </main>
    </div>
  );
}
