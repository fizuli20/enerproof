import { describe, it, expect } from "vitest";
import {
  kwhToMwh,
  calculateAvoidedElectricityCo2,
  calculateSimplePayback,
  DEFAULT_AZN_TARIFF_PER_KWH,
  DEFAULT_AZN_TARIFF_PER_M3_GAS,
} from "../lib/energy/units";
import {
  calculateLightingRetrofit,
  calculateHvacScheduling,
  calculatePlugLoad,
  calculateThermalWater,
  calculateBoilerOptimization,
} from "../lib/interventions/calculators";
import {
  auditDataQuality,
  auditBhosPublicData,
} from "../lib/audit/data-quality-engine";
import {
  trainDegreeDayBaseline,
  predictCounterfactual,
} from "../lib/baseline/regression";
import {
  calculateBuildingFsu,
  evaluateEvidenceGate,
  HISTORICAL_RESEARCH_COHORT_BENCHMARKS,
} from "../lib/evidence/evidence-gate";
import {
  calculateUserPortfolio,
  simulateTheoreticalCorrelation,
  RESEARCH_BENCHMARK_PORTFOLIO_FINDINGS,
} from "../lib/portfolio/aggregator";
import { generateEnerProofReport } from "../lib/reports/pdf-generator";
import { generateMeasurementPlan } from "../lib/measurement/planner";
import { createDefaultStudentResidenceProject } from "../lib/store/project-context";

describe("Energy Units & Financial Lifecycle Safeguards", () => {
  it("converts kWh to MWh accurately", () => {
    expect(kwhToMwh(5000)).toBe(5);
    expect(kwhToMwh(0)).toBe(0);
  });

  it("calculates avoided CO2 emissions when emissions factor is supplied, but returns null if omitted", () => {
    // 995,575 kWh * 0.5 kg/kWh = 497,787.5 kg = 497.7875 tCO2
    const tonnesWithFactor = calculateAvoidedElectricityCo2(995575, 0.5);
    expect(tonnesWithFactor).toBeCloseTo(497.79, 1);

    // Safeguard: Without an explicit grid emissions factor, refuse to assert a speculative factor
    const tonnesWithoutFactor = calculateAvoidedElectricityCo2(995575);
    expect(tonnesWithoutFactor).toBeNull();
  });

  it("calculates simple payback period safely (returns null for non-positive net savings, never 999 years)", () => {
    // CapEx = 10,000 AZN, Annual Net Savings = 2,500 AZN -> Payback = 4.0 years
    expect(calculateSimplePayback(10000, 2500)).toBe(4.0);

    // Safeguard: If annual net savings <= 0, return null (never 999 years)
    expect(calculateSimplePayback(10000, 0)).toBeNull();
    expect(calculateSimplePayback(10000, -500)).toBeNull();
  });
});

describe("Intervention Engineering Calculators & Bounded Inputs", () => {
  it("calculates LED lighting retrofit savings with lifecycle accounting", () => {
    const res = calculateLightingRetrofit({
      fixtureCount: 500,
      baselineWattsPerFixture: 64, // 2x32W T8
      retrofitWattsPerFixture: 24, // 2x12W LED
      operatingHoursPerDay: 12,
      operatingDaysPerYear: 300,
      costPerFixtureAzn: 35,
      annualMaintenanceAzn: 300,
      measurementCostAzn: 800,
      tariffPerKwh: DEFAULT_AZN_TARIFF_PER_KWH,
      emissionsFactorKgPerKwh: 0.5,
    });

    // delta Watts = 40W
    // annual kWh = 500 * 40 * 12 * 300 / 1000 = 72,000 kWh
    expect(res.annualKwhSavings).toBe(72000);
    // gross cost savings = 72,000 * 0.125 = 9,000 AZN
    expect(res.annualGrossSavingsAzn).toBe(9000);
    // net annual savings = 9,000 - 300 = 8,700 AZN
    expect(res.annualNetSavingsAzn).toBe(8700);
    // capital cost = 500 * 35 = 17,500 AZN; total initial = 17,500 + 800 = 18,300 AZN
    expect(res.implementationCostAzn).toBe(17500);
    expect(res.totalInitialInvestmentAzn).toBe(18300);
    // simple payback = 18,300 / 8,700 = ~2.1 years
    expect(res.simplePaybackYears).toBeCloseTo(2.1, 1);
  });

  it("calculates HVAC scheduling savings and enforces ventilation safeguard", () => {
    const res = calculateHvacScheduling({
      coolingCapacityKw: 120,
      baselineRuntimeHoursWeek: 70,
      optimizedRuntimeHoursWeek: 45, // 25 hrs/week saved
      operatingWeeksYear: 26,
      averageLoadFactor: 0.7,
      implementationCostAzn: 4500,
      comfortVentilationConfirmed: true,
      tariffPerKwh: DEFAULT_AZN_TARIFF_PER_KWH,
      emissionsFactorKgPerKwh: 0.5,
    });

    // kWh = 120 * 25 * 26 * 0.7 = 54,600 kWh
    expect(res.annualKwhSavings).toBe(54600);
    expect(res.annualGrossSavingsAzn).toBe(Math.round(54600 * 0.125));
    expect(res.healthComfortSafeguardsConfirmed).toBe(true);
  });

  it("calculates plug load management savings with daily hour clamping", () => {
    const res = calculatePlugLoad({
      workstationCount: 200,
      baselineIdleWatts: 45,
      smartPlugIdleWatts: 5,
      idleHoursPerDay: 14,
      idleDaysPerYear: 365,
      smartPlugCostPerUnitAzn: 25,
      tariffPerKwh: DEFAULT_AZN_TARIFF_PER_KWH,
      emissionsFactorKgPerKwh: 0.5,
    });

    // deltaW = 40W
    // kWh = 200 * 40 * 14 * 365 / 1000 = 40,880 kWh
    expect(res.annualKwhSavings).toBe(40880);
    expect(res.implementationCostAzn).toBe(5000);
  });

  it("calculates domestic thermal water heating pre-heating", () => {
    const res = calculateThermalWater({
      dailyHotWaterLiters: 10000,
      deltaTempC: 45,
      baselineEfficiency: 0.8,
      solarThermalFraction: 0.5,
      systemCostAzn: 28000,
      gasTariffPerM3: DEFAULT_AZN_TARIFF_PER_M3_GAS,
    });

    expect(res.annualKwhSavings).toBeGreaterThan(100000);
    expect(res.annualFuelSavingsM3).toBeGreaterThan(10000);
    expect(res.simplePaybackYears).not.toBeNull();
  });

  it("calculates boiler combustion efficiency optimization", () => {
    const res = calculateBoilerOptimization({
      annualFuelM3: 600000,
      currentEfficiencyPct: 78,
      optimizedEfficiencyPct: 88,
      equipmentCostAzn: 35000,
      gasTariffPerM3: DEFAULT_AZN_TARIFF_PER_M3_GAS,
    });

    // fuel savings = 600000 * (1 - 78/88) = 600000 * (10/88) ~ 68,181 m3
    expect(res.annualFuelSavingsM3).toBe(68182);
    expect(res.implementationCostAzn).toBe(35000);
    expect(res.simplePaybackYears).not.toBeNull();
  });
});

describe("Data Quality & BHOS Audit Engine", () => {
  it("detects excessive missing data and negative values in time series", () => {
    const rows = [
      { date: "2026-01-01", value: 100 },
      { date: "2026-01-02", value: NaN },
      { date: "2026-01-03", value: -50 },
      { date: "2026-01-04", value: 120 },
    ];
    const audit = auditDataQuality(rows);
    expect(audit.passed).toBe(false);
    expect(audit.hasNegativeValues).toBe(true);
    expect(audit.missingPct).toBe(25);
  });

  it("audits Baku Higher Oil School (BHOS) public data and catches duplicates + 10x math discrepancy", () => {
    const bhosRows = [
      // 2023 12 months
      ...Array.from({ length: 12 }, (_, i) => ({
        year: 2023,
        month: i + 1,
        campus_elec: 72800,
        khatai_elec: 10164,
        combined_elec: 82964,
        boiler_gas_m3: i < 3 || i >= 10 ? 80000 : 12000,
      })),
      // 2024 12 months (exact duplicate of 2023)
      ...Array.from({ length: 12 }, (_, i) => ({
        year: 2024,
        month: i + 1,
        campus_elec: 72800,
        khatai_elec: 10164,
        combined_elec: 82964,
        boiler_gas_m3: i < 3 || i >= 10 ? 80000 : 12000,
      })),
    ];

    const result = auditBhosPublicData(bhosRows);
    expect(result.temporalIndependencePass).toBe(false);
    expect(result.duplicatedPercentage).toBe(100);
    expect(result.emissionsArithmeticPass).toBe(false);
    expect(result.calculatedEmissionsTonnes).toBeCloseTo(497.79, 0);
    expect(result.emissionsDiscrepancyFactor).toBe(10.0);
    expect(result.overallAuditStatus).toBe("REJECT");
    expect(result.boilerSeasonalityPct).toBeGreaterThan(70);
  });
});

describe("Baseline Regression Engine (V2 Chronological Split & Diagnostics)", () => {
  it("fits degree-day model with strict train/calibrate chronological separation and autocorrelation", () => {
    // Generate 60 days of synthetic linear response
    const rows = [];
    for (let i = 0; i < 60; i++) {
      const hdd = i < 30 ? (30 - i) * 0.8 : 0;
      const cdd = i >= 30 ? (i - 30) * 0.9 : 0;
      const energyKwh = 1000 + 40 * hdd + 60 * cdd + (i % 3 - 1) * 10;
      rows.push({
        date: `2026-0${Math.floor(i / 30) + 1}-${(i % 30) + 1}`,
        energyKwh,
        hdd,
        cdd,
      });
    }

    const trainRows = rows.slice(0, 48);
    const calibRows = rows.slice(48);

    const res = trainDegreeDayBaseline(trainRows, calibRows, "daily");
    expect(res.trainingDiagnostics.r2).toBeGreaterThan(0.95);
    expect(res.trainSampleSize).toBe(48);
    expect(res.calibSampleSize).toBe(12);
    expect(res.calibrationDiagnostics?.r1Autocorr).toBeDefined();
    expect(res.screeningStatus).toBe("MEETS_SCREENING_CRITERIA");
    expect(res.coefficients.intercept).toBeCloseTo(1000, -1);
    expect(res.coefficients.hddCoeff).toBeCloseTo(40, -1);
    expect(res.coefficients.cddCoeff).toBeCloseTo(60, -1);

    const counterfactual = predictCounterfactual(res.coefficients, [{ hdd: 10, cdd: 0 }]);
    expect(counterfactual[0]).toBeCloseTo(1400, -1);
  });
});

describe("Evidence Gate Deterministic Refusal & Building-Specific Logic", () => {
  const dummyCleanQuality = {
    totalRows: 180,
    missingRows: 0,
    missingPct: 0,
    zeroCount: 0,
    zeroPct: 0,
    maxConsecutiveZeros: 0,
    hasNegativeValues: false,
    hasDuplicateAnnualProfile: false,
    isContinuousTimestamps: true,
    flags: [],
    passed: true,
  };

  // Helper baseline model with 30 days calibration
  const dummyBaselineModel = {
    coefficients: { intercept: 1000, hddCoeff: 40, cddCoeff: 60, occCoeff: null },
    hasOccupancyFeature: false,
    trainingDiagnostics: { r2: 0.92, rmse: 50, cvRmsePct: 8.5, nmbePct: 0.8, sampleCount: 120 },
    calibrationDiagnostics: { r2: 0.88, rmse: 55, cvRmsePct: 9.2, nmbePct: 1.1, sampleCount: 30, r1Autocorr: 0.12 },
    screeningStatus: "MEETS_SCREENING_CRITERIA" as const,
    screeningNotes: ["Compliant"],
    trainSampleSize: 120,
    calibSampleSize: 30,
    hasNegativePredictions: false,
  };

  it("refuses estimate if pre-intervention data quality failed", () => {
    const dirtyQuality = {
      ...dummyCleanQuality,
      passed: false,
      flags: ["Missing data exceeds 5%"],
    };

    const gate = evaluateEvidenceGate({
      context: "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C",
      apparentSavingsKwh: 50000,
      baselineEnergyKwh: 300000,
      reportingObservations: 180,
      dataQuality: dirtyQuality,
      baselineModel: dummyBaselineModel,
    });

    expect(gate.classification).toBe("INSUFFICIENT_EVIDENCE");
    expect(gate.screeningPassed).toBe(false);
  });

  it("returns UNESTABLISHED and ADDITIONAL_MEASUREMENT_REQUIRED when calibration window is missing or insufficient (<14 observations)", () => {
    const insufficientModel = {
      ...dummyBaselineModel,
      calibSampleSize: 8,
      calibrationDiagnostics: {
        ...dummyBaselineModel.calibrationDiagnostics,
        sampleCount: 8,
      },
    };

    const gate = evaluateEvidenceGate({
      context: "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C",
      apparentSavingsKwh: 45000,
      baselineEnergyKwh: 300000,
      reportingObservations: 180,
      dataQuality: dummyCleanQuality,
      baselineModel: insufficientModel,
    });

    expect(gate.buildingSpecificThresholdPct).toBeNull();
    expect(gate.isStatisticallyEstablished).toBe(false);
    expect(gate.classification).toBe("ADDITIONAL_MEASUREMENT_REQUIRED");
  });

  it("returns INSUFFICIENT_EVIDENCE if apparent savings fail to clear building-specific noise threshold", () => {
    const noisyModel = {
      ...dummyBaselineModel,
      calibrationDiagnostics: {
        ...dummyBaselineModel.calibrationDiagnostics,
        cvRmsePct: 20.0, // High variance
      },
    };

    const gate = evaluateEvidenceGate({
      context: "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C",
      apparentSavingsKwh: 3000, // 1% apparent savings
      baselineEnergyKwh: 300000,
      reportingObservations: 180,
      dataQuality: dummyCleanQuality,
      baselineModel: noisyModel,
    });

    expect(gate.apparentSavingsPct).toBe(1.0);
    expect(gate.buildingSpecificThresholdPct).toBeGreaterThan(1.0);
    expect(gate.classification).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("returns ADDITIONAL_MEASUREMENT_REQUIRED if savings clear threshold but FSU > 50%", () => {
    const shortWindowModel = {
      ...dummyBaselineModel,
      calibrationDiagnostics: {
        ...dummyBaselineModel.calibrationDiagnostics,
        cvRmsePct: 25.0,
      },
    };

    const gate = evaluateEvidenceGate({
      context: "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C",
      apparentSavingsKwh: 36000, // 12.0% of 300,000
      baselineEnergyKwh: 300000,
      reportingObservations: 14, // Short post-intervention duration (14 days)
      dataQuality: dummyCleanQuality,
      baselineModel: shortWindowModel,
    });

    expect(gate.apparentSavingsPct).toBe(12.0);
    expect(gate.buildingSpecificThresholdPct).not.toBeNull();
    expect(gate.apparentSavingsPct).toBeGreaterThanOrEqual(gate.buildingSpecificThresholdPct!);
    expect(gate.fsuPct).toBeGreaterThan(50.0);
    expect(gate.classification).toBe("ADDITIONAL_MEASUREMENT_REQUIRED");
  });

  it("returns EVIDENCE_SUPPORTS_ESTIMATE when savings clear threshold AND FSU <= 50%", () => {
    const gate = evaluateEvidenceGate({
      context: "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C",
      apparentSavingsKwh: 45000, // 15% of 300,000
      baselineEnergyKwh: 300000,
      reportingObservations: 180,
      dataQuality: dummyCleanQuality,
      baselineModel: dummyBaselineModel,
    });

    expect(gate.apparentSavingsPct).toBe(15.0);
    expect(gate.fsuPct).toBeLessThanOrEqual(50.0);
    expect(gate.classification).toBe("EVIDENCE_SUPPORTS_ESTIMATE");
    expect(gate.isStatisticallyEstablished).toBe(true);
  });

  it("supports equipment isolation measurement boundary (Option A/B) without whole-building weather noise", () => {
    const gate = evaluateEvidenceGate({
      context: "EQUIPMENT_ISOLATION_OPTION_A_B",
      apparentSavingsKwh: 10000,
      baselineEnergyKwh: 300000,
      reportingObservations: 60,
      dataQuality: dummyCleanQuality,
    });

    expect(gate.classification).toBe("EVIDENCE_SUPPORTS_ESTIMATE");
    expect(gate.isStatisticallyEstablished).toBe(true);
  });
});

describe("Portfolio Aggregator & Separation of Research from User Portfolio", () => {
  it("returns UNESTABLISHED for user portfolio uncertainty when residual covariance is not provided", () => {
    const buildings = [
      {
        id: "bld-1",
        name: "Residence 1",
        baselineEnergyKwh: 300000,
        apparentSavingsKwh: 45000,
        implementationCostAzn: 15000,
        measurementCostAzn: 2000,
      },
      {
        id: "bld-2",
        name: "Academic Wing",
        baselineEnergyKwh: 500000,
        apparentSavingsKwh: 50000,
        implementationCostAzn: 25000,
        measurementCostAzn: 3000,
      },
    ];

    const result = calculateUserPortfolio(buildings, 0.125);
    expect(result.buildingCount).toBe(2);
    expect(result.totalBaselineKwh).toBe(800000);
    expect(result.totalApparentSavingsKwh).toBe(95000);
    expect(result.portfolioUncertaintyStatus).toBe("UNESTABLISHED");
    expect(result.portfolioFsuPct).toBeNull();
  });

  it("establishes portfolio uncertainty when synchronized residuals are supplied", () => {
    const residuals = Array.from({ length: 30 }, (_, i) => Math.sin(i));
    const buildings = [
      {
        id: "bld-1",
        name: "Residence 1",
        baselineEnergyKwh: 300000,
        apparentSavingsKwh: 45000,
        residuals,
      },
      {
        id: "bld-2",
        name: "Academic Wing",
        baselineEnergyKwh: 500000,
        apparentSavingsKwh: 50000,
        residuals,
      },
    ];

    const result = calculateUserPortfolio(buildings, 0.125);
    expect(result.portfolioUncertaintyStatus).toBe("ESTABLISHED");
    expect(result.portfolioFsuPct).not.toBeNull();
  });

  it("simulates theoretical correlation floor (rho=0.33) in research benchmark explorer", () => {
    const sim = simulateTheoreticalCorrelation({
      buildingCount: 20,
      assumedIndividualCvRmsePct: 14.8,
      assumedCrossBuildingCorrelation: 0.33,
      assumedSavingsPct: 10.0,
      confidenceAlpha: 0.05,
    });

    expect(sim.buildingCount).toBe(20);
    expect(sim.theoreticalIndependentNoiseFactor).toBeCloseTo(0.224, 2);
    expect(sim.theoreticalCorrelatedNoiseFactor).toBeGreaterThan(sim.theoreticalIndependentNoiseFactor);
    expect(sim.noiseInflationRatio).toBeGreaterThan(1.5);
  });
});

describe("Measurement Planning & Multi-Type PDF Generation", () => {
  it("generates IPMVP-aligned measurement plan for lighting", () => {
    const plan = generateMeasurementPlan({
      category: "lighting",
      expectedSavingsPct: 15.0,
      baselineCvRmsePct: 10.0,
      resolution: "daily",
      hasSubmetering: false,
    });
    expect(plan.recommendedOption).toBe("IPMVP Option A");
    expect(plan.minimumRecommendedDurationDays).toBe(30);
    expect(plan.recommendedHardware.length).toBeGreaterThan(0);
  });

  it("generates IPMVP Option B for sub-threshold HVAC savings", () => {
    const plan = generateMeasurementPlan({
      category: "hvac",
      expectedSavingsPct: 8.0,
      baselineCvRmsePct: 12.0,
      resolution: "daily",
      hasSubmetering: false,
    });
    expect(plan.recommendedOption).toBe("IPMVP Option B");
  });

  it("generates valid multi-page PDF documents for distinct report types from project state", () => {
    const defaultProject = createDefaultStudentResidenceProject();

    // Test comprehensive report
    const docComp = generateEnerProofReport(defaultProject, "comprehensive");
    expect(docComp).toBeDefined();
    expect(docComp.output("blob").size).toBeGreaterThan(1000);

    // Test data quality audit report
    const docAudit = generateEnerProofReport(defaultProject, "data_quality_audit");
    expect(docAudit).toBeDefined();
    expect(docAudit.output("blob").size).toBeGreaterThan(1000);

    // Test ECM feasibility report
    const docFeas = generateEnerProofReport(defaultProject, "intervention_feasibility");
    expect(docFeas).toBeDefined();
    expect(docFeas.output("blob").size).toBeGreaterThan(1000);
  });
});
