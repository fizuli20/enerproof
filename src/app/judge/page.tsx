"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProject } from "@/lib/store/project-context";
import {
  calculateLightingRetrofit,
  calculateHvacScheduling,
  calculatePlugLoad,
} from "@/lib/interventions/calculators";
import { generateMeasurementPlan } from "@/lib/measurement/planner";
import { evaluateEvidenceGate } from "@/lib/evidence/evidence-gate";
import { generateEnerProofReport } from "@/lib/reports/pdf-generator";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  Lightbulb,
  Fan,
  Power,
  Sliders,
  Ruler,
  FileText,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Check,
  Info,
} from "lucide-react";

export default function JudgeExperiencePage() {
  const { project } = useProject();

  // Guided Step State: 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Intervention Selection (Step 2)
  const [selectedEcm, setSelectedEcm] = useState<"lighting" | "hvac" | "plug">("lighting");

  // Lighting Parameters
  const [fixtureCount, setFixtureCount] = useState<number>(500);
  const [hoursPerDay, setHoursPerDay] = useState<number>(12);
  const [baselineWatts, setBaselineWatts] = useState<number>(64);
  const [retrofitWatts, setRetrofitWatts] = useState<number>(24);
  const [tariff, setTariff] = useState<number>(0.125);
  const [costPerFixture, setCostPerFixture] = useState<number>(35);

  // HVAC Parameters
  const [coolingKw, setCoolingKw] = useState<number>(120);
  const [runtimeHoursWeek, setRuntimeHoursWeek] = useState<number>(70);
  const [optimizedHoursWeek, setOptimizedHoursWeek] = useState<number>(45);

  // Measurement Scenario Toggle (Step 4)
  // "complete" = isolated circuit logging with spot check -> supported
  // "insufficient" = 14-day whole-building counterfactual with high FSU -> additional measurement required
  const [measurementScenario, setMeasurementScenario] = useState<"complete" | "insufficient">("complete");

  // Calculations
  const lightingResult = calculateLightingRetrofit({
    fixtureCount,
    baselineWattsPerFixture: baselineWatts,
    retrofitWattsPerFixture: retrofitWatts,
    operatingHoursPerDay: hoursPerDay,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: costPerFixture,
    tariffPerKwh: tariff,
    emissionsFactorKgPerKwh: 0.5,
  });

  const hvacResult = calculateHvacScheduling({
    coolingCapacityKw: coolingKw,
    baselineRuntimeHoursWeek: runtimeHoursWeek,
    optimizedRuntimeHoursWeek: optimizedHoursWeek,
    operatingWeeksYear: 26,
    averageLoadFactor: 0.7,
    implementationCostAzn: 4500,
    tariffPerKwh: tariff,
    comfortVentilationConfirmed: true,
  });

  const plugResult = calculatePlugLoad({
    workstationCount: 250,
    baselineIdleWatts: 25,
    smartPlugIdleWatts: 5,
    idleHoursPerDay: 12,
    idleDaysPerYear: 300,
    smartPlugCostPerUnitAzn: 25,
    tariffPerKwh: tariff,
  });

  // Active results based on chosen ECM
  const activeEcmResult =
    selectedEcm === "lighting"
      ? {
          title: "LED Lighting & Motion Sensors",
          annualKwh: lightingResult.annualKwhSavings,
          annualAzn: lightingResult.annualNetSavingsAzn,
          investmentAzn: lightingResult.totalInitialInvestmentAzn,
          paybackYears: lightingResult.simplePaybackYears,
          category: "lighting" as const,
        }
      : selectedEcm === "hvac"
      ? {
          title: "HVAC Scheduling & Night Setback",
          annualKwh: hvacResult.annualKwhSavings,
          annualAzn: hvacResult.annualNetSavingsAzn,
          investmentAzn: hvacResult.totalInitialInvestmentAzn,
          paybackYears: hvacResult.simplePaybackYears,
          category: "hvac" as const,
        }
      : {
          title: "Standby Plug Load Power Timers",
          annualKwh: plugResult.annualKwhSavings,
          annualAzn: plugResult.annualNetSavingsAzn,
          investmentAzn: plugResult.totalInitialInvestmentAzn,
          paybackYears: plugResult.simplePaybackYears,
          category: "plug_load" as const,
        };

  // Measurement Plan
  const measurementPlan = generateMeasurementPlan({
    category: activeEcmResult.category,
    expectedSavingsPct: 15.0,
    baselineCvRmsePct: 11.5,
    resolution: "daily",
    hasSubmetering: measurementScenario === "complete",
  });

  // Genuine Evidence Gate Evaluation
  const isInsufficient = measurementScenario === "insufficient";
  const evidenceAssessment = evaluateEvidenceGate({
    context: isInsufficient
      ? "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C"
      : "EQUIPMENT_ISOLATION_OPTION_A_B",
    apparentSavingsKwh: isInsufficient ? 8000 : activeEcmResult.annualKwh,
    baselineEnergyKwh: 300000,
    reportingObservations: isInsufficient ? 14 : 180,
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
    baselineModel: isInsufficient
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

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedEcm("lighting");
    setFixtureCount(500);
    setHoursPerDay(12);
    setBaselineWatts(64);
    setRetrofitWatts(24);
    setTariff(0.125);
    setCostPerFixture(35);
    setMeasurementScenario("complete");
  };

  // Step titles & descriptions
  const stepTitles = [
    { num: 1, label: "Meet the Building" },
    { num: 2, label: "Choose Improvement" },
    { num: 3, label: "Potential Impact" },
    { num: 4, label: "Measurement Plan" },
    { num: 5, label: "Evidence Verdict" },
    { num: 6, label: "Research Deep Dive" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F0] text-[#101C18]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE3DB]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D9FF91]" />
              Official Hackathon Evaluation &bull; 3-Minute Walkthrough
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#101C18] tracking-tight">
              Experience EnerProof in 3 minutes
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDE3DB] bg-white hover:bg-black/5 text-xs font-medium text-[#101C18] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#5D6D63]" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-lime text-xs font-semibold shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#101C18]" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker (Steps 1 to 6) */}
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-2">
            {stepTitles.map((s) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`text-left group transition-all`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isCurrent
                        ? "bg-[#152E27]"
                        : isPast
                        ? "bg-[#D9FF91] border border-[#152E27]/30"
                        : "bg-[#DDE3DB]"
                    }`}
                  />
                  <div className="hidden sm:block mt-1.5">
                    <span
                      className={`text-[11px] font-mono block ${
                        isCurrent ? "font-bold text-[#101C18]" : "text-[#5D6D63]"
                      }`}
                    >
                      {s.num}. {s.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* STEP 1: MEET THE BUILDING                                          */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="card-editorial p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Step 1 of 5 &bull; Facility Profile
              </span>
              <span className="text-xs text-[#5D6D63]">Illustrative Case Study</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F5F0] text-xs font-mono text-[#152E27]">
                  <Building className="w-4 h-4" />
                  Baku Student Residence Hall 1 &bull; Absheron Peninsula
                </div>

                <h2 className="text-2xl font-display font-bold text-[#101C18] tracking-tight">
                  A 500-occupant university dormitory with high lighting and cooling bills.
                </h2>

                <p className="text-sm text-[#5D6D63] leading-relaxed">
                  The facility operator wants to reduce annual utility expenditures by 5–15%, but has no centralized building automation system and cannot afford risky speculative retrofits.
                </p>

                <p className="text-sm text-[#5D6D63] leading-relaxed">
                  Before investing in capital hardware, the facility director needs to know: <em>Which improvement is worthwhile, how much will it actually save, and how can we prove the savings to our university leadership?</em>
                </p>
              </div>

              {/* Baseline Snapshot Card */}
              <div className="md:col-span-5 bg-[#152E27] text-white rounded-xl p-6 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-[#D9FF91] pb-2 border-b border-white/15">
                  Current Energy Profile
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-[#8EA094]">Facility Occupancy:</span>
                    <span className="font-mono font-bold text-white">500 students</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-[#8EA094]">Common Area Lights:</span>
                    <span className="font-mono font-bold text-white">500 fixtures (64W)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-[#8EA094]">Central Cooling:</span>
                    <span className="font-mono font-bold text-white">120 kW split-units</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-[#8EA094]">Electricity Tariff:</span>
                    <span className="font-mono font-bold text-[#D9FF91]">0.125 AZN/kWh</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8EA094]">Annual Electricity:</span>
                    <span className="font-mono font-bold text-white">~300,000 kWh/yr</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
              <span className="text-xs text-[#5D6D63]">
                * Clearly labeled as an illustrative university dormitory profile.
              </span>
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-lime text-sm py-2.5 px-5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <span>Find an energy-saving opportunity</span>
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: CHOOSE AN IMPROVEMENT                                      */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="card-editorial p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Step 2 of 5 &bull; Opportunity Selection
              </span>
              <span className="text-xs text-[#5D6D63]">Select an intervention</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-[#101C18] tracking-tight">
                Choose an improvement to evaluate.
              </h2>
              <p className="text-sm text-[#5D6D63]">
                EnerProof provides physically verified engineering models for standard commercial and educational building systems.
              </p>
            </div>

            {/* 3 Selectable Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Lighting (Default) */}
              <button
                onClick={() => setSelectedEcm("lighting")}
                className={`p-5 rounded-xl border text-left transition-all space-y-3 ${
                  selectedEcm === "lighting"
                    ? "border-[#152E27] bg-[#152E27]/5 ring-2 ring-[#152E27]"
                    : "border-[#DDE3DB] hover:border-[#152E27]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#152E27] text-[#D9FF91] flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  {selectedEcm === "lighting" && (
                    <span className="w-5 h-5 rounded-full bg-[#152E27] text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#101C18]">1. LED Lighting Upgrade</h3>
                  <p className="text-xs text-[#5D6D63] mt-1 leading-relaxed">
                    Replace 64W dual fluorescent fixtures with 24W sensor-equipped LED fixtures in common corridors.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#152E27] font-semibold pt-1">
                  Easiest to measure &bull; ~1.9 yr payback
                </div>
              </button>

              {/* Option 2: HVAC Scheduling */}
              <button
                onClick={() => setSelectedEcm("hvac")}
                className={`p-5 rounded-xl border text-left transition-all space-y-3 ${
                  selectedEcm === "hvac"
                    ? "border-[#152E27] bg-[#152E27]/5 ring-2 ring-[#152E27]"
                    : "border-[#DDE3DB] hover:border-[#152E27]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#152E27] text-[#D9FF91] flex items-center justify-center">
                    <Fan className="w-5 h-5" />
                  </div>
                  {selectedEcm === "hvac" && (
                    <span className="w-5 h-5 rounded-full bg-[#152E27] text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#101C18]">2. HVAC Scheduling Setback</h3>
                  <p className="text-xs text-[#5D6D63] mt-1 leading-relaxed">
                    Automate evening temperature setbacks across 120 kW cooling units while preserving dormitory ventilation.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#152E27] font-semibold pt-1">
                  High savings &bull; ~0.8 yr payback
                </div>
              </button>

              {/* Option 3: Plug Load Timers */}
              <button
                onClick={() => setSelectedEcm("plug")}
                className={`p-5 rounded-xl border text-left transition-all space-y-3 ${
                  selectedEcm === "plug"
                    ? "border-[#152E27] bg-[#152E27]/5 ring-2 ring-[#152E27]"
                    : "border-[#DDE3DB] hover:border-[#152E27]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#152E27] text-[#D9FF91] flex items-center justify-center">
                    <Power className="w-5 h-5" />
                  </div>
                  {selectedEcm === "plug" && (
                    <span className="w-5 h-5 rounded-full bg-[#152E27] text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#101C18]">3. Standby Plug Load Cutoff</h3>
                  <p className="text-xs text-[#5D6D63] mt-1 leading-relaxed">
                    Cut off 250 idle computer workstations and drinking fountains during unoccupied midnight hours (12h/day).
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#152E27] font-semibold pt-1">
                  Low capital &bull; ~1.3 yr payback
                </div>
              </button>
            </div>

            {/* Parameter Adjustment Panel for Selected ECM */}
            {selectedEcm === "lighting" && (
              <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-4">
                <div className="text-xs font-semibold text-[#101C18]">
                  Adjust Lighting Upgrade Assumptions:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[#5D6D63] mb-1">Fixture Count: {fixtureCount}</label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={fixtureCount}
                      onChange={(e) => setFixtureCount(parseInt(e.target.value))}
                      className="w-full accent-[#152E27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5D6D63] mb-1">Operating Hours: {hoursPerDay} hrs/day</label>
                    <input
                      type="range"
                      min="6"
                      max="24"
                      step="1"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                      className="w-full accent-[#152E27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5D6D63] mb-1">Tariff: {tariff} AZN/kWh</label>
                    <input
                      type="number"
                      step="0.005"
                      min="0.05"
                      max="0.30"
                      value={tariff}
                      onChange={(e) => setTariff(parseFloat(e.target.value) || 0.125)}
                      className="w-full p-1.5 rounded border border-[#DDE3DB] bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-outline-dark text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="btn-lime text-sm py-2.5 px-5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <span>Calculate potential impact</span>
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: SEE POTENTIAL IMPACT                                       */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="card-editorial p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Step 3 of 5 &bull; Financial &amp; Energy Impact
              </span>
              <span className="text-xs text-[#5D6D63]">{activeEcmResult.title}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-[#101C18] tracking-tight">
                Here is what this improvement could deliver.
              </h2>
              <p className="text-sm text-[#5D6D63]">
                Calculated using bounded engineering physics with full lifecycle cost accounting.
              </p>
            </div>

            {/* 4 Clean Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1">
                <span className="text-xs text-[#5D6D63]">Annual Electricity Saved</span>
                <div className="text-2xl font-display font-bold text-[#152E27] font-mono-num">
                  {activeEcmResult.annualKwh.toLocaleString()} <span className="text-xs font-normal">kWh</span>
                </div>
                <span className="text-[11px] text-[#5D6D63] block">Reduction in grid load</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1">
                <span className="text-xs text-[#5D6D63]">Annual Cost Savings</span>
                <div className="text-2xl font-display font-bold text-[#152E27] font-mono-num">
                  {activeEcmResult.annualAzn.toLocaleString()} <span className="text-xs font-normal">AZN</span>
                </div>
                <span className="text-[11px] text-[#5D6D63] block">Net annual utility savings</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1">
                <span className="text-xs text-[#5D6D63]">Upfront Investment</span>
                <div className="text-2xl font-display font-bold text-[#101C18] font-mono-num">
                  {activeEcmResult.investmentAzn.toLocaleString()} <span className="text-xs font-normal">AZN</span>
                </div>
                <span className="text-[11px] text-[#5D6D63] block">Hardware + installation</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-1">
                <span className="text-xs text-[#5D6D63]">Estimated Payback</span>
                <div className="text-2xl font-display font-bold text-[#152E27] font-mono-num">
                  {activeEcmResult.paybackYears !== null
                    ? `${activeEcmResult.paybackYears.toFixed(1)} yrs`
                    : "No positive payback"}
                </div>
                <span className="text-[11px] text-[#5D6D63] block">Simple payback duration</span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 rounded-xl bg-[#152E27]/5 border border-[#152E27]/15 text-xs text-[#101C18] space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-[#152E27]">
                <Info className="w-4 h-4" />
                What these numbers mean:
              </div>
              <p className="text-[#5D6D63] leading-relaxed">
                By investing <strong>{activeEcmResult.investmentAzn.toLocaleString()} AZN</strong> today, the student residence avoids <strong>{activeEcmResult.annualAzn.toLocaleString()} AZN</strong> in electricity purchases every year. The project pays for itself in approximately <strong>{activeEcmResult.paybackYears?.toFixed(1)} years</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-outline-dark text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="btn-lime text-sm py-2.5 px-5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <span>Choose measurement strategy</span>
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: CHOOSE THE RIGHT MEASUREMENTS                              */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="card-editorial p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Step 4 of 5 &bull; Measurement Strategy
              </span>
              <span className="text-xs text-[#5D6D63]">IPMVP Guidance</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-[#101C18] tracking-tight">
                A calculated opportunity is not the same as a measured outcome.
              </h2>
              <p className="text-sm text-[#5D6D63] leading-relaxed">
                Energy efficiency cannot be directly metered &mdash; it can only be estimated by measuring key variables before and after the retrofit. Select a scenario to see how EnerProof tests the evidence:
              </p>
            </div>

            {/* Scenario Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMeasurementScenario("complete")}
                className={`p-5 rounded-xl border text-left transition-all space-y-2 ${
                  measurementScenario === "complete"
                    ? "border-[#152E27] bg-[#152E27]/5 ring-2 ring-[#152E27]"
                    : "border-[#DDE3DB] hover:border-[#152E27]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101C18]">
                    Scenario A: Valid Equipment Isolation
                  </span>
                  {measurementScenario === "complete" && (
                    <CheckCircle2 className="w-5 h-5 text-[#152E27]" />
                  )}
                </div>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Log operating hours on the dedicated lighting panelboard for 30 days and spot-meter wattage. Isolates the improvement from whole-building weather noise.
                </p>
                <div className="text-[11px] font-mono text-[#152E27] font-semibold">
                  Expected Outcome: Evidence Supports Estimate
                </div>
              </button>

              <button
                onClick={() => setMeasurementScenario("insufficient")}
                className={`p-5 rounded-xl border text-left transition-all space-y-2 ${
                  measurementScenario === "insufficient"
                    ? "border-[#9B641B] bg-[#FEF3C7]/40 ring-2 ring-[#9B641B]"
                    : "border-[#DDE3DB] hover:border-[#9B641B]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101C18]">
                    Scenario B: Incomplete / Insufficient Data
                  </span>
                  {measurementScenario === "insufficient" && (
                    <AlertCircle className="w-5 h-5 text-[#9B641B]" />
                  )}
                </div>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Only 14 days of whole-building meter data without dedicated circuit loggers. Whole-building weather noise drowns out the lighting reduction.
                </p>
                <div className="text-[11px] font-mono text-[#9B641B] font-semibold">
                  Expected Outcome: Refusal / Additional Measurement Required
                </div>
              </button>
            </div>

            {/* Measurement Requirements Box */}
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2 text-xs">
              <div className="font-semibold text-[#101C18]">
                Required Measurement Checklist ({measurementPlan.recommendedOption}):
              </div>
              <ul className="space-y-1.5 text-[#5D6D63]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#152E27]" />
                  <span><strong>Boundary:</strong> {measurementPlan.meteringBoundary}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#152E27]" />
                  <span><strong>Logging:</strong> {measurementPlan.loggingIntervalMinutes}-minute intervals for {measurementPlan.minimumRecommendedDurationDays} days</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#152E27]" />
                  <span><strong>Target Uncertainty:</strong> &le; {measurementPlan.expectedFsuPct.toFixed(1)}% sampling uncertainty</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-outline-dark text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(5)}
                className="btn-lime text-sm py-2.5 px-5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <span>Evaluate with Evidence Gate</span>
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: UNDERSTAND THE ASSESSMENT                                  */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="card-editorial p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Step 5 of 5 &bull; Evidence Gate Determination
              </span>
              <span className="text-xs text-[#5D6D63]">Deterministic Verification</span>
            </div>

            {/* Plain-Language Verdict Banner */}
            <div
              className={`p-6 rounded-2xl border-2 space-y-3 ${
                evidenceAssessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                  ? "bg-[#D9FF91]/10 border-[#152E27]"
                  : "bg-[#FEF3C7]/40 border-[#9B641B]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                    evidenceAssessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                      ? "bg-[#152E27] text-[#D9FF91]"
                      : "bg-[#9B641B] text-white"
                  }`}
                >
                  Evidence Gate Verdict
                </span>
                <span className="text-xs font-mono text-[#5D6D63]">
                  Status: {evidenceAssessment.classification}
                </span>
              </div>

              <h2 className="text-2xl font-display font-extrabold text-[#101C18]">
                {evidenceAssessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                  ? "The available evidence supports this savings estimate."
                  : "Additional measurements recommended before relying on this estimate."}
              </h2>

              <p className="text-sm text-[#5D6D63] leading-relaxed">
                {evidenceAssessment.classification === "EVIDENCE_SUPPORTS_ESTIMATE"
                  ? "Engineering parameters (fixture counts, operating hours, delta wattage) are physically verified within plausible bounds. Equipment isolation avoids whole-building weather noise."
                  : "We can estimate the potential savings, but confirming the actual outcome requires measured operating runtimes and dedicated circuit loggers. The 14-day observation window is too short."}
              </p>

              {/* Rationale Bullet points */}
              <div className="pt-2 space-y-1.5 text-xs text-[#101C18]">
                <div className="font-semibold text-[#101C18]">Evaluation Decision Path:</div>
                {evidenceAssessment.rationale.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#152E27] font-bold">&bull;</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Recommended Actions */}
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-[#101C18]">
                  Export Investment-Grade Verification Report
                </div>
                <p className="text-xs text-[#5D6D63]">
                  Generate a clean, print-ready monochrome PDF with complete calculations, assumptions, and measurement protocol.
                </p>
              </div>

              <button
                onClick={handleDownloadReport}
                className="btn-lime text-xs py-2.5 px-4 rounded-lg font-semibold inline-flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4 text-[#101C18]" />
                <span>Download Report (PDF)</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="btn-outline-dark text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(6)}
                className="btn-forest text-sm py-2.5 px-5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <span>Explore the evidence behind EnerProof</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 6: EXPLORE THE EVIDENCE BEHIND ENERPROOF                      */}
        {/* =================================================================== */}
        {currentStep === 6 && (
          <div className="card-editorial p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Advanced Verification Assets
              </span>
              <span className="text-xs text-[#5D6D63]">Scientific Foundations</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-[#101C18] tracking-tight">
                The evidence behind the product.
              </h2>
              <p className="text-sm text-[#5D6D63]">
                EnerProof’s algorithms were tested and validated on real public filings and international building research.
              </p>
            </div>

            {/* 3 Research Assets Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asset 1 */}
              <div className="p-5 rounded-xl border border-[#DDE3DB] bg-[#F4F5F0] space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-[#B74740]">
                  Local Case Study
                </span>
                <h3 className="font-bold text-base text-[#101C18]">
                  Baku Higher Oil School Public Audit
                </h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Automated screening of 36 monthly records uncovered 100% duplicate monthly data in 2024 and an exact 10x arithmetic error in published CO₂ emissions.
                </p>
                <Link
                  href="/app/audit?demo=bhos"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#152E27] hover:underline"
                >
                  <span>Open Audit Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Asset 2 */}
              <div className="p-5 rounded-xl border border-[#DDE3DB] bg-[#F4F5F0] space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-[#152E27]">
                  Empirical Science
                </span>
                <h3 className="font-bold text-base text-[#101C18]">
                  152-Building Empirical Benchmark
                </h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Screened 152 real buildings across 2 years of hourly data from the Building Data Genome 2, establishing empirical noise floors and correlation limits.
                </p>
                <Link
                  href="/research"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#152E27] hover:underline"
                >
                  <span>View Research Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Asset 3 */}
              <div className="p-5 rounded-xl border border-[#DDE3DB] bg-[#F4F5F0] space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-[#152E27]">
                  Full Workspace
                </span>
                <h3 className="font-bold text-base text-[#101C18]">
                  7-Step Engineering Workspace
                </h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Access the full connected auditor workspace with custom CSV drag-and-drop, regression fitting, and multi-building portfolio pooling.
                </p>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#152E27] hover:underline"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDE3DB] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(5)}
                className="btn-outline-dark text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Verdict</span>
              </button>

              <button
                onClick={handleReset}
                className="btn-lime text-sm py-2.5 px-5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-[#101C18]" />
                <span>Restart 3-minute walkthrough</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
