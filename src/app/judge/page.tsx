"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProject } from "@/lib/store/project-context";
import {
  calculateLightingRetrofit,
  LightingInput,
} from "@/lib/interventions/calculators";
import { generateMeasurementPlan } from "@/lib/measurement/planner";
import {
  evaluateEvidenceGate,
  BuildingSpecificGateInput,
} from "@/lib/evidence/evidence-gate";
import { generateEnerProofReport } from "@/lib/reports/pdf-generator";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  Sliders,
  Ruler,
  FileSearch,
  Building2,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function JudgeExperiencePage() {
  const { project, updateTariffs, loadDemoProject } = useProject();
  const [activeTab, setActiveTab] = useState<"demo_a" | "demo_b" | "demo_c">("demo_b");

  // =========================================================================
  // DEMO B STATE: INTERACTIVE LED RETROFIT FOR JUDGES
  // =========================================================================
  const [fixtureCount, setFixtureCount] = useState<number>(500);
  const [hoursPerDay, setHoursPerDay] = useState<number>(12);
  const [baselineWatts, setBaselineWatts] = useState<number>(64);
  const [retrofitWatts, setRetrofitWatts] = useState<number>(24);
  const [tariff, setTariff] = useState<number>(0.125);
  const [triggerNegativeCase, setTriggerNegativeCase] = useState<boolean>(false);

  // Calculate LED ECM
  const ledResult = calculateLightingRetrofit({
    fixtureCount,
    baselineWattsPerFixture: baselineWatts,
    retrofitWattsPerFixture: retrofitWatts,
    operatingHoursPerDay: hoursPerDay,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: 35,
    tariffPerKwh: tariff,
    emissionsFactorKgPerKwh: 0.5,
  });

  // Calculate Measurement Plan (IPMVP Option A)
  const measurementPlan = generateMeasurementPlan({
    category: "lighting",
    expectedSavingsPct: 15.0,
    baselineCvRmsePct: 9.8,
    resolution: "daily",
    hasSubmetering: true,
  });

  // Evidence Gate Evaluation: Test negative vs positive case
  const evidenceAssessment = evaluateEvidenceGate({
    context: triggerNegativeCase
      ? "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C"
      : "EQUIPMENT_ISOLATION_OPTION_A_B",
    apparentSavingsKwh: triggerNegativeCase ? 8000 : ledResult.annualKwhSavings,
    baselineEnergyKwh: 300000,
    reportingObservations: triggerNegativeCase ? 14 : 180, // 14 days causes refusal/extension
    dataQuality: {
      totalRows: 180,
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
    baselineModel: triggerNegativeCase
      ? {
          coefficients: { intercept: 1200, hddCoeff: 35, cddCoeff: 50, occCoeff: null },
          hasOccupancyFeature: false,
          trainingDiagnostics: { r2: 0.88, rmse: 120, cvRmsePct: 12.0, nmbePct: 1.2, sampleCount: 180 },
          calibrationDiagnostics: {
            r2: 0.82,
            rmse: 140,
            cvRmsePct: 14.5,
            nmbePct: 2.1,
            sampleCount: 30,
            r1Autocorr: 0.35,
          },
          screeningStatus: "MEETS_SCREENING_CRITERIA",
          screeningNotes: [],
          trainSampleSize: 180,
          calibSampleSize: 30,
          hasNegativePredictions: false,
        }
      : null,
  });

  const handleDownloadReport = () => {
    const doc = generateEnerProofReport(project, "comprehensive");
    doc.save("EnerProof_Judge_Evaluation_Report.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] text-xs font-semibold text-[#153C2D]">
            <Sparkles className="w-3.5 h-3.5 text-[#245C43]" />
            Official Competition Review • CECECO Clean Energy Hackathon 2027
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211C] tracking-tight">
            Explore EnerProof in 3 Minutes
          </h1>
          <p className="text-sm sm:text-base text-[#68736C] leading-relaxed">
            Welcome, Hackathon Judges. This page provides zero-friction, direct evaluation of EnerProof’s three core capabilities: real data provenance auditing, interactive clean energy intervention engineering, and empirical research validation.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-[#DFE5E0] space-x-2">
          <button
            onClick={() => setActiveTab("demo_b")}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === "demo_b"
                ? "border-[#245C43] text-[#245C43]"
                : "border-transparent text-[#68736C] hover:text-[#18211C]"
            }`}
          >
            Demo B: Practical Clean Energy Retrofit (Main Demo)
          </button>
          <button
            onClick={() => setActiveTab("demo_a")}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === "demo_a"
                ? "border-[#245C43] text-[#245C43]"
                : "border-transparent text-[#68736C] hover:text-[#18211C]"
            }`}
          >
            Demo A: Real Azerbaijani Energy Data Audit (BHOS Case)
          </button>
          <button
            onClick={() => setActiveTab("demo_c")}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === "demo_c"
                ? "border-[#245C43] text-[#245C43]"
                : "border-transparent text-[#68736C] hover:text-[#18211C]"
            }`}
          >
            Demo C: Scientific Research & Portfolio Noise Floor
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB B: PRACTICAL CLEAN ENERGY INTERVENTION (MAIN JUDGE DEMO)       */}
        {/* =================================================================== */}
        {activeTab === "demo_b" && (
          <div className="space-y-6">
            <div className="card-base p-6 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DFE5E0]">
                <div>
                  <span className="badge-green text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    Interactive Walkthrough
                  </span>
                  <h2 className="text-lg font-bold text-[#18211C] mt-1">
                    Student Residence LED Lighting Retrofit & M&V Plan
                  </h2>
                  <p className="text-xs text-[#68736C]">
                    Simulate real-time equipment retrofits on a 500-occupant university dormitory in Baku.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFixtureCount(500);
                      setHoursPerDay(12);
                      setTariff(0.125);
                      setTriggerNegativeCase(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DFE5E0] bg-[#F8F9F7] text-xs font-medium text-[#18211C] hover:bg-black/5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#68736C]" />
                    Reset Inputs
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export PDF Report
                  </button>
                </div>
              </div>

              {/* Step 1 & 2: Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#18211C] mb-1">
                    1. Fixture Count (Units):
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={fixtureCount}
                    onChange={(e) => setFixtureCount(parseInt(e.target.value) || 100)}
                    className="w-full accent-[#245C43]"
                  />
                  <div className="flex justify-between font-mono text-[11px] text-[#68736C] mt-1">
                    <span>100</span>
                    <span className="font-bold text-[#245C43]">{fixtureCount} fixtures</span>
                    <span>1,500</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#18211C] mb-1">
                    2. Operating Runtime:
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 4)}
                    className="w-full accent-[#245C43]"
                  />
                  <div className="flex justify-between font-mono text-[11px] text-[#68736C] mt-1">
                    <span>4 hrs</span>
                    <span className="font-bold text-[#245C43]">{hoursPerDay} hrs/day</span>
                    <span>24 hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#18211C] mb-1">
                    3. Electricity Tariff:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.005"
                      min="0.05"
                      max="0.40"
                      value={tariff}
                      onChange={(e) => setTariff(parseFloat(e.target.value) || 0.125)}
                      className="w-24 p-1.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                    <span className="text-[11px] text-[#68736C]">AZN/kWh</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#18211C] mb-1">
                    4. Evidence Scenario:
                  </label>
                  <button
                    onClick={() => setTriggerNegativeCase(!triggerNegativeCase)}
                    className={`w-full p-1.5 rounded text-xs font-semibold border transition-colors ${
                      triggerNegativeCase
                        ? "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                        : "bg-[#E7F1EA] text-[#153C2D] border-[#B8DAC4]"
                    }`}
                  >
                    {triggerNegativeCase ? "Scenario: Insufficient Data" : "Scenario: Valid Equipment Isolation"}
                  </button>
                  <span className="block text-[10px] text-[#68736C] mt-1">
                    Toggle to see Evidence Gate refusal
                  </span>
                </div>
              </div>

              {/* Calculated Outputs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#DFE5E0]">
                <div className="card-base p-3 bg-[#F8F9F7]">
                  <span className="text-[11px] text-[#68736C]">Annual Energy Saved</span>
                  <div className="text-xl font-bold font-mono text-[#245C43] mt-0.5">
                    {ledResult.annualKwhSavings.toLocaleString()} kWh/yr
                  </div>
                </div>

                <div className="card-base p-3 bg-[#F8F9F7]">
                  <span className="text-[11px] text-[#68736C]">Total Implementation Cost</span>
                  <div className="text-xl font-bold font-mono text-[#18211C] mt-0.5">
                    {ledResult.totalInitialInvestmentAzn.toLocaleString()} AZN
                  </div>
                </div>

                <div className="card-base p-3 bg-[#F8F9F7]">
                  <span className="text-[11px] text-[#68736C]">Annual Net Financial Savings</span>
                  <div className="text-xl font-bold font-mono text-[#245C43] mt-0.5">
                    {ledResult.annualNetSavingsAzn.toLocaleString()} AZN/yr
                  </div>
                </div>

                <div className="card-base p-3 bg-[#F8F9F7]">
                  <span className="text-[11px] text-[#68736C]">Simple Payback Period</span>
                  <div className="text-xl font-bold font-mono text-[#18211C] mt-0.5">
                    {ledResult.simplePaybackYears !== null
                      ? `${ledResult.simplePaybackYears.toFixed(1)} yrs`
                      : "No positive payback"}
                  </div>
                </div>
              </div>
            </div>

            {/* M&V Plan & Evidence Gate Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Measurement Plan Card */}
              <div className="card-base p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    5. M&V Plan ({measurementPlan.recommendedOption})
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#18211C]">
                  {measurementPlan.optionTitle}
                </h3>
                <p className="text-xs text-[#68736C] leading-relaxed">
                  {measurementPlan.rationale}
                </p>
                <div className="p-3 rounded bg-[#F8F9F7] border border-[#DFE5E0] text-xs space-y-1 text-[#18211C]">
                  <div><strong>Boundary:</strong> {measurementPlan.meteringBoundary}</div>
                  <div><strong>Logging:</strong> {measurementPlan.loggingIntervalMinutes} min intervals for {measurementPlan.minimumRecommendedDurationDays} days</div>
                  <div><strong>Target FSU:</strong> &le; {measurementPlan.expectedFsuPct.toFixed(1)}% (ASHRAE Guideline 14 tolerance)</div>
                </div>
              </div>

              {/* Evidence Gate Card */}
              <div
                className={`card-base p-5 space-y-3 border-l-4 ${
                  evidenceAssessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                    ? "border-l-[#245C43]"
                    : "border-l-[#A66A16]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                      evidenceAssessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                        ? "badge-green"
                        : "badge-amber"
                    }`}
                  >
                    6. Evidence Gate Determination
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#18211C]">
                  {evidenceAssessment.classification}
                </h3>
                <div className="text-xs text-[#68736C] space-y-1">
                  {evidenceAssessment.rationale.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[#245C43] font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded bg-[#F8F9F7] border border-[#DFE5E0] text-[11px] text-[#68736C]">
                  {evidenceAssessment.disclaimer}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB A: REAL AZERBAIJANI DATA AUDIT (BHOS CASE)                     */}
        {/* =================================================================== */}
        {activeTab === "demo_a" && (
          <div className="space-y-6">
            <div className="card-base p-6 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DFE5E0]">
                <div>
                  <span className="badge-red text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    Public Filing Provenance Audit
                  </span>
                  <h2 className="text-lg font-bold text-[#18211C] mt-1">
                    Baku Higher Oil School (BHOS) 3-Year Public Energy Audit
                  </h2>
                  <p className="text-xs text-[#68736C]">
                    Demonstrates automated detection of duplicate data and arithmetic discrepancies on public reports.
                  </p>
                </div>
                <Link
                  href="/app/audit?demo=bhos"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm"
                >
                  Open Full Audit Module
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* 10x Error Callout */}
                <div className="p-4 rounded-lg bg-[#FEE2E2]/30 border border-[#FECACA] space-y-2">
                  <div className="font-bold text-[#991B1B] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Finding 1: Exact 10x Arithmetic Error in Published GHG Emissions
                  </div>
                  <p className="text-[#18211C] leading-relaxed">
                    The published 2022 BHOS report states combined electricity of <strong>995,575 kWh</strong> with an applied factor of <strong>0.5 kg CO₂/kWh</strong>, claiming <strong>~4,978 metric tonnes CO₂</strong>.
                  </p>
                  <div className="p-2.5 bg-white rounded border border-[#FECACA] font-mono text-[#991B1B]">
                    Calculated: 995,575 kWh &times; 0.5 kg/kWh &divide; 1,000 = <strong>497.79 metric tonnes</strong>.
                    <br />
                    Discrepancy: Exactly 10.0x arithmetic scaling error.
                  </div>
                </div>

                {/* Duplication Callout */}
                <div className="p-4 rounded-lg bg-[#FEF3C7]/40 border border-[#FDE68A] space-y-2">
                  <div className="font-bold text-[#92400E] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Finding 2: 100% Identical Duplicate Monthly Profile in 2024
                  </div>
                  <p className="text-[#18211C] leading-relaxed">
                    Across all 3 reported utility series (campus electricity, Khatai electricity, and boiler natural gas), all <strong>36 out of 36 monthly records</strong> in the 2024 report duplicate 2023 figures identically.
                  </p>
                  <div className="p-2.5 bg-white rounded border border-[#FDE68A] font-mono text-[#92400E]">
                    Gate 1: Temporal Independence &rarr; REJECT (Duplicate Rate: 100%).
                    <br />
                    Proves copy-forward reporting artifact rather than true operational constancy.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9F7] rounded border border-[#DFE5E0] text-[11px] text-[#68736C] leading-relaxed">
                <strong>Neutral Factual Notice:</strong> This audit demonstrates automated algorithmic screening of public sustainability disclosures. It does not infer intentional misconduct or administrative fault, and does not claim an official partnership with BHOS.
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB C: SCIENTIFIC RESEARCH & NOISE FLOOR                           */}
        {/* =================================================================== */}
        {activeTab === "demo_c" && (
          <div className="space-y-6">
            <div className="card-base p-6 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DFE5E0]">
                <div>
                  <span className="badge-blue text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    152-Building Empirical Research
                  </span>
                  <h2 className="text-lg font-bold text-[#18211C] mt-1">
                    Building Data Genome 2 (BDG2) Research Insights
                  </h2>
                  <p className="text-xs text-[#68736C]">
                    Scientific power modeling, resolution trade-offs, and portfolio pooling limitations.
                  </p>
                </div>
                <Link
                  href="/research"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm"
                >
                  View Full Research Dossier
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="card-base p-4 bg-[#F8F9F7] space-y-1.5">
                  <div className="font-bold text-[#18211C]">1. Cohort Provenance</div>
                  <p className="text-[#68736C]">
                    Exploratory benchmark evaluated 149 buildings (59 dormitories). Corrected Experiment 2 screened 152 buildings (82 lodging, 70 education) with 9 dropouts recorded as abstentions (143 completed).
                  </p>
                </div>

                <div className="card-base p-4 bg-[#F8F9F7] space-y-1.5">
                  <div className="font-bold text-[#18211C]">2. Single Building MDE</div>
                  <p className="text-[#68736C]">
                    Empirical power for detecting a 5% saving in single buildings is only ~24.7% (daily) and ~23.8% (hourly). Universal claims of 5% MDE are scientifically unsupported.
                  </p>
                </div>

                <div className="card-base p-4 bg-[#F8F9F7] space-y-1.5">
                  <div className="font-bold text-[#18211C]">3. The Correlation Floor</div>
                  <p className="text-[#68736C]">
                    Shared campus weather and calendars create intra-site residual correlation (&rho; &asymp; 0.33). Portfolio noise does not reach zero as 1/&radic;K, but asymptotes to &sigma;&radic;&rho;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Route to Full Workspace */}
        <div className="card-base p-6 bg-gradient-to-r from-white to-[#E7F1EA]/30 border-l-4 border-l-[#245C43] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-[#18211C]">
              Ready to explore the complete multi-building application?
            </h3>
            <p className="text-xs text-[#68736C]">
              Access the full 7-step connected workspace with CSV drag-and-drop, regression fitting, and custom project management.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm shrink-0"
          >
            Launch Full Platform Workspace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
