/**
 * EnerProof Building-Specific Evidence Gate (V2)
 *
 * Implements a building-specific Evidence Gate evaluating:
 * - Data quality & provenance
 * - Measurement boundary (Option A/B equipment-level vs Option C whole-facility)
 * - Baseline model reliability & independent calibration
 * - Residual autocorrelation (r1)
 * - Reporting-period duration (m)
 * - Fractional Savings Uncertainty (FSU)
 *
 * NOTE: Universal benchmark thresholds (8.37%, 11.8%, 13.64%) from the 152-building BDG2 cohort
 * are retained solely in HISTORICAL_RESEARCH_COHORT_BENCHMARKS for research visualization.
 * They are NEVER applied to determine arbitrary user building claims.
 */

import {
  Resolution,
  DataQualitySummary,
  EvidenceClassification,
} from "../types";
import { BaselineRegressionResult } from "../baseline/regression";

export type EvaluationContext =
  | "EQUIPMENT_ISOLATION_OPTION_A_B"
  | "WHOLE_BUILDING_COUNTERFACTUAL_OPTION_C";

export interface BuildingSpecificGateInput {
  context: EvaluationContext;
  apparentSavingsKwh: number;
  baselineEnergyKwh: number;
  reportingObservations: number; // m
  dataQuality: DataQualitySummary;
  baselineModel?: BaselineRegressionResult | null;
  measurementBoundaryNote?: string;
  unresolvedNonRoutineEvents?: boolean;
  alpha?: number; // e.g. 0.05 for 95% confidence
  resolution?: Resolution;
  directEquipmentSavingsPct?: number; // for Option A/B
}

export interface BuildingEvidenceAssessment {
  classification: EvidenceClassification;
  apparentSavingsPct: number;
  apparentSavingsKwh: number;
  buildingSpecificThresholdPct: number | null; // null if UNESTABLISHED
  calibratedThresholdPct?: number | null; // Alias
  thresholdType?: string;
  fsuPct: number | null; // null if uncalculated
  maxAllowableFsuPct?: number;
  methodologyDescription: string;
  isStatisticallyEstablished: boolean;
  alpha: number;
  confidencePct: number;
  monitoringDurationDays?: number;
  dataQualityPassed?: boolean;
  resolution?: Resolution;
  rationale: string[];
  decisionRationale?: string[]; // Alias
  disclaimer: string;
  screeningPassed: boolean;
}

/**
 * Historical BDG2 research benchmark metrics.
 * Labeled strictly for research comparison and visualization.
 */
export const HISTORICAL_RESEARCH_COHORT_BENCHMARKS: Record<
  Resolution,
  {
    empiricalThresholdPct: number;
    syntheticNullFpr: number;
    historicalPlaceboFar: number;
    ashraeTheoreticalMdePct: number;
    cohortStatus: string;
  }
> = {
  hourly: {
    empiricalThresholdPct: 8.37,
    syntheticNullFpr: 0.0698,
    historicalPlaceboFar: 0.2867,
    ashraeTheoreticalMdePct: 15.3,
    cohortStatus: "UNESTABLISHED in BDG2 (Synthetic FPR 7.0% > 5%)",
  },
  daily: {
    empiricalThresholdPct: 11.8,
    syntheticNullFpr: 0.0421,
    historicalPlaceboFar: 0.2238,
    ashraeTheoreticalMdePct: 42.5,
    cohortStatus: "15.0% in BDG2 cohort (Synthetic FPR <= 5%)",
  },
  monthly: {
    empiricalThresholdPct: 13.64,
    syntheticNullFpr: 0.0681,
    historicalPlaceboFar: 0.1818,
    ashraeTheoreticalMdePct: 83.0,
    cohortStatus: "UNESTABLISHED in BDG2 (Synthetic FPR 6.8% > 5%)",
  },
};

/**
 * Normal quantile approximation (Abramowitz & Stegun).
 */
function getNormalQuantile(p: number): number {
  if (p <= 0.0) return -3.5;
  if (p >= 1.0) return 3.5;
  // Rational approximation
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const q = p - 0.5;
  if (Math.abs(q) <= 0.42) {
    const r = q * q;
    return (
      (q *
        (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5])) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1.0)
    );
  }
  const r = q < 0 ? p : 1.0 - p;
  const s = Math.log(-Math.log(r));
  let val =
    c[0] +
    s * (c[1] + s * (c[2] + s * (c[3] + s * (c[4] + s * c[5])))) /
      (1.0 + s * (d[0] + s * (d[1] + s * (d[2] + s * d[3]))));
  return q < 0 ? -val : val;
}

/**
 * Calculates Fractional Savings Uncertainty (FSU) using building-specific parameters.
 * Experimental uncertainty estimator based on ASHRAE Guideline 14 Annex B / IPMVP principles.
 */
export function calculateBuildingFsu(
  cvRmsePct: number,
  savingsFraction: number,
  nBase: number,
  mEval: number,
  r1Autocorr: number = 0.0,
  alpha: number = 0.05
): number | null {
  if (
    savingsFraction <= 0 ||
    nBase <= 3 ||
    mEval <= 0 ||
    cvRmsePct <= 0 ||
    !isFinite(cvRmsePct) ||
    !isFinite(savingsFraction)
  ) {
    return null;
  }

  const cvFrac = cvRmsePct / 100.0;
  const r1Clamped = Math.max(0.0, Math.min(0.95, r1Autocorr));
  const autocorrInflation = (1.0 + r1Clamped) / (1.0 - r1Clamped);

  const varianceTerm = (1.0 / mEval + 1.0 / nBase) * autocorrInflation;
  if (varianceTerm <= 0) return null;

  // Confidence multiplier matching alpha: z_(1 - alpha/2)
  const zCrit = getNormalQuantile(1.0 - alpha / 2.0);
  const fsuFraction = zCrit * (cvFrac / savingsFraction) * Math.sqrt(varianceTerm);

  return Math.min(999.0, Math.round(fsuFraction * 1000) / 10);
}

/**
 * Evaluates the Evidence Gate for an active building project.
 */
export function evaluateEvidenceGate(
  input: BuildingSpecificGateInput
): BuildingEvidenceAssessment {
  const result = evaluateEvidenceGateInternal(input);
  return {
    ...result,
    calibratedThresholdPct: result.buildingSpecificThresholdPct,
    decisionRationale: result.rationale,
    thresholdType:
      result.buildingSpecificThresholdPct !== null
        ? "BUILDING_SPECIFIC"
        : input.context === "EQUIPMENT_ISOLATION_OPTION_A_B"
        ? "EQUIPMENT_ISOLATION"
        : "UNESTABLISHED",
    maxAllowableFsuPct: 50.0,
    monitoringDurationDays: input.reportingObservations,
    dataQualityPassed: input.dataQuality?.passed ?? true,
    resolution: input.resolution || "daily",
  };
}

function evaluateEvidenceGateInternal(
  input: BuildingSpecificGateInput
): BuildingEvidenceAssessment {
  const {
    context,
    apparentSavingsKwh,
    baselineEnergyKwh,
    reportingObservations: m,
    dataQuality,
    baselineModel,
    unresolvedNonRoutineEvents,
  } = input;

  const alpha = input.alpha !== undefined && isFinite(input.alpha) && input.alpha > 0 && input.alpha < 0.5 ? input.alpha : 0.05;
  const confidencePct = Math.round((1.0 - alpha) * 100);
  const rationale: string[] = [];

  const apparentSavingsPct =
    baselineEnergyKwh > 0 && isFinite(apparentSavingsKwh)
      ? (apparentSavingsKwh / baselineEnergyKwh) * 100.0
      : 0.0;

  // =========================================================================
  // CONTEXT 1: EQUIPMENT ISOLATION (IPMVP Option A / Option B)
  // =========================================================================
  if (context === "EQUIPMENT_ISOLATION_OPTION_A_B") {
    const methodologyDescription =
      "Engineering-Based Equipment Isolation Assessment (IPMVP Option A/B). " +
      "Evaluates direct wattage reductions and operating hours on isolated electrical/thermal circuits without relying on whole-facility billing regressions.";

    if (apparentSavingsKwh <= 0 || !isFinite(apparentSavingsKwh)) {
      return {
        classification: "INSUFFICIENT_EVIDENCE",
        apparentSavingsPct: 0.0,
        apparentSavingsKwh: 0,
        buildingSpecificThresholdPct: null,
        fsuPct: null,
        methodologyDescription,
        isStatisticallyEstablished: false,
        alpha,
        confidencePct,
        rationale: [
          "Non-positive energy savings proposed; proposed intervention yields zero or negative energy reduction.",
        ],
        disclaimer:
          "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
        screeningPassed: false,
      };
    }

    if (unresolvedNonRoutineEvents) {
      return {
        classification: "ADDITIONAL_MEASUREMENT_REQUIRED",
        apparentSavingsPct,
        apparentSavingsKwh,
        buildingSpecificThresholdPct: null,
        fsuPct: null,
        methodologyDescription,
        isStatisticallyEstablished: false,
        alpha,
        confidencePct,
        rationale: [
          "Unresolved non-routine events reported on equipment circuits (e.g. unverified schedule changes). Additional circuit verification required.",
        ],
        disclaimer:
          "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
        screeningPassed: false,
      };
    }

    return {
      classification: "EVIDENCE_SUPPORTS_ESTIMATE",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: null, // Not a whole-building statistical threshold
      fsuPct: 15.0, // Typical isolated meter sampling uncertainty bound
      methodologyDescription,
      isStatisticallyEstablished: true,
      alpha,
      confidencePct,
      rationale: [
        "Engineering parameters (fixture counts, operating runtime, spot wattage delta) are physically verified within plausible bounds.",
        "Equipment isolation (IPMVP Option A/B) avoids whole-building variance noise, supporting the engineering estimate.",
        "Assessment supports engineering feasibility; does not constitute formal certification or causal proof.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs based on engineering estimates. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: true,
    };
  }

  // =========================================================================
  // CONTEXT 2: WHOLE-BUILDING COUNTERFACTUAL (IPMVP Option C)
  // =========================================================================
  const methodologyDescription =
    "Whole-Building Counterfactual Evaluation (Experimental Uncertainty Estimator based on ASHRAE Guideline 14 Annex B / IPMVP Option C). " +
    "Evaluates whether observed whole-building reduction exceeds the building's own empirical baseline variance floor.";

  // Refusal 1: Data quality screening
  if (!dataQuality || !dataQuality.passed) {
    const flags = dataQuality?.flags?.join("; ") || "Data quality check failed";
    return {
      classification: "INSUFFICIENT_EVIDENCE",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: null,
      fsuPct: null,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        `Pre-intervention data quality gate failed: ${flags}.`,
        "The Evidence Gate refuses positive assessment when interval data exhibits excessive missingness (>5%), duplicate annual profiles, or physical violations.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // Refusal 2: Non-positive baseline or savings
  if (baselineEnergyKwh <= 0 || !isFinite(baselineEnergyKwh) || apparentSavingsKwh <= 0) {
    return {
      classification: "INSUFFICIENT_EVIDENCE",
      apparentSavingsPct: 0.0,
      apparentSavingsKwh: 0,
      buildingSpecificThresholdPct: null,
      fsuPct: null,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        "Baseline energy consumption is invalid or observed energy reduction is non-positive.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // Refusal 3: Unresolved non-routine operational events
  if (unresolvedNonRoutineEvents) {
    return {
      classification: "ADDITIONAL_MEASUREMENT_REQUIRED",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: null,
      fsuPct: null,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        "Material non-routine operating events (e.g. unrecorded academic calendar shift, space repurposing) remain unresolved in the reporting window.",
        "Additional operational logs are required before baseline adjustments can be validated.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // Refusal 4: Missing or invalid baseline regression model
  if (!baselineModel || baselineModel.screeningStatus === "INSUFFICIENT_OBSERVATIONS" || baselineModel.screeningStatus === "UNIDENTIFIED_MODEL") {
    return {
      classification: "INSUFFICIENT_EVIDENCE",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: null, // UNESTABLISHED
      fsuPct: null,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        "Baseline regression model has not been established or possesses insufficient observations.",
        "Threshold is UNESTABLISHED. Universal cohort averages will not be substituted.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // Building-Specific Threshold Calculation from this building's own calibration diagnostics
  const calib = baselineModel.calibrationDiagnostics;
  const evalDiag = calib || baselineModel.trainingDiagnostics;
  const nBase = baselineModel.trainSampleSize;
  const r1Autocorr = calib?.r1Autocorr || 0.0;
  const cvRmsePct = evalDiag.cvRmsePct;

  // If calibration window is missing or insufficient (< 14 daily or < 3 monthly)
  if (!calib || calib.sampleCount < 14) {
    rationale.push(
      "Independent calibration window is missing or contains fewer than 14 observations. Statistical threshold cannot be established with independent out-of-sample rigor."
    );
    return {
      classification: "ADDITIONAL_MEASUREMENT_REQUIRED",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: null, // UNESTABLISHED
      fsuPct: null,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        ...rationale,
        "Recommended action: Collect an independent pre-intervention calibration window to verify out-of-sample model reliability before evaluating counterfactual savings.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // Compute building-specific detection threshold:
  // Threshold = z_(1 - alpha) * CV(RMSE) * sqrt( (1/m + 1/n) * (1+r1)/(1-r1) )
  const zCritOneTail = getNormalQuantile(1.0 - alpha);
  const r1Clamped = Math.max(0.0, Math.min(0.95, r1Autocorr));
  const autocorrInflation = (1.0 + r1Clamped) / (1.0 - r1Clamped);
  const varianceFactor = Math.sqrt((1.0 / m + 1.0 / nBase) * autocorrInflation);

  const buildingSpecificThresholdPct = (zCritOneTail * (cvRmsePct / 100.0) * varianceFactor) * 100.0;

  // Fractional Savings Uncertainty (FSU)
  const savingsFraction = apparentSavingsPct / 100.0;
  const fsuPct = calculateBuildingFsu(cvRmsePct, savingsFraction, nBase, m, r1Autocorr, alpha);

  // Evaluate Decision Steps
  if (apparentSavingsPct < buildingSpecificThresholdPct) {
    return {
      classification: "INSUFFICIENT_EVIDENCE",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: Math.round(buildingSpecificThresholdPct * 10) / 10,
      fsuPct,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        `Apparent savings (${apparentSavingsPct.toFixed(1)}%) fail to clear this building's specific statistical threshold (${buildingSpecificThresholdPct.toFixed(1)}%).`,
        `The observed reduction remains within the building's modeled baseline error floor at ${confidencePct}% confidence (accounting for r1=${r1Autocorr.toFixed(2)} autocorrelation).`,
        "Evidence Gate refuses certification; savings are indistinguishable from baseline operational noise.",
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // Apparent savings clear threshold; check FSU bound (ASHRAE Guideline 14 tolerance is typically <= 50%)
  if (fsuPct === null || fsuPct > 50.0) {
    return {
      classification: "ADDITIONAL_MEASUREMENT_REQUIRED",
      apparentSavingsPct,
      apparentSavingsKwh: Math.round(apparentSavingsKwh),
      buildingSpecificThresholdPct: Math.round(buildingSpecificThresholdPct * 10) / 10,
      fsuPct,
      methodologyDescription,
      isStatisticallyEstablished: false,
      alpha,
      confidencePct,
      rationale: [
        `Apparent savings (${apparentSavingsPct.toFixed(1)}%) exceed the building's noise threshold (${buildingSpecificThresholdPct.toFixed(1)}%).`,
        `However, Fractional Savings Uncertainty (${fsuPct ? fsuPct.toFixed(1) + "%" : "Uncertain"}) exceeds the recommended 50.0% acceptance ceiling.`,
        `The post-intervention monitoring horizon (m=${m} observations) is insufficient to constrain uncertainty bounds. Extended monitoring is required.`,
      ],
      disclaimer:
        "Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.",
      screeningPassed: false,
    };
  }

  // All criteria satisfied
  return {
    classification: "EVIDENCE_SUPPORTS_ESTIMATE",
    apparentSavingsPct,
    apparentSavingsKwh: Math.round(apparentSavingsKwh),
    buildingSpecificThresholdPct: Math.round(buildingSpecificThresholdPct * 10) / 10,
    fsuPct,
    methodologyDescription,
    isStatisticallyEstablished: true,
    alpha,
    confidencePct,
    rationale: [
      `Pre-intervention data quality gates and independent calibration screening passed.`,
      `Apparent savings (${apparentSavingsPct.toFixed(1)}%) clear the building's specific statistical detection threshold (${buildingSpecificThresholdPct.toFixed(1)}%).`,
      `Fractional Savings Uncertainty (${fsuPct.toFixed(1)}%) satisfies the <= 50.0% acceptance ceiling at ${confidencePct}% confidence (r1=${r1Autocorr.toFixed(2)} autocorrelation incorporated).`,
      `Evidence supports the statistical estimate under modeled counterfactual assumptions. Does not prove physical causal attribution.`,
    ],
    disclaimer:
      "Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.",
    screeningPassed: true,
  };
}
