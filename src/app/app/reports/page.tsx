"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { generateEnerProofPdf, ReportGenerationData } from "@/lib/reports/pdf-generator";
import { generateMeasurementPlan } from "@/lib/measurement/planner";
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
} from "lucide-react";

export default function ReportsPage() {
  const [projectName, setProjectName] = useState("Baku Higher Oil School — Residence & Campus");
  const [facilityType, setFacilityType] = useState("University Dormitory & Academic Complex");
  const [location, setLocation] = useState("Baku, Azerbaijan");
  const [auditorName, setAuditorName] = useState("Fizuli Hasanov");
  const [tariffPerKwh, setTariffPerKwh] = useState(0.125);
  const [currentDate, setCurrentDate] = useState("November 16, 2026");

  React.useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  const reportData: ReportGenerationData = {
    projectName,
    facilityType,
    location,
    auditorName,
    tariffPerKwh,
    resolution: "daily",
    dataQuality: {
      totalRows: 184,
      missingRows: 0,
      missingPct: 0.0,
      zeroCount: 0,
      zeroPct: 0.0,
      maxConsecutiveZeros: 0,
      hasNegativeValues: false,
      hasDuplicateAnnualProfile: false,
      isContinuousTimestamps: true,
      flags: [],
      passed: true,
    },
    bhosAudit: {
      temporalIndependencePass: false,
      duplicatedRecordCount: 36,
      duplicatedPercentage: 100,
      emissionsArithmeticPass: false,
      reportedEmissionsTonnes: 4978.0,
      calculatedEmissionsTonnes: 497.79,
      emissionsDiscrepancyFactor: 10.0,
      spatialDisaggregationPass: false,
      submeteringStatus: "Single Campus Boundary Meter (No Dormitory Submetering)",
      boilerSeasonalityPct: 79.86,
      overallAuditStatus: "REJECT",
      recommendations: [
        "Reject duplicate profile: 36 of 36 monthly readings in 2024 duplicate 2023 identically.",
        "Correct GHG calculation: 995,575 kWh @ 0.5 kg/kWh is 497.79 t, not 4,978 t (10x error).",
        "Install dedicated dormitory sub-meters to isolate residence hall efficiency.",
      ],
    },
    interventions: [
      {
        id: "lighting-1",
        name: "LED Lighting Retrofit & Occupancy Sensors",
        category: "lighting",
        capitalCostAzn: 17500,
        annualKwhSavings: 72000,
        annualCostSavingsAzn: 9000,
        simplePaybackYears: 1.9,
        avoidedCo2TonnesYear: 36.0,
        notes: "500 fixtures (64W -> 24W)",
      },
      {
        id: "hvac-1",
        name: "HVAC Automated Scheduling & Night Setbacks",
        category: "hvac",
        capitalCostAzn: 4500,
        annualKwhSavings: 54600,
        annualCostSavingsAzn: 6825,
        simplePaybackYears: 0.7,
        avoidedCo2TonnesYear: 27.3,
        notes: "120 kW equipment night setbacks",
      },
      {
        id: "plug-1",
        name: "Smart Power Strips / Cutoffs",
        category: "plug_load",
        capitalCostAzn: 5000,
        annualKwhSavings: 40880,
        annualCostSavingsAzn: 5110,
        simplePaybackYears: 1.0,
        avoidedCo2TonnesYear: 20.4,
        notes: "200 student workstations",
      },
      {
        id: "thermal-1",
        name: "Solar Thermal Hot Water Pre-Heating",
        category: "thermal_water",
        capitalCostAzn: 28000,
        annualKwhSavings: 114674,
        annualFuelSavingsM3: 10921,
        annualCostSavingsAzn: 2730,
        simplePaybackYears: 10.3,
        avoidedCo2TonnesYear: 20.7,
        notes: "10,000 L/day pre-heating",
      },
      {
        id: "boiler-1",
        name: "Boiler O₂ Trim & Flue Gas Economizer",
        category: "boiler",
        capitalCostAzn: 35000,
        annualKwhSavings: 715909,
        annualFuelSavingsM3: 68182,
        annualCostSavingsAzn: 17045,
        simplePaybackYears: 2.1,
        avoidedCo2TonnesYear: 129.5,
        notes: "Seasonal efficiency 78% -> 88%",
      },
    ],
    measurementPlan: generateMeasurementPlan({
      category: "multi_measure",
      expectedSavingsPct: 15.2,
      baselineCvRmsePct: 9.8,
      resolution: "daily",
      hasSubmetering: true,
    }),
    evidenceGate: {
      classification: "EVIDENCE_SUPPORTS_ESTIMATE",
      apparentSavingsPct: 15.2,
      apparentSavingsKwh: 45600,
      calibratedThresholdPct: 11.8,
      fsuPct: 18.5,
      maxAllowableFsuPct: 50.0,
      alpha: 0.05,
      confidencePct: 95,
      monitoringDurationDays: 184,
      dataQualityPassed: true,
      resolution: "daily",
      decisionRationale: [
        "Pre-intervention data quality gates passed successfully.",
        "Apparent savings (15.2%) exceed calibrated daily threshold (11.8%).",
        "Fractional Savings Uncertainty (18.5%) satisfies ASHRAE Guideline 14 tolerance (≤ 50.0%).",
        "Evidence supports the statistical estimate under modeled counterfactual baseline assumptions.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.",
    },
  };

  const handleDownloadPdf = () => {
    const doc = generateEnerProofPdf(reportData);
    doc.save(`EnerProof_Audit_Report_${projectName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EnerProof_Data_Export_${projectName.replace(/\s+/g, "_")}.json`;
    a.click();
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Measure Name",
      "Category",
      "CapEx AZN",
      "Annual kWh Savings",
      "Annual Cost Savings AZN",
      "Simple Payback Years",
      "Avoided CO2 Tonnes",
      "Notes",
    ];
    const rows = reportData.interventions.map((ecm) => [
      `"${ecm.name}"`,
      ecm.category,
      ecm.capitalCostAzn,
      ecm.annualKwhSavings,
      ecm.annualCostSavingsAzn,
      ecm.simplePaybackYears,
      ecm.avoidedCo2TonnesYear,
      `"${ecm.notes}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EnerProof_ECMs_${projectName.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  const totalCapEx = reportData.interventions.reduce((a, b) => a + b.capitalCostAzn, 0);
  const totalSavingsAzn = reportData.interventions.reduce((a, b) => a + b.annualCostSavingsAzn, 0);
  const combinedPayback = totalSavingsAzn > 0 ? (totalCapEx / totalSavingsAzn).toFixed(1) : "N/A";
  const totalCo2 = reportData.interventions.reduce((a, b) => a + b.avoidedCo2TonnesYear, 0);

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="7. Investment-Grade Report & Data Export"
        subtitle="Compiled audit documentation with executive summary, ECM financial tables, and transparent disclaimers."
      />

      <main className="p-8 max-w-5xl w-full space-y-8 mx-auto">
        {/* Action Export Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-[#DFE5E0] shadow-sm">
          <div>
            <div className="font-bold text-sm text-[#18211C]">
              Export Audit Package
            </div>
            <div className="text-xs text-[#68736C]">
              Download formatted PDF report, structured JSON data, or ECM summary CSV.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DFE5E0] bg-white hover:bg-black/5 text-xs font-medium text-[#18211C]"
            >
              <FileCode className="w-3.5 h-3.5 text-[#68736C]" />
              JSON
            </button>
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DFE5E0] bg-white hover:bg-black/5 text-xs font-medium text-[#18211C]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#68736C]" />
              CSV
            </button>
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="card-base p-8 bg-white shadow-md space-y-8 border border-[#CBD5E1]">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#DFE5E0]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#245C43]">
                ENERPROOF AUDIT REPORT
              </span>
              <h1 className="text-2xl font-bold text-[#18211C] mt-1">
                Investment-Grade Energy Audit & Verification
              </h1>
              <div className="text-xs text-[#68736C] mt-1">
                Project: <strong className="text-[#18211C]">{projectName}</strong> | Location: {location}
              </div>
            </div>

            <div className="text-right text-xs text-[#68736C]">
              <div>Auditor: <strong className="text-[#18211C]">{auditorName}</strong></div>
              <div>Tariff: <span className="font-mono">{tariffPerKwh.toFixed(3)} AZN/kWh</span></div>
              <div>Date: {currentDate}</div>
            </div>
          </div>

          {/* 1. Evidence Gate Determination */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18211C] uppercase tracking-wider">
              1. Executive Summary & Evidence Gate Determination
            </h3>
            <div className="p-4 rounded-lg bg-[#E7F1EA] border border-[#B8DAC4] flex items-center justify-between">
              <div>
                <span className="badge-green text-xs font-bold px-2 py-0.5 rounded">
                  EVIDENCE_SUPPORTS_ESTIMATE
                </span>
                <div className="text-sm font-bold text-[#153C2D] mt-1">
                  Statistical Support Issued Under Modeled Counterfactual
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-[#153C2D]">Apparent Savings: 15.2%</div>
                <div className="text-[#68736C]">Calibrated Gate: 11.8% | FSU: 18.5% (≤ 50%)</div>
              </div>
            </div>
          </div>

          {/* 2. Public Audit Case Findings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18211C] uppercase tracking-wider">
              2. Data Quality & Pre-Intervention Screening Findings
            </h3>
            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2 text-xs text-[#18211C]">
              <div className="font-semibold text-[#B74740]">
                Baku Higher Oil School (BHOS) Audit Flags:
              </div>
              <p>
                • <strong>Gate 1 (Duplicate Profile):</strong> 36 of 36 monthly records in the 2024 filing duplicate 2023 figures identically (100% duplicate rate). Independent meter logs required.
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
                    <th className="p-2.5">CapEx (AZN)</th>
                    <th className="p-2.5">Annual Savings</th>
                    <th className="p-2.5">Annual AZN</th>
                    <th className="p-2.5">Payback</th>
                    <th className="p-2.5">Avoided CO₂</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE5E0] font-mono text-xs">
                  {reportData.interventions.map((ecm) => (
                    <tr key={ecm.id} className="hover:bg-[#F8F9F7]">
                      <td className="p-2.5 font-sans font-semibold text-[#18211C]">{ecm.name}</td>
                      <td className="p-2.5">{ecm.capitalCostAzn.toLocaleString()} AZN</td>
                      <td className="p-2.5 font-bold text-[#245C43]">
                        {ecm.annualKwhSavings.toLocaleString()} kWh
                      </td>
                      <td className="p-2.5 font-bold">{ecm.annualCostSavingsAzn.toLocaleString()} AZN</td>
                      <td className="p-2.5">{ecm.simplePaybackYears.toFixed(1)} yrs</td>
                      <td className="p-2.5">{ecm.avoidedCo2TonnesYear.toFixed(1)} t</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F8F9F7] font-bold text-[#18211C]">
                    <td className="p-2.5 font-sans">PORTFOLIO TOTAL</td>
                    <td className="p-2.5">{totalCapEx.toLocaleString()} AZN</td>
                    <td className="p-2.5 text-[#245C43]">
                      {reportData.interventions.reduce((a, b) => a + b.annualKwhSavings, 0).toLocaleString()} kWh
                    </td>
                    <td className="p-2.5 text-[#245C43]">{totalSavingsAzn.toLocaleString()} AZN</td>
                    <td className="p-2.5">{combinedPayback} yrs</td>
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
