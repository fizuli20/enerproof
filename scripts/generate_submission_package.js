const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");
const autoTableImport = require("jspdf-autotable");
const autoTable = autoTableImport.default || autoTableImport;
const QRCode = require("qrcode");

async function generateSubmissionPackage() {
  const submissionDir = path.join(__dirname, "..", "submission");
  if (!fs.existsSync(submissionDir)) {
    fs.mkdirSync(submissionDir, { recursive: true });
  }

  console.log("Generating 01_EnerProof_Prototype_and_Demo_Access.pdf...");
  await generateAccessPdf(submissionDir);

  console.log("Generating 02_EnerProof_Technical_Validation.pdf...");
  generateTechnicalValidationPdf(submissionDir);

  console.log("Generating 03_EnerProof_Demo_Walkthrough.pdf...");
  generateWalkthroughPdf(submissionDir);

  console.log("Generating 04_EnerProof_Submission_Links.txt...");
  generateLinksTxt(submissionDir);

  console.log("Generating 05_EnerProof_Final_Submission_Checklist.md...");
  generateChecklistMd(submissionDir);

  console.log("All submission assets generated successfully in:", submissionDir);
}

async function generateAccessPdf(outDir) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(36, 92, 67);
  doc.rect(0, 0, pageWidth, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("ENERPROOF — PROTOTYPE & DEMO ACCESS GUIDE", 14, 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("CECECO Clean Energy Hackathon 2027", pageWidth - 14, 10, { align: "right" });

  let y = 26;

  // Title
  doc.setTextColor(24, 33, 28);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("EnerProof: Energy Efficiency You Can Prove", 14, y);

  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  doc.text("Deterministic Measurement & Verification (M&V) Decision Support Engine", 14, y);

  y += 10;
  doc.setDrawColor(223, 229, 224);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  // QR Code & Primary Access Box
  const qrDataUrl = await QRCode.toDataURL("https://enerproof.vercel.app", {
    margin: 1,
    width: 250,
  });

  doc.setFillColor(248, 249, 247);
  doc.roundedRect(14, y, pageWidth - 28, 48, 3, 3, "FD");

  // Add QR Image
  doc.addImage(qrDataUrl, "PNG", 18, y + 4, 40, 40);

  // Access text next to QR
  doc.setTextColor(24, 33, 28);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Live Production Deployment", 64, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(36, 92, 67);
  doc.text("https://enerproof.vercel.app", 64, y + 16);

  doc.setTextColor(104, 115, 108);
  doc.setFontSize(8);
  doc.text("GitHub Repository: https://github.com/fizuli20/enerproof", 64, y + 23);
  doc.text("Founder & Lead: Fizuli Hasanov (Account: fizuli20)", 64, y + 28);
  doc.text("Authentication / Access Gate: None required (Publicly accessible for judges)", 64, y + 33);
  doc.text("Client-Side Privacy: 100% in-browser computation; zero server telemetry", 64, y + 38);

  y += 56;

  // 3 Live Demo Tracks
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("Three Interactive Live Demonstration Tracks", 14, y);
  y += 6;

  const demoRows = [
    [
      "Track A: BHOS Public Data Audit",
      "https://enerproof.vercel.app/app/audit?demo=bhos",
      "Audits 3-year Baku Higher Oil School public filing. Catches 10x GHG emissions math error (497.79 t vs ~4,978 t) and 36 identical duplicate monthly readings across 2023-2024.",
    ],
    [
      "Track B: Student Residence Retrofit",
      "https://enerproof.vercel.app/app/interventions?demo=residence",
      "Evaluates 500-occupant university dormitory with degree-day baseline regression, 5 interactive ECM calculators (LED, HVAC, plug, solar thermal, boiler), and 1-click PDF export.",
    ],
    [
      "Track C: Research Lab & Portfolio",
      "https://enerproof.vercel.app/app/portfolio?demo=research",
      "Visualizes 152-building BDG2 empirical benchmark, hourly vs daily vs monthly detection power curves, and portfolio noise pooling with correlation floor (rho = 0.33).",
    ],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Demonstration Track", "Direct Deep Link", "Evaluation Focus & Key Functionality"]],
    body: demoRows,
    theme: "striped",
    headStyles: { fillColor: [36, 92, 67], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: "bold" },
      1: { cellWidth: 50, textColor: [36, 92, 67] },
      2: { cellWidth: 90 },
    },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Technical Validation Summary
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("Summary of Technical & Scientific Verification", 14, y);
  y += 4;

  const techRows = [
    ["Automated Test Suite", "19/19 Vitest unit tests passing (100% pass rate in 114ms)"],
    ["Pre-Test Benchmark Cohort", "152 university & lodging buildings from BDG2 (Nature Scientific Data)"],
    ["Evaluation Abstentions", "9 test-period dropouts recorded as abstentions (143 completed buildings)"],
    ["Simulation Resolution", "Hourly-first simulation with exact mathematical sum-aggregation to daily/monthly"],
    ["Empirical Evidence Gates", "Daily threshold: 11.8% (Synthetic FPR: 4.21% <= 5%, 83.9% detection at 15% savings; MDE unestablished)"],
    ["ASHRAE Guideline 14 Annex B", "Deterministic refusal when FSU > 50% or data quality fails"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Verification Dimension", "Audited Empirical Result"]],
    body: techRows,
    theme: "plain",
    headStyles: { fillColor: [231, 241, 234], textColor: [21, 60, 45], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
    columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 6;

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(104, 115, 108);
  doc.text(
    "Disclaimer: EnerProof assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.",
    14,
    286
  );

  const pdfPath = path.join(outDir, "01_EnerProof_Prototype_and_Demo_Access.pdf");
  fs.writeFileSync(pdfPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Saved:", pdfPath);
}

function generateTechnicalValidationPdf(outDir) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Page 1: Title & Executive Research Audit
  doc.setFillColor(36, 92, 67);
  doc.rect(0, 0, pageWidth, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ENERPROOF TECHNICAL VALIDATION DOSSIER", 14, 9);
  doc.setFont("helvetica", "normal");
  doc.text("CECECO Clean Energy Hackathon 2027", pageWidth - 14, 9, { align: "right" });

  let y = 22;
  doc.setTextColor(24, 33, 28);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Empirical M&V Validation & Scientific Quality Gate", 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  doc.text("Author: Fizuli Hasanov | Dataset: Building Data Genome 2 (BDG2) | Cohort: 152 Buildings", 14, y);

  y += 8;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("1. Ten Scientific Corrections Implemented (Experiment 2 Quality Gate)", 14, y);
  y += 4;

  const corrections = [
    ["1. Pre-Test Selection", "Initial cohort (152 buildings: 82 lodging, 70 education) screened strictly on pre-intervention completeness. 9 test dropouts recorded as abstentions."],
    ["2. Power-Based MDE", "Replaced single-run binary detection with minimum detected simulated reduction and repeated synthetic null draws (50 draws)."],
    ["3. Matched Windows", "Matched calibration error windows to evaluation duration (6 months); explicitly documented K=1 independent calibration window constraint."],
    ["4. Hourly-First Simulation", "All synthetic interventions generated at hourly interval first, then aggregated via exact sum to daily and monthly."],
    ["5. Restricted Imputation", "Eliminated unrestricted forward/backward fills; restricted imputation to gaps <= 3 hours only."],
    ["6. Standardized Baselines", "Audited Ridge weather regression, Ridge calendar regression, and HistGradientBoostingRegressor with documented fallbacks."],
    ["7. Centered Synthetic Controls", "Ensured repeated synthetic null controls enforce zero-mean residuals (E[e] = 0) with block-resampling."],
    ["8. Evidence Classifications", "Replaced 'VERIFIED_AUDIT_GRADE' with EVIDENCE_SUPPORTS_ESTIMATE, ADDITIONAL_MEASUREMENT_REQUIRED, and INSUFFICIENT_EVIDENCE."],
    ["9. Benchmark Preservation", "Preserved exploratory benchmark in outputs/exploratory_benchmark/ without overwriting."],
    ["10. Updated Claim Ledger", "Formally distinguished experimentally observed results from real-world operational boundaries."],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Correction Item", "Implementation Details & Scientific Impact"]],
    body: corrections,
    theme: "striped",
    headStyles: { fillColor: [36, 92, 67], fontSize: 7.5 },
    bodyStyles: { fontSize: 7, textColor: [24, 33, 28] },
    columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  // Page 2: Resolution Benchmarks & Mathematical Formulas
  doc.addPage();
  doc.setFillColor(36, 92, 67);
  doc.rect(0, 0, pageWidth, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("ENERPROOF TECHNICAL VALIDATION — MATHEMATICAL FORMULATION", 14, 7);

  y = 18;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("2. Authoritative Resolution Comparison Benchmarks", 14, y);
  y += 4;

  const resRows = [
    ["Hourly Interval", "Ridge Weather", "8.37%", "6.98%", "28.67%", "UNESTABLISHED (FPR > 5%)", "FAIL_BOTH_CONTROLS"],
    ["Daily Interval", "Ridge Weather", "11.80%", "4.21% (<= 5%)", "22.38%", "83.9% @ 15% (Unest.)", "PASS_SYNTH_FAIL_PLACEBO"],
    ["Monthly Bill", "Ridge Weather", "13.64%", "6.81%", "18.18%", "UNESTABLISHED (FPR > 5%)", "FAIL_BOTH_CONTROLS"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Resolution", "Recommended Model", "Threshold", "Synth FPR", "Placebo FAR", "Cohort MDE", "Quality Gate"]],
    body: resRows,
    theme: "striped",
    headStyles: { fillColor: [36, 92, 67], fontSize: 7 },
    bodyStyles: { fontSize: 7, textColor: [24, 33, 28] },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("3. Mathematical Formulations & Uncertainty Bounds", 14, y);
  y += 4;

  const mathBoxes = [
    ["ASHRAE Guideline 14 Annex B Fractional Savings Uncertainty (FSU):", "FSU = t_(alpha/2, df) * (CV(RMSE) / s) * sqrt[ (1/m + 1/n) * (1 + r1) / (1 - r1) ]\nAcceptance Limit: FSU <= 50.0% at 95% confidence."],
    ["Degree-Day Baseline Weather Normalization:", "E_pred = beta_0 + beta_HDD * HDD + beta_CDD * CDD + beta_occ * Occupancy\nBalance point: 18.33°C (65°F). Compliant if CV(RMSE) <= 25% (daily) / <= 15% (monthly)."],
    ["Portfolio Aggregation with Cross-Building Correlation (rho = 0.33):", "sigma_portfolio = sigma * sqrt[ (1 + (K - 1) * rho) / K ]\nAs K -> infinity, noise floor asymptotes to sigma * sqrt(rho), preventing naive 1/sqrt(K) under-estimation."],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Formulation Dimension", "Governing Equation & Acceptance Criteria"]],
    body: mathBoxes,
    theme: "plain",
    headStyles: { fillColor: [231, 241, 234], textColor: [21, 60, 45], fontSize: 7.5 },
    bodyStyles: { fontSize: 7, textColor: [24, 33, 28] },
    columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  // Page 3: Baku Higher Oil School Case Study
  doc.addPage();
  doc.setFillColor(36, 92, 67);
  doc.rect(0, 0, pageWidth, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("ENERPROOF TECHNICAL VALIDATION — BHOS PUBLIC AUDIT CASE", 14, 7);

  y = 18;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("4. Baku Higher Oil School (BHOS) Energy Data Audit Case", 14, y);
  y += 4;

  const bhosAuditData = [
    ["Gate 1: Temporal Independence", "REJECTED: 36 of 36 monthly readings in 2024 duplicate 2023 values identically (100% duplicate rate)."],
    ["Gate 2: Emissions Arithmetic", "REJECTED: Calculated emissions from 995,575 kWh @ 0.5 kg/kWh = 497.79 metric tonnes; published claim is 4,978 tonnes (10x error flag)."],
    ["Gate 3: Spatial Disaggregation", "REJECTED: Whole-campus bulk meter only; unmetered student dormitories hide actual living-quarters efficiency."],
    ["Boiler Fuel Seasonality", "79.86% of annual boiler gas consumed during 5 heating months (Nov-Mar), totaling 602,889 m3/year."],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Audit Gate", "Public Record Audit Findings"]],
    body: bhosAuditData,
    theme: "striped",
    headStyles: { fillColor: [183, 71, 64], fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Scope & Limitations
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("5. Scope, Boundary Conditions & Regulatory Disclaimer", 14, y);
  y += 4;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  const disclaimerFull =
    "EnerProof is designed as an analytical decision-support engine under modeled counterfactual baselines (ASHRAE Guideline 14 Annex B / IPMVP). " +
    "Assessments do not constitute statutory audit certification, formal regulatory endorsement, or legal proof of causal attribution without on-site engineering commissioning. " +
    "Subsidized electricity tariffs in Azerbaijan (0.125 AZN/kWh default) require integrating performance contracting with the State Energy Efficiency Fund.";
  const splitText = doc.splitTextToSize(disclaimerFull, pageWidth - 28);
  doc.text(splitText, 14, y);

  const pdfPath = path.join(outDir, "02_EnerProof_Technical_Validation.pdf");
  fs.writeFileSync(pdfPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Saved:", pdfPath);
}

function generateWalkthroughPdf(outDir) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(36, 92, 67);
  doc.rect(0, 0, pageWidth, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ENERPROOF — DEMO WALKTHROUGH FOR COMPETITION JUDGES", 14, 9);
  doc.setFont("helvetica", "normal");
  doc.text("CECECO Clean Energy Hackathon 2027", pageWidth - 14, 9, { align: "right" });

  let y = 22;
  doc.setTextColor(24, 33, 28);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Step-by-Step Evaluation Walkthrough", 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(104, 115, 108);
  doc.text("Direct link: https://enerproof.vercel.app/demo | No login or setup required", 14, y);

  y += 8;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  const walkthroughs = [
    [
      "Demo Track A: Public Data Audit\n(Baku Higher Oil School)",
      "1. Navigate to: https://enerproof.vercel.app/app/audit?demo=bhos\n" +
      "2. The 36-month public dataset is parsed automatically in memory.\n" +
      "3. Observe Gate 1: 100% duplicate rate flagged (36 of 36 values match 2023).\n" +
      "4. Observe Gate 2: 10x arithmetic error flagged (497.79 t calculated vs 4,978 t reported).\n" +
      "5. Inspect the monthly table showing identical 2023 vs 2024 columns.",
    ],
    [
      "Demo Track B: Student Residence Retrofit\n(500-Occupant Dormitory)",
      "1. Navigate to: https://enerproof.vercel.app/app/interventions?demo=residence\n" +
      "2. Review the 5 active ECM calculators (LED, HVAC, plug load, thermal water, boiler).\n" +
      "3. Adjust the electricity tariff (e.g. test 0.150 AZN/kWh) and watch payback recompute.\n" +
      "4. Click 'M&V Plan' to view IPMVP Option B boundary and sensor specifications.\n" +
      "5. Click 'Evidence Gate' to verify apparent savings (15.2%) clear the 11.8% threshold.\n" +
      "6. Click 'Export PDF Report' to generate the investment-grade audit package.",
    ],
    [
      "Demo Track C: Building Energy Research Lab\n(152 BDG2 Buildings)",
      "1. Navigate to: https://enerproof.vercel.app/app/portfolio?demo=research\n" +
      "2. Adjust the building count slider from K=1 to K=50.\n" +
      "3. Observe detection power rise to 82.0% at K=20 and 98.0% at K=50.\n" +
      "4. Inspect the asymptotic noise floor (rho = 0.33) comparing empirical vs naive 1/sqrt(K).\n" +
      "5. Visit /research to inspect the 10 generated empirical research figures.",
    ],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Demonstration Track", "Step-by-Step Judge Evaluation Protocol"]],
    body: walkthroughs,
    theme: "striped",
    headStyles: { fillColor: [36, 92, 67], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [24, 33, 28] },
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 10;

  doc.setFillColor(231, 241, 234);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 60, 45);
  doc.text("Judges' Direct Contact & Support:", 18, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(24, 33, 28);
  doc.text("Founder: Fizuli Hasanov | GitHub: https://github.com/fizuli20/enerproof", 18, y + 12);
  doc.text("Competition: CECECO Clean Energy Hackathon 2027 (Bringing Clean Energy to Everyday Life)", 18, y + 17);

  const pdfPath = path.join(outDir, "03_EnerProof_Demo_Walkthrough.pdf");
  fs.writeFileSync(pdfPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Saved:", pdfPath);
}

function generateLinksTxt(outDir) {
  const content = `================================================================================
ENERPROOF — CECECO CLEAN ENERGY HACKATHON 2027 SUBMISSION LINKS
================================================================================

Project Name: EnerProof
Tagline: Energy efficiency you can prove.
Track: Bringing Clean Energy to Everyday Life
Competition: CECECO Clean Energy Hackathon 2027
Official Competition URL: https://www.cececo.org/projects/cececo-clean-energy-hackathon-2027
Founder: Fizuli Hasanov
GitHub Account: https://github.com/fizuli20
GitHub Repository: https://github.com/fizuli20/enerproof

--------------------------------------------------------------------------------
PRODUCTION DEPLOYMENT & LIVE ACCESS (NO AUTH REQUIRED FOR JUDGES)
--------------------------------------------------------------------------------
Primary Production URL: https://enerproof.vercel.app
Vercel Production Deployment: https://enerproof-5mx4r545r-fizuli20s-projects.vercel.app

--------------------------------------------------------------------------------
INTERACTIVE DEMONSTRATION TRACKS
--------------------------------------------------------------------------------
Demo Hub:
https://enerproof.vercel.app/demo

Demo Track A — Baku Higher Oil School (BHOS) Energy Data Audit:
https://enerproof.vercel.app/app/audit?demo=bhos

Demo Track B — Student Residence Deep Retrofit & M&V:
https://enerproof.vercel.app/app/interventions?demo=residence

Demo Track C — Building Energy Research Lab & Portfolio Pooling:
https://enerproof.vercel.app/app/portfolio?demo=research

--------------------------------------------------------------------------------
DOCUMENTATION & METHODOLOGY PAGES
--------------------------------------------------------------------------------
Scientific Research Dossier & Figure Gallery:
https://enerproof.vercel.app/research

Mathematical Methodology & ASHRAE 14 Annex B:
https://enerproof.vercel.app/methodology

About & Founder Motivation:
https://enerproof.vercel.app/about

Client-Side Privacy Policy:
https://enerproof.vercel.app/privacy

================================================================================
`;
  const filePath = path.join(outDir, "04_EnerProof_Submission_Links.txt");
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Saved:", filePath);
}

function generateChecklistMd(outDir) {
  const content = `# EnerProof: CECECO Clean Energy Hackathon 2027 Final Submission Checklist

**Project Name:** EnerProof  
**Tagline:** Energy efficiency you can prove.  
**Track:** Bringing Clean Energy to Everyday Life  
**Founder:** Fizuli Hasanov  
**Production URL:** [https://enerproof.vercel.app](https://enerproof.vercel.app)  
**GitHub Repository:** [https://github.com/fizuli20/enerproof](https://github.com/fizuli20/enerproof)  

---

## 1. Product Development & Engineering Verification

- [x] **Next.js 16 (App Router) + TypeScript + Tailwind CSS** production codebase in separate isolated repository \`enerproof\`.
- [x] **Design Tokens & Brand:** Implemented exact design system (\`#F8F9F7\` background, \`#245C43\` primary green, \`#18211C\` text, \`#DFE5E0\` borders).
- [x] **Zero Server Storage / Full Client Privacy:** CSV uploads and degree-day regressions run entirely in browser memory.
- [x] **Automated Unit Testing:** 19/19 Vitest unit tests passing cleanly in 114ms (\`npm test\`).
- [x] **Production Build:** Static page generation (17/17 routes) compiled without errors (\`npm run build\`).

---

## 2. Scientific & Statistical Integrity Gate

- [x] **Pre-Test Cohort Screening:** 152 buildings (82 lodging, 70 education) from BDG2 screened without test-period peaking.
- [x] **Evaluation Abstentions:** 9 test-period dropouts recorded as abstentions (\`outputs/metrics/cohort_abstentions.csv\`).
- [x] **Hourly-First Simulation:** Interventions applied at hourly resolution, aggregated via exact mathematical sums to daily and monthly.
- [x] **Restricted Imputation:** Replaced unrestricted forward/backward fills with strict $\\le 3$h imputation.
- [x] **Standardized Baselines:** Implemented Ridge weather regression and HistGradientBoostingRegressor with documented monthly fallbacks.
- [x] **Repeated Synthetic Controls:** 50 repeated draws with centered residuals ($\\mathbb{E}[e] = 0$).
- [x] **Empirical Power & Detection Rates:** Evaluated simulated reductions; achieved 83.9% detection at 15% simulated savings under synthetic null (real-world MDE unestablished due to historical placebo alarms > 5%).
- [x] **Deterministic Evidence Gate:** Evaluates apparent savings against empirical noise floors and ASHRAE Guideline 14 Annex B Fractional Savings Uncertainty ($FSU \\le 50\\%$), issuing:
  - \`EVIDENCE_SUPPORTS_ESTIMATE\`
  - \`ADDITIONAL_MEASUREMENT_REQUIRED\`
  - \`INSUFFICIENT_EVIDENCE\`
- [x] **Cross-Building Residual Correlation:** Accounted for intra-site correlation ($\\rho = 0.33$) in ESCO portfolio noise pooling.
- [x] **Transparent Disclaimers:** Every report and UI screen includes the required notice: *"Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution."*

---

## 3. Demonstration Tracks

- [x] **Demo Track A: Baku Higher Oil School Public Filing Audit**
  - Gate 1: Detects 100% duplicate monthly readings across 2023–2024 (36 of 36 values).
  - Gate 2: Flags exact 10x GHG calculation discrepancy (497.79 t calculated vs ~4,978 t reported).
  - Gate 3: Flags bulk campus boundary meter and lack of dormitory submetering.
- [x] **Demo Track B: Student Residence Deep Energy Retrofit**
  - 5 interactive ECM calculators: LED lighting, HVAC night setback, plug load cutoffs, solar thermal hot water, boiler optimization.
  - Interactive Azerbaijan utility tariffs (default: 0.125 AZN/kWh).
  - Client-side investment-grade PDF export.
- [x] **Demo Track C: Building Energy Research Lab**
  - Interactive portfolio pooling from $K=1$ to $K=50$ buildings.
  - Empirical detection power curves vs simulated savings.
  - 10 research figures gallery.

---

## 4. Deployment & Submission Assets

- [x] **GitHub Repository:** Publicly available at [https://github.com/fizuli20/enerproof](https://github.com/fizuli20/enerproof) under account \`fizuli20\`.
- [x] **Vercel Production Deployment:** Live at [https://enerproof.vercel.app](https://enerproof.vercel.app) with HTTP/2 200 response.
- [x] **Submission Package (\`submission/\`):**
  - \`01_EnerProof_Prototype_and_Demo_Access.pdf\` (1-page quick start with scannable QR code)
  - \`02_EnerProof_Technical_Validation.pdf\` (comprehensive multi-page research dossier)
  - \`03_EnerProof_Demo_Walkthrough.pdf\` (step-by-step judge walkthrough)
  - \`04_EnerProof_Submission_Links.txt\` (plain-text competition links)
  - \`05_EnerProof_Final_Submission_Checklist.md\` (this audit checklist)
`;
  const filePath = path.join(outDir, "05_EnerProof_Final_Submission_Checklist.md");
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Saved:", filePath);
}

generateSubmissionPackage().catch((err) => {
  console.error(err);
  process.exit(1);
});
