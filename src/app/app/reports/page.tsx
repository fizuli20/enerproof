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
} from "lucide-react";

export default function ReportsPage() {
  const { project, setMetadata, exportProjectJson } = useProject();

  const [reportType, setReportType] = useState<ReportType>("comprehensive");
  const [currentDate, setCurrentDate] = useState("November 16, 2026");

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
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="7. Investment-Grade Report & Data Export"
        subtitle="Compiled documentation with 5 distinct report templates, dynamic data bindings, and transparent disclaimers."
      />

      <main className="p-8 max-w-5xl w-full space-y-8 mx-auto">
        {/* Stale Warning Banner if upstream modified */}
        {project.staleFlags.reportsStale && (
          <div className="p-3.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>
                <strong>Notice:</strong> Upstream parameters (tariffs, baseline, or ECM configurations) were updated. This report reflects live synchronized project state.
              </span>
            </div>
          </div>
        )}

        {/* Report Template Selector & Action Bar */}
        <div className="card-base p-5 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DFE5E0]">
            <div>
              <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#245C43]" />
                Select Report Scope & Document Format
              </h3>
              <p className="text-xs text-[#68736C]">
                Generate tailored documentation for auditors, ESCOs, or the Energy Efficiency Fund.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF ({reportType})
              </button>
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DFE5E0] bg-white hover:bg-black/5 text-xs font-medium text-[#18211C]"
              >
                <FileCode className="w-3.5 h-3.5 text-[#68736C]" />
                Full Project JSON
              </button>
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DFE5E0] bg-white hover:bg-black/5 text-xs font-medium text-[#18211C]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#68736C]" />
                ECMs CSV
              </button>
            </div>
          </div>

          {/* 5 Distinct Report Types */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            <button
              onClick={() => setReportType("comprehensive")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "comprehensive"
                  ? "border-[#245C43] bg-[#E7F1EA]/50 font-bold text-[#153C2D]"
                  : "border-[#DFE5E0] bg-[#F8F9F7] text-[#68736C] hover:bg-white"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider text-[#245C43]">Type 1</div>
              <div className="mt-0.5 text-[#18211C] font-semibold">Comprehensive Audit</div>
              <div className="text-[10px] text-[#68736C] mt-1">Multi-page complete dossier</div>
            </button>

            <button
              onClick={() => setReportType("data_quality_audit")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "data_quality_audit"
                  ? "border-[#245C43] bg-[#E7F1EA]/50 font-bold text-[#153C2D]"
                  : "border-[#DFE5E0] bg-[#F8F9F7] text-[#68736C] hover:bg-white"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider text-[#245C43]">Type 2</div>
              <div className="mt-0.5 text-[#18211C] font-semibold">Data Quality Screening</div>
              <div className="text-[10px] text-[#68736C] mt-1">Pre-intervention gate audit</div>
            </button>

            <button
              onClick={() => setReportType("intervention_feasibility")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "intervention_feasibility"
                  ? "border-[#245C43] bg-[#E7F1EA]/50 font-bold text-[#153C2D]"
                  : "border-[#DFE5E0] bg-[#F8F9F7] text-[#68736C] hover:bg-white"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider text-[#245C43]">Type 3</div>
              <div className="mt-0.5 text-[#18211C] font-semibold">ECM Feasibility</div>
              <div className="text-[10px] text-[#68736C] mt-1">Lifecycle payback financials</div>
            </button>

            <button
              onClick={() => setReportType("measurement_plan")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "measurement_plan"
                  ? "border-[#245C43] bg-[#E7F1EA]/50 font-bold text-[#153C2D]"
                  : "border-[#DFE5E0] bg-[#F8F9F7] text-[#68736C] hover:bg-white"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider text-[#245C43]">Type 4</div>
              <div className="mt-0.5 text-[#18211C] font-semibold">IPMVP M&V Plan</div>
              <div className="text-[10px] text-[#68736C] mt-1">Option A/B/C protocols</div>
            </button>

            <button
              onClick={() => setReportType("post_intervention_assessment")}
              className={`p-3 rounded-lg border text-left transition-all ${
                reportType === "post_intervention_assessment"
                  ? "border-[#245C43] bg-[#E7F1EA]/50 font-bold text-[#153C2D]"
                  : "border-[#DFE5E0] bg-[#F8F9F7] text-[#68736C] hover:bg-white"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider text-[#245C43]">Type 5</div>
              <div className="mt-0.5 text-[#18211C] font-semibold">Evidence Gate Result</div>
              <div className="text-[10px] text-[#68736C] mt-1">Statistical noise verification</div>
            </button>
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="card-base p-8 bg-white shadow-md space-y-8 border border-[#CBD5E1]">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#DFE5E0]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#245C43]">
                ENERPROOF AUDIT REPORT • {reportType.toUpperCase()}
              </span>
              <h1 className="text-2xl font-bold text-[#18211C] mt-1">
                {reportType === "comprehensive" && "Comprehensive M&V Audit & Verification Report"}
                {reportType === "data_quality_audit" && "Pre-Intervention Data Quality & Screening Report"}
                {reportType === "intervention_feasibility" && "Energy Conservation Feasibility & Financial Assessment"}
                {reportType === "measurement_plan" && "IPMVP Measurement & Verification Plan"}
                {reportType === "post_intervention_assessment" && "Post-Intervention Evidence Gate Assessment"}
              </h1>
              <div className="text-xs text-[#68736C] mt-1">
                Project: <strong className="text-[#18211C]">{project.metadata.name}</strong> | Location: {project.metadata.location}
              </div>
            </div>

            <div className="text-right text-xs text-[#68736C]">
              <div>Auditor: <strong className="text-[#18211C]">{project.metadata.leadAuditor}</strong></div>
              <div>Tariff: <span className="font-mono">{project.tariffs.electricityTariffAznPerKwh.toFixed(3)} AZN/kWh</span></div>
              <div>Date: {currentDate}</div>
            </div>
          </div>

          {/* 1. Evidence Gate Determination */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18211C] uppercase tracking-wider">
              1. Executive Summary & Evidence Gate Determination
            </h3>
            {project.evidenceAssessment ? (
              <div className="p-4 rounded-lg bg-[#E7F1EA] border border-[#B8DAC4] flex items-center justify-between">
                <div>
                  <span className="badge-green text-xs font-bold px-2 py-0.5 rounded">
                    {project.evidenceAssessment.classification}
                  </span>
                  <div className="text-sm font-bold text-[#153C2D] mt-1">
                    Threshold Established via Building Calibration Noise
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-[#153C2D]">
                    Apparent Savings: {project.evidenceAssessment.apparentSavingsPct.toFixed(1)}%
                  </div>
                  <div className="text-[#68736C]">
                    Gate: {project.evidenceAssessment.buildingSpecificThresholdPct !== null ? `${project.evidenceAssessment.buildingSpecificThresholdPct.toFixed(1)}%` : "Option A/B"} | FSU: {project.evidenceAssessment.fsuPct !== null ? `${project.evidenceAssessment.fsuPct.toFixed(1)}%` : "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E]">
                Post-intervention evidence assessment not yet executed. Run module 5 to populate determination.
              </div>
            )}
          </div>

          {/* 2. Public Audit Case Findings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18211C] uppercase tracking-wider">
              2. Pre-Intervention Data Quality Screening
            </h3>
            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2 text-xs text-[#18211C]">
              <div className="font-semibold text-[#B74740]">
                Provenance & Arithmetic Validation:
              </div>
              <p>
                • <strong>Gate 1 (Duplicate Profile):</strong> 36 of 36 monthly records in the 2024 filing duplicate 2023 figures identically (100% duplicate rate). Independent sub-meter logs required.
              </p>
              <p>
                • <strong>Gate 2 (Emissions Factor Arithmetic):</strong> Calculated emissions from 995,575 kWh @ 0.5 kg/kWh is 497.79 metric tonnes, not ~4,978 tonnes (10x calculation error in public report).
              </p>
            </div>
          </div>

          {/* 3. Recommended ECMs Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18211C] uppercase tracking-wider">
              3. Recommended Energy Conservation Measures (ECMs)
            </h3>

            <div className="overflow-x-auto border border-[#DFE5E0] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E7F1EA] text-[#153C2D] font-bold">
                  <tr>
                    <th className="p-2.5">Energy Conservation Measure</th>
                    <th className="p-2.5">Total CapEx</th>
                    <th className="p-2.5">Annual Energy</th>
                    <th className="p-2.5">Net Annual AZN</th>
                    <th className="p-2.5">Payback</th>
                    <th className="p-2.5">Avoided CO₂</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE5E0] font-mono text-xs">
                  {project.interventions.map((ecm: BaseEcmResult) => (
                    <tr key={ecm.id} className="hover:bg-[#F8F9F7]">
                      <td className="p-2.5 font-sans font-semibold text-[#18211C]">{ecm.name}</td>
                      <td className="p-2.5">{ecm.totalInitialInvestmentAzn.toLocaleString()} AZN</td>
                      <td className="p-2.5 font-bold text-[#245C43]">
                        {ecm.annualKwhSavings.toLocaleString()} kWh
                      </td>
                      <td className="p-2.5 font-bold">{ecm.annualNetSavingsAzn.toLocaleString()} AZN</td>
                      <td className="p-2.5">
                        {ecm.simplePaybackYears !== null ? `${ecm.simplePaybackYears.toFixed(1)} yrs` : "No payback"}
                      </td>
                      <td className="p-2.5">{ecm.avoidedCo2TonnesYear !== null ? `${ecm.avoidedCo2TonnesYear.toFixed(1)} t` : "N/A"}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F8F9F7] font-bold text-[#18211C]">
                    <td className="p-2.5 font-sans">PORTFOLIO TOTAL</td>
                    <td className="p-2.5">{totalInvestment.toLocaleString()} AZN</td>
                    <td className="p-2.5 text-[#245C43]">
                      {project.interventions.reduce((a: number, b: BaseEcmResult) => a + b.annualKwhSavings, 0).toLocaleString()} kWh
                    </td>
                    <td className="p-2.5 text-[#245C43]">{totalNetSavingsAzn.toLocaleString()} AZN</td>
                    <td className="p-2.5">{combinedPayback}</td>
                    <td className="p-2.5">{totalCo2.toFixed(1)} t</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Measurement & Verification Protocol */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18211C] uppercase tracking-wider">
              4. IPMVP Measurement Protocol (Option B Retrofit Isolation)
            </h3>
            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] text-xs space-y-1.5 text-[#68736C]">
              <div><strong>Boundary:</strong> Dedicated sub-meters on HVAC and thermal domestic water heating.</div>
              <div><strong>Hardware:</strong> Multi-circuit three-phase power meters, ultrasonic thermal BTU meters.</div>
              <div><strong>Duration:</strong> 15-minute logging intervals over a minimum 90-day post-intervention period.</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] text-[11px] text-[#68736C] leading-relaxed">
            <strong className="text-[#18211C]">Statutory & Scientific Notice:</strong> Evidence assessments and classifications generated by EnerProof are analytical decision-support outputs based on modeled counterfactual baselines (ASHRAE Guideline 14 Annex B / IPMVP). They do not constitute formal regulatory certification, statutory audit endorsement, or legal proof of causal attribution. All financial returns and payback periods are sensitive to local utility tariff structures (default: 0.125 AZN/kWh non-residential Baku rate).
          </div>
        </div>
      </main>
    </div>
  );
}
