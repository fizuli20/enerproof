import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FullProjectState } from "../types";

export type ReportType =
  | "comprehensive"
  | "data_quality_audit"
  | "intervention_feasibility"
  | "measurement_plan"
  | "post_intervention_assessment";

function addHeader(doc: jsPDF, title: string, pageNum: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(36, 92, 67); // Deep Green #245C43
  doc.rect(0, 0, pageWidth, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), 14, 8);
  doc.setFont("helvetica", "normal");
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, 8, { align: "right" });
}

function addFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  doc.text(
    "EnerProof Decision Engine | Founder: Fizuli Hasanov | CECECO Clean Energy Hackathon 2027",
    14,
    pageHeight - 6
  );
  doc.text("https://enerproof.vercel.app", doc.internal.pageSize.getWidth() - 14, pageHeight - 6, {
    align: "right",
  });
}

export function generateEnerProofReport(
  project: FullProjectState,
  reportType: ReportType = "comprehensive"
): jsPDF {

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Title & Metadata
  doc.setTextColor(24, 33, 28);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");

  const reportTitles: Record<ReportType, string> = {
    comprehensive: "Investment-Grade Energy Audit & Verification Assessment",
    data_quality_audit: "Pre-Intervention Data Quality & Provenance Audit",
    intervention_feasibility: "Energy Conservation Measures (ECMs) Feasibility Report",
    measurement_plan: "Measurement & Verification Protocol Specification (IPMVP)",
    post_intervention_assessment: "Post-Intervention Evidence Gate Assessment",
  };

  doc.text(reportTitles[reportType], 14, currentY);

  currentY += 6;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  doc.text(
    `Building: ${project.metadata.name} | Facility: ${project.metadata.facilityType} | Location: ${project.metadata.location}`,
    14,
    currentY
  );
  currentY += 4.5;
  doc.text(
    `Auditor: ${project.metadata.leadAuditor} | Date: ${todayStr} | Tariff: ${project.tariffs.electricityTariffAznPerKwh.toFixed(3)} AZN/kWh`,
    14,
    currentY
  );

  currentY += 6;
  doc.setDrawColor(223, 229, 224);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 6;

  // =========================================================================
  // SECTION 1: EXECUTIVE DETERMINATION / EVIDENCE GATE
  // =========================================================================
  if (reportType === "comprehensive" || reportType === "post_intervention_assessment") {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 60, 45);
    doc.text("1. Executive Summary & Evidence Gate Determination", 14, currentY);
    currentY += 5;

    if (project.evidenceAssessment) {
      const ea = project.evidenceAssessment;
      let badgeColor: [number, number, number] = [36, 92, 67];
      if (ea.classification === "ADDITIONAL_MEASUREMENT_REQUIRED") badgeColor = [166, 106, 22];
      if (ea.classification === "INSUFFICIENT_EVIDENCE") badgeColor = [183, 71, 64];

      doc.setFillColor(...badgeColor);
      doc.roundedRect(14, currentY, pageWidth - 28, 14, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`DETERMINATION: ${ea.classification.replace(/_/g, " ")}`, 18, currentY + 6);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const threshText =
        ea.buildingSpecificThresholdPct !== null
          ? `${ea.buildingSpecificThresholdPct.toFixed(1)}%`
          : "UNESTABLISHED";
      const fsuText = ea.fsuPct !== null ? `${ea.fsuPct.toFixed(1)}%` : "N/A";
      doc.text(
        `Apparent Savings: ${ea.apparentSavingsPct.toFixed(1)}% | Building Noise Threshold: ${threshText} | FSU: ${fsuText} (${ea.confidencePct}% Confidence)`,
        18,
        currentY + 11
      );
      currentY += 18;
    } else {
      doc.setFillColor(248, 249, 247);
      doc.roundedRect(14, currentY, pageWidth - 28, 10, 2, 2, "F");
      doc.setTextColor(104, 115, 108);
      doc.setFontSize(8.5);
      doc.text("No post-intervention assessment completed for this project.", 18, currentY + 6.5);
      currentY += 14;
    }
  }

  // =========================================================================
  // SECTION 2: DATA QUALITY & PROVENANCE AUDIT
  // =========================================================================
  if (
    reportType === "comprehensive" ||
    reportType === "data_quality_audit" ||
    reportType === "post_intervention_assessment"
  ) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 60, 45);
    doc.text("2. Data Quality & Historical Provenance Audit", 14, currentY);
    currentY += 4;

    const dq = project.auditSummary;
    const qualityRows = dq
      ? [
          ["Dataset File & Provenance", project.rawDataset?.fileName || "Active System Record"],
          ["Total Observations Analyzed", `${dq.totalRows}`],
          ["Missing Values Percentage", `${dq.missingPct.toFixed(1)}% (Allowable: ≤ 5.0%)`],
          ["Zero Readings Percentage", `${dq.zeroPct.toFixed(1)}%`],
          ["Max Consecutive Zero Intervals", `${dq.maxConsecutiveZeros} intervals`],
          ["Physical Violations (Negative/NaN)", dq.hasNegativeValues ? "VIOLATION DETECTED" : "None (Passed)"],
          ["Duplicate Annual Profile Check", dq.hasDuplicateAnnualProfile ? "DUPLICATE DETECTED (REJECT)" : "Passed"],
          ["Pre-Intervention Screening Status", dq.passed ? "PASSED SCREENING" : "FAILED — ESTIMATE REFUSED"],
        ]
      : [["Status", "No data quality audit executed."]];

    autoTable(doc, {
      startY: currentY,
      head: [["Quality Metric", "Observed Value & Audit Gate Verification"]],
      body: qualityRows,
      theme: "striped",
      headStyles: { fillColor: [36, 92, 67], fontSize: 7.5 },
      bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
      columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });

    // @ts-expect-error autoTable extends jsPDF
    currentY = doc.lastAutoTable.finalY + 6;

    // BHOS Specific Findings if present
    if (project.bhosAudit) {
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(183, 71, 64);
      doc.text("Baku Higher Oil School (BHOS) Audit Case Findings:", 14, currentY);
      currentY += 4;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(24, 33, 28);
      doc.text(
        "• Gate 1 (Temporal Independence): REJECTED. 36 of 36 monthly records in 2024 duplicate 2023 values identically.",
        14,
        currentY
      );
      currentY += 3.5;
      doc.text(
        "• Gate 2 (Emissions Arithmetic): REJECTED. Calculated GHG is 497.79 metric tonnes vs reported 4,978 tonnes (10x error flag).",
        14,
        currentY
      );
      currentY += 3.5;
      doc.text(
        "• Gate 3 (Spatial Disaggregation): REJECTED. Facility uses bulk campus boundary meter; dormitories are unmetered.",
        14,
        currentY
      );
      currentY += 6;
    }
  }

  // =========================================================================
  // SECTION 3: BASELINE REGRESSION DIAGNOSTICS
  // =========================================================================
  if (
    (reportType === "comprehensive" || reportType === "post_intervention_assessment") &&
    project.baselineResult
  ) {
    const br = project.baselineResult;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 60, 45);
    doc.text("3. Baseline Model & Weather Normalization Diagnostics", 14, currentY);
    currentY += 4;

    const baseRows = [
      ["Screening Status", br.screeningStatus],
      ["In-Sample Training R²", br.trainingDiagnostics.r2.toFixed(3)],
      ["In-Sample CV(RMSE)", `${br.trainingDiagnostics.cvRmsePct.toFixed(1)}%`],
      ["In-Sample NMBE", `${br.trainingDiagnostics.nmbePct.toFixed(2)}%`],
      [
        "Out-of-Sample Calibration CV(RMSE)",
        br.calibrationDiagnostics
          ? `${br.calibrationDiagnostics.cvRmsePct.toFixed(1)}% (${br.calibSampleSize} independent obs)`
          : "N/A (No calibration window)",
      ],
      [
        "Residual Lag-1 Autocorrelation (r₁)",
        br.calibrationDiagnostics ? br.calibrationDiagnostics.r1Autocorr.toFixed(2) : "0.00",
      ],
      [
        "Degree-Day Coefficients",
        `β₀=${br.coefficients.intercept.toFixed(1)}, β_HDD=${br.coefficients.hddCoeff.toFixed(2)}, β_CDD=${br.coefficients.cddCoeff.toFixed(2)}`,
      ],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [["Model Parameter / Diagnostic", "Value & Evaluation Notes"]],
      body: baseRows,
      theme: "plain",
      headStyles: { fillColor: [231, 241, 234], textColor: [21, 60, 45], fontSize: 7.5 },
      bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
      columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });

    // @ts-expect-error autoTable extends jsPDF
    currentY = doc.lastAutoTable.finalY + 6;
  }

  // =========================================================================
  // SECTION 4: RECOMMENDED INTERVENTIONS (ECMs)
  // =========================================================================
  if (
    reportType === "comprehensive" ||
    reportType === "intervention_feasibility"
  ) {
    // Add page if space is low
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 60, 45);
    doc.text("4. Recommended Energy Conservation Measures (ECMs)", 14, currentY);
    currentY += 4;

    if (project.interventions.length > 0) {
      const totalCapEx = project.interventions.reduce((a, b) => a + b.totalInitialInvestmentAzn, 0);
      const totalKwh = project.interventions.reduce((a, b) => a + b.annualKwhSavings, 0);
      const totalSavingsAzn = project.interventions.reduce((a, b) => a + b.annualNetSavingsAzn, 0);
      const totalCo2 = project.interventions.reduce((a, b) => a + (b.avoidedCo2TonnesYear || 0), 0);
      const combinedPayback =
        totalSavingsAzn > 0 ? (totalCapEx / totalSavingsAzn).toFixed(1) + " yrs" : "No positive payback";

      const ecmRows = project.interventions.map((ecm) => [
        ecm.name,
        `${ecm.totalInitialInvestmentAzn.toLocaleString()} AZN`,
        `${ecm.annualKwhSavings.toLocaleString()} kWh`,
        `${ecm.annualNetSavingsAzn.toLocaleString()} AZN`,
        ecm.simplePaybackYears !== null ? `${ecm.simplePaybackYears.toFixed(1)} yrs` : "No positive payback",
        ecm.avoidedCo2TonnesYear !== null ? `${ecm.avoidedCo2TonnesYear.toFixed(1)} t` : "N/A",
      ]);

      ecmRows.push([
        "PORTFOLIO TOTAL",
        `${totalCapEx.toLocaleString()} AZN`,
        `${totalKwh.toLocaleString()} kWh`,
        `${totalSavingsAzn.toLocaleString()} AZN`,
        combinedPayback,
        `${totalCo2.toFixed(1)} t`,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Energy Conservation Measure", "Total Investment", "Annual Energy", "Net AZN Savings", "Payback", "Avoided CO₂"]],
        body: ecmRows,
        theme: "striped",
        headStyles: { fillColor: [36, 92, 67], fontSize: 7.5 },
        bodyStyles: { fontSize: 7, textColor: [24, 33, 28] },
        margin: { left: 14, right: 14 },
      });

      // @ts-expect-error autoTable extends jsPDF
      currentY = doc.lastAutoTable.finalY + 6;
    } else {
      doc.setFontSize(8);
      doc.setTextColor(104, 115, 108);
      doc.text("No active interventions configured in current project.", 14, currentY);
      currentY += 6;
    }
  }

  // =========================================================================
  // SECTION 5: MEASUREMENT & VERIFICATION PLAN (IPMVP)
  // =========================================================================
  if (reportType === "comprehensive" || reportType === "measurement_plan") {
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 60, 45);
    doc.text("5. Measurement & Verification Plan (IPMVP Alignment)", 14, currentY);
    currentY += 4;

    const mp = project.measurementPlan;
    if (mp) {
      const planRows = [
        ["Recommended IPMVP Protocol", `${mp.recommendedOption}: ${mp.optionTitle}`],
        ["Measurement Boundary", mp.meteringBoundary],
        ["Hardware & Sensors", mp.recommendedHardware.join("; ")],
        ["Logging Interval", `${mp.loggingIntervalMinutes} minutes`],
        ["Minimum Monitoring Duration", `${mp.minimumRecommendedDurationDays} days`],
        ["Expected Uncertainty (FSU)", `≤ ${mp.expectedFsuPct.toFixed(1)}% at 95% confidence`],
      ];

      autoTable(doc, {
        startY: currentY,
        head: [["Protocol Dimension", "Specification"]],
        body: planRows,
        theme: "plain",
        headStyles: { fillColor: [231, 241, 234], textColor: [21, 60, 45], fontSize: 7.5 },
        bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
        columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
        margin: { left: 14, right: 14 },
      });

      // @ts-expect-error autoTable extends jsPDF
      currentY = doc.lastAutoTable.finalY + 6;
    } else {
      doc.setFontSize(8);
      doc.setTextColor(104, 115, 108);
      doc.text("No measurement plan established for current project.", 14, currentY);
      currentY += 6;
    }
  }

  // =========================================================================
  // REGULATORY DISCLAIMER BOX (ON ALL REPORTS)
  // =========================================================================
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(248, 249, 247);
  doc.setDrawColor(223, 229, 224);
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(183, 71, 64);
  doc.text("Scientific & Regulatory Scope Notice:", 18, currentY + 5.5);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  const disclaimerText =
    "EnerProof is an analytical decision-support tool implementing experimental uncertainty estimators based on ASHRAE Guideline 14 Annex B and IPMVP principles. " +
    "Assessments do not constitute formal regulatory certification, statutory energy audit licensing endorsement, or legal proof of causal attribution without on-site physical commissioning. " +
    "Financial returns depend on active utility tariffs (illustrative non-residential rate: 0.125 AZN/kWh).";
  const splitDisc = doc.splitTextToSize(disclaimerText, pageWidth - 36);
  doc.text(splitDisc, 18, currentY + 11);

  // Add header & footer to every page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader(doc, `EnerProof — ${project.metadata.name}`, i, totalPages);
    addFooter(doc);
  }

  return doc;
}

export const generateEnerProofPdf = generateEnerProofReport;

