import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BHOSAuditResult,
  BaselineRegressionResult,
  DataQualitySummary,
  EvidenceGateAssessment,
  InterventionParams,
  Resolution,
} from "../types";
import { MeasurementPlan } from "../measurement/planner";

export interface ReportGenerationData {
  projectName: string;
  facilityType: string;
  location: string;
  auditorName: string;
  tariffPerKwh: number;
  resolution: Resolution;
  dataQuality: DataQualitySummary;
  bhosAudit?: BHOSAuditResult;
  baseline?: BaselineRegressionResult;
  interventions: InterventionParams[];
  measurementPlan?: MeasurementPlan;
  evidenceGate?: EvidenceGateAssessment;
}

export function generateEnerProofPdf(data: ReportGenerationData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // Header Bar
  doc.setFillColor(36, 92, 67); // Primary green #245C43
  doc.rect(0, 0, pageWidth, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ENERPROOF — ENERGY EFFICIENCY YOU CAN PROVE", 14, 8);
  doc.setFont("helvetica", "normal");
  doc.text("CECECO Clean Energy Hackathon 2027", pageWidth - 14, 8, { align: "right" });

  currentY = 22;

  // Title & Metadata
  doc.setTextColor(24, 33, 28);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Investment-Grade Energy Audit & Verification Report", 14, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);

  const auditDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.text(`Project: ${data.projectName} | Type: ${data.facilityType} | Location: ${data.location}`, 14, currentY);
  currentY += 5;
  doc.text(`Lead Auditor: ${data.auditorName} | Date: ${auditDate} | Tariff: ${data.tariffPerKwh.toFixed(3)} AZN/kWh`, 14, currentY);

  currentY += 8;
  doc.setDrawColor(223, 229, 224);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 8;

  // 1. Executive Summary & Evidence Gate Status
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("1. Executive Summary & Evidence Gate Determination", 14, currentY);
  currentY += 6;

  if (data.evidenceGate) {
    const status = data.evidenceGate.classification;
    let badgeColor: [number, number, number] = [36, 92, 67];
    if (status === "ADDITIONAL_MEASUREMENT_REQUIRED") badgeColor = [166, 106, 22];
    if (status === "INSUFFICIENT_EVIDENCE") badgeColor = [183, 71, 64];

    doc.setFillColor(...badgeColor);
    doc.roundedRect(14, currentY, pageWidth - 28, 14, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`DETERMINATION: ${status.replace(/_/g, " ")}`, 18, currentY + 6);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Apparent Savings: ${data.evidenceGate.apparentSavingsPct.toFixed(1)}% | Calibrated Gate: ${data.evidenceGate.calibratedThresholdPct.toFixed(1)}% | FSU: ${data.evidenceGate.fsuPct.toFixed(1)}% (Limit: 50.0%)`,
      18,
      currentY + 11
    );
    currentY += 18;
  }

  // 2. Data Quality & Provenance Audit
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("2. Data Quality & Pre-Intervention Provenance Audit", 14, currentY);
  currentY += 4;

  const qualityRows = [
    ["Total Analyzed Observations", `${data.dataQuality.totalRows}`],
    ["Missing Values Percentage", `${data.dataQuality.missingPct.toFixed(1)}% (Gate: ≤ 5.0%)`],
    ["Zero Readings Percentage", `${data.dataQuality.zeroPct.toFixed(1)}% (Gate: ≤ 25.0%)`],
    ["Max Consecutive Zero Hours", `${data.dataQuality.maxConsecutiveZeros} hrs (Limit: 720 hrs)`],
    ["Physical Violations (Negative/NaN)", data.dataQuality.hasNegativeValues ? "VIOLATION DETECTED" : "None Detected (Pass)"],
    ["Pre-Intervention Screening Gate", data.dataQuality.passed ? "PASSED" : "FAILED — ESTIMATE REFUSED"],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [["Quality Metric", "Observed Value & Gate Verification"]],
    body: qualityRows,
    theme: "striped",
    headStyles: { fillColor: [36, 92, 67], fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [24, 33, 28] },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error - jspdf-autotable extends jsPDF with lastAutoTable
  currentY = doc.lastAutoTable.finalY + 8;

  // BHOS Audit Section if present
  if (data.bhosAudit) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(183, 71, 64);
    doc.text("Baku Higher Oil School (BHOS) Audit Case Study Findings:", 14, currentY);
    currentY += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(24, 33, 28);
    doc.text(
      `• Gate 1 (Temporal Independence): REJECTED. 36 of 36 monthly records duplicate 2023 values identically (100% duplicate rate).`,
      14,
      currentY
    );
    currentY += 4;
    doc.text(
      `• Gate 2 (Emissions Arithmetic): REJECTED. Calculated GHG emissions are 497.79 metric tonnes; published claim is 4,978 tonnes (10x error).`,
      14,
      currentY
    );
    currentY += 4;
    doc.text(
      `• Gate 3 (Spatial Disaggregation): REJECTED. Facility utilizes single campus boundary meter; dormitory submetering is absent.`,
      14,
      currentY
    );
    currentY += 8;
  }

  // 3. Recommended Interventions & Financial Evaluation
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("3. Recommended Energy Conservation Measures (ECMs)", 14, currentY);
  currentY += 4;

  const totalCapEx = data.interventions.reduce((a, b) => a + b.capitalCostAzn, 0);
  const totalKwh = data.interventions.reduce((a, b) => a + b.annualKwhSavings, 0);
  const totalSavingsAzn = data.interventions.reduce((a, b) => a + b.annualCostSavingsAzn, 0);
  const totalCo2 = data.interventions.reduce((a, b) => a + b.avoidedCo2TonnesYear, 0);
  const portfolioPayback = totalSavingsAzn > 0 ? (totalCapEx / totalSavingsAzn).toFixed(1) : "N/A";

  const interventionRows = data.interventions.map((ecm) => [
    ecm.name,
    `${ecm.capitalCostAzn.toLocaleString()} AZN`,
    `${ecm.annualKwhSavings.toLocaleString()} kWh`,
    `${ecm.annualCostSavingsAzn.toLocaleString()} AZN`,
    `${ecm.simplePaybackYears.toFixed(1)} yrs`,
    `${ecm.avoidedCo2TonnesYear.toFixed(1)} t`,
  ]);

  interventionRows.push([
    "PORTFOLIO TOTAL",
    `${totalCapEx.toLocaleString()} AZN`,
    `${totalKwh.toLocaleString()} kWh`,
    `${totalSavingsAzn.toLocaleString()} AZN`,
    `${portfolioPayback} yrs`,
    `${totalCo2.toFixed(1)} t`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Energy Conservation Measure", "CapEx (AZN)", "Annual Savings", "Cost Savings", "Payback", "Avoided CO₂"]],
    body: interventionRows,
    theme: "striped",
    headStyles: { fillColor: [36, 92, 67], fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [24, 33, 28] },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error - jspdf-autotable extends jsPDF with lastAutoTable
  currentY = doc.lastAutoTable.finalY + 8;

  // Page 2: M&V Plan & Disclaimer
  doc.addPage();
  currentY = 18;

  // Header Bar Page 2
  doc.setFillColor(36, 92, 67);
  doc.rect(0, 0, pageWidth, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ENERPROOF VERIFICATION & MEASUREMENT PROTOCOL", 14, 7);

  currentY = 18;

  if (data.measurementPlan) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 60, 45);
    doc.text(`4. Measurement & Verification Plan (${data.measurementPlan.recommendedOption})`, 14, currentY);
    currentY += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(24, 33, 28);
    doc.text(`Option Title: ${data.measurementPlan.optionTitle}`, 14, currentY);
    currentY += 5;
    doc.text(`Boundary Definition: ${data.measurementPlan.meteringBoundary}`, 14, currentY);
    currentY += 5;
    doc.text(
      `Logging Interval: ${data.measurementPlan.loggingIntervalMinutes} min | Minimum Monitoring Duration: ${data.measurementPlan.minimumRecommendedDurationDays} days`,
      14,
      currentY
    );
    currentY += 6;

    const planTable = [
      ["Methodology Rationale", data.measurementPlan.rationale],
      ["Recommended Hardware", data.measurementPlan.recommendedHardware.join("; ")],
      ["Quality & Risk Controls", data.measurementPlan.riskMitigation.join("; ")],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [["Protocol Dimension", "Specification"]],
      body: planTable,
      theme: "plain",
      headStyles: { fillColor: [231, 241, 234], textColor: [21, 60, 45], fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [24, 33, 28] },
      columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });

    // @ts-expect-error - jspdf-autotable extends jsPDF with lastAutoTable
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // Legal & Scientific Disclaimer Box
  doc.setFillColor(248, 249, 247);
  doc.setDrawColor(223, 229, 224);
  doc.roundedRect(14, currentY, pageWidth - 28, 30, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(183, 71, 64);
  doc.text("Scientific & Regulatory Disclaimer:", 18, currentY + 6);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  const disclaimerText =
    "Evidence assessments and classifications generated by EnerProof are analytical decision-support outputs based on modeled counterfactual baselines (ASHRAE Guideline 14 Annex B / IPMVP). They do not constitute formal regulatory certification, statutory audit endorsement, or legal proof of causal attribution. All financial returns and payback periods are sensitive to local utility tariff structures (default: 0.125 AZN/kWh non-residential Baku rate).";
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 36);
  doc.text(splitDisclaimer, 18, currentY + 12);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(104, 115, 108);
  doc.text("EnerProof Clean Energy Verification Engine | Founder: Fizuli Hasanov | CECECO Clean Energy Hackathon 2027", 14, 285);

  return doc;
}
