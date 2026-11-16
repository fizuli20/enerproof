import { describe, it, expect } from "vitest";
import {
  kwhToMwh,
  calculateAvoidedElectricityCo2,
  calculateSimplePayback,
  DEFAULT_AZN_TARIFF_PER_KWH,
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
  calculateAshraeFsu,
  evaluateEvidenceGate,
  CALIBRATED_BENCHMARK_THRESHOLDS,
} from "../lib/evidence/evidence-gate";
import {
  aggregatePortfolio,
  EMPIRICAL_CROSS_BUILDING_CORRELATION,
} from "../lib/portfolio/aggregator";
import { generateEnerProofPdf } from "../lib/reports/pdf-generator";
import { generateMeasurementPlan } from "../lib/measurement/planner";

describe("Energy Units & Financials", () => {
  it("converts kWh to MWh correctly", () => {
    expect(kwhToMwh(5000)).toBe(5);
  });

  it("calculates avoided CO2 emissions using standard factor (0.5 kg/kWh)", () => {
    // 995,575 kWh * 0.5 kg/kWh = 497,787.5 kg = 497.7875 tCO2
    const tonnes = calculateAvoidedElectricityCo2(995575);
    expect(tonnes).toBeCloseTo(497.79, 1);
  });

  it("calculates simple payback period", () => {
    // CapEx = 10,000 AZN, Annual Savings = 2,500 AZN -> Payback = 4.0 years
    expect(calculateSimplePayback(10000, 2500)).toBe(4.0);
    expect(calculateSimplePayback(10000, 0)).toBe(999.0);
  });
});

describe("Intervention Engineering Calculators", () => {
  it("calculates LED lighting retrofit savings", () => {
    const res = calculateLightingRetrofit({
      fixtureCount: 500,
      baselineWattsPerFixture: 64, // 2x32W T8
      retrofitWattsPerFixture: 24, // 2x12W LED
      operatingHoursPerDay: 12,
      operatingDaysPerYear: 300,
      costPerFixtureAzn: 35,
      tariffPerKwh: DEFAULT_AZN_TARIFF_PER_KWH,
    });
    // delta Watts = 40W
    // annual kWh = 500 * 40 * 12 * 300 / 1000 = 72,000 kWh
    expect(res.annualKwhSavings).toBe(72000);
    // cost savings = 72,000 * 0.125 = 9,000 AZN
    expect(res.annualCostSavingsAzn).toBe(9000);
    // capital cost = 500 * 35 = 17,500 AZN
    expect(res.capitalCostAzn).toBe(17500);
    // simple payback = 17,500 / 9,000 = 1.9 years
    expect(res.simplePaybackYears).toBe(1.9);
  });

  it("calculates HVAC scheduling & night setback savings", () => {
    const res = calculateHvacScheduling({
      coolingCapacityKw: 120,
      baselineRuntimeHoursWeek: 70,
      optimizedRuntimeHoursWeek: 45, // 25 hrs/week saved
      operatingWeeksYear: 26,
      averageLoadFraction: 0.7,
      implementationCostAzn: 4500,
    });
    // kWh = 120 * 25 * 26 * 0.7 = 54,600 kWh
    expect(res.annualKwhSavings).toBe(54600);
    expect(res.annualCostSavingsAzn).toBe(Math.round(54600 * 0.125));
  });

  it("calculates plug load management savings", () => {
    const res = calculatePlugLoad({
      workstationCount: 200,
      baselineIdleWatts: 45,
      smartPlugIdleWatts: 5,
      idleHoursPerDay: 14,
      idleDaysPerYear: 365,
      smartPlugCostPerUnitAzn: 25,
    });
    // deltaW = 40W
    // kWh = 200 * 40 * 14 * 365 / 1000 = 40,880 kWh
    expect(res.annualKwhSavings).toBe(40880);
    expect(res.capitalCostAzn).toBe(5000);
  });

  it("calculates domestic thermal water heating pre-heating", () => {
    const res = calculateThermalWater({
      dailyHotWaterLiters: 10000,
      deltaTempC: 45,
      baselineEfficiency: 0.8,
      solarThermalFraction: 0.5,
      systemCostAzn: 28000,
    });
    expect(res.annualKwhSavings).toBeGreaterThan(100000);
    expect(res.annualFuelSavingsM3).toBeGreaterThan(10000);
  });

  it("calculates boiler combustion efficiency optimization", () => {
    const res = calculateBoilerOptimization({
      annualFuelM3: 600000,
      currentEfficiencyPct: 78,
      optimizedEfficiencyPct: 88,
      equipmentCostAzn: 35000,
    });
    // fuel savings = 600000 * (1 - 78/88) = 600000 * (10/88) ~ 68,181 m3
    expect(res.annualFuelSavingsM3).toBe(68182);
    expect(res.capitalCostAzn).toBe(35000);
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

describe("Baseline Regression Engine", () => {
  it("fits degree-day regression model and computes CV(RMSE) and NMBE", () => {
    // Generate synthetic linear response: kWh = 1000 + 40*HDD + 60*CDD
    const rows = [];
    for (let i = 0; i < 60; i++) {
      const hdd = i < 30 ? (30 - i) * 0.8 : 0;
      const cdd = i >= 30 ? (i - 30) * 0.9 : 0;
      const actualKwh = 1000 + 40 * hdd + 60 * cdd + (i % 3 - 1) * 10;
      rows.push({
        date: `2026-0${Math.floor(i / 30) + 1}-${(i % 30) + 1}`,
        actualKwh,
        hdd,
        cdd,
      });
    }

    const res = trainDegreeDayBaseline(rows, "daily");
    expect(res.r2).toBeGreaterThan(0.95);
    expect(res.cvRmsePct).toBeLessThan(10);
    expect(Math.abs(res.nmbePct)).toBeLessThan(5);
    expect(res.ashraeCompliant).toBe(true);
    expect(res.coefficients.intercept).toBeCloseTo(1000, -1);
    expect(res.coefficients.hddCoeff).toBeCloseTo(40, -1);
    expect(res.coefficients.cddCoeff).toBeCloseTo(60, -1);

    const counterfactual = predictCounterfactual(res.coefficients, [{ hdd: 10, cdd: 0 }]);
    expect(counterfactual[0]).toBeCloseTo(1400, -1);
  });
});

describe("Evidence Gate Deterministic Refusal & Classification", () => {
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

  it("refuses estimate if pre-intervention data quality failed", () => {
    const dirtyQuality = {
      ...dummyCleanQuality,
      passed: false,
      flags: ["Missing data exceeds 5%"],
    };

    const gate = evaluateEvidenceGate({
      apparentSavingsKwh: 50000,
      baselineKwh: 300000,
      cvRmsePct: 10.0,
      baselineObservations: 180,
      reportingObservations: 180,
      resolution: "daily",
      dataQuality: dirtyQuality,
    });

    expect(gate.classification).toBe("INSUFFICIENT_EVIDENCE");
    expect(gate.dataQualityPassed).toBe(false);
  });

  it("returns INSUFFICIENT_EVIDENCE if apparent savings fail to clear daily calibrated threshold (11.8%)", () => {
    const gate = evaluateEvidenceGate({
      apparentSavingsKwh: 15000, // 5% of 300,000
      baselineKwh: 300000,
      cvRmsePct: 8.0,
      baselineObservations: 180,
      reportingObservations: 180,
      resolution: "daily",
      dataQuality: dummyCleanQuality,
    });

    expect(gate.apparentSavingsPct).toBe(5.0);
    expect(gate.calibratedThresholdPct).toBe(11.8);
    expect(gate.classification).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("returns ADDITIONAL_MEASUREMENT_REQUIRED if savings clear threshold but FSU > 50%", () => {
    const gate = evaluateEvidenceGate({
      apparentSavingsKwh: 45000, // 15% of 300,000 (clears 11.8%)
      baselineKwh: 300000,
      cvRmsePct: 24.0, // High variance
      baselineObservations: 180,
      reportingObservations: 14, // Short post-intervention duration (14 days)
      resolution: "daily",
      dataQuality: dummyCleanQuality,
    });

    expect(gate.apparentSavingsPct).toBe(15.0);
    expect(gate.fsuPct).toBeGreaterThan(50.0);
    expect(gate.classification).toBe("ADDITIONAL_MEASUREMENT_REQUIRED");
  });

  it("returns EVIDENCE_SUPPORTS_ESTIMATE when savings clear threshold AND FSU <= 50%", () => {
    const gate = evaluateEvidenceGate({
      apparentSavingsKwh: 45000, // 15% of 300,000
      baselineKwh: 300000,
      cvRmsePct: 10.0,
      baselineObservations: 180,
      reportingObservations: 180,
      resolution: "daily",
      dataQuality: dummyCleanQuality,
    });

    expect(gate.apparentSavingsPct).toBe(15.0);
    expect(gate.fsuPct).toBeLessThanOrEqual(50.0);
    expect(gate.classification).toBe("EVIDENCE_SUPPORTS_ESTIMATE");
  });
});

describe("Portfolio Aggregator & Cross-Building Correlation", () => {
  it("demonstrates empirical noise floor vs naive 1/sqrt(K) assumption", () => {
    const buildings = Array.from({ length: 20 }, (_, i) => ({
      id: `bld-${i}`,
      name: `Campus Building ${i + 1}`,
      baselineKwh: 500000,
      apparentSavingsKwh: 50000, // 10%
    }));

    const result = aggregatePortfolio(buildings);
    expect(result.buildingCount).toBe(20);
    expect(result.portfolioSavingsPct).toBe(10.0);
    expect(result.crossBuildingCorrelation).toBe(EMPIRICAL_CROSS_BUILDING_CORRELATION);
    // Naive 1/sqrt(20) = 15.0 / 4.472 = 3.35%
    expect(result.theoreticalPortfolioMdePct).toBeCloseTo(3.4, 0);
    // Empirical with rho=0.33 is significantly higher due to correlation floor
    expect(result.empiricalPortfolioMdePct).toBeGreaterThan(result.theoreticalPortfolioMdePct);
    // K=20 achieves >= 80% detection power for 10% saving
    expect(result.pooledDetectionPowerPct).toBeGreaterThanOrEqual(80.0);
  });
});

describe("Measurement Planning & PDF Generation", () => {
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
      expectedSavingsPct: 8.0, // below 11.8% daily threshold
      baselineCvRmsePct: 12.0,
      resolution: "daily",
      hasSubmetering: false,
    });
    expect(plan.recommendedOption).toBe("IPMVP Option B");
  });

  it("generates a professional PDF document with all sections", () => {
    const doc = generateEnerProofPdf({
      projectName: "Baku Higher Oil School Residence",
      facilityType: "Student Dormitory & Dining",
      location: "Baku, Azerbaijan",
      auditorName: "Fizuli Hasanov",
      tariffPerKwh: 0.125,
      resolution: "daily",
      dataQuality: {
        totalRows: 184,
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
      },
      interventions: [
        {
          id: "lighting-1",
          name: "LED Lighting Retrofit",
          category: "lighting",
          capitalCostAzn: 15000,
          annualKwhSavings: 60000,
          annualCostSavingsAzn: 7500,
          simplePaybackYears: 2.0,
          avoidedCo2TonnesYear: 30.0,
          notes: "500 fixtures",
        },
      ],
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
        decisionRationale: ["Savings clear calibrated threshold", "FSU <= 50%"],
        disclaimer: "Analytical decision support only.",
      },
    });

    expect(doc).toBeDefined();
    const pdfBlob = doc.output("blob");
    expect(pdfBlob.size).toBeGreaterThan(1000);
  });
});
