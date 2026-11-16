import {
  EvidenceClassification,
  EvidenceGateAssessment,
  Resolution,
  DataQualitySummary,
} from "../types";

export interface EvidenceGateInput {
  apparentSavingsKwh: number;
  baselineKwh: number;
  cvRmsePct: number;
  baselineObservations: number; // n
  reportingObservations: number; // m
  resolution: Resolution;
  dataQuality: DataQualitySummary;
  alpha?: number; // default 0.05 (95% confidence)
}

// Empirical mean thresholds derived from 152-building BDG2 research benchmark
export const CALIBRATED_BENCHMARK_THRESHOLDS: Record<
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
    cohortStatus: "UNESTABLISHED (False Alarm Rate 7.0% > 5%)",
  },
  daily: {
    empiricalThresholdPct: 11.8,
    syntheticNullFpr: 0.0421,
    historicalPlaceboFar: 0.2238,
    ashraeTheoreticalMdePct: 42.5,
    cohortStatus: "15.0% (Synthetic FPR <= 5%)",
  },
  monthly: {
    empiricalThresholdPct: 13.64,
    syntheticNullFpr: 0.0681,
    historicalPlaceboFar: 0.1818,
    ashraeTheoreticalMdePct: 83.0,
    cohortStatus: "UNESTABLISHED (False Alarm Rate 6.8% > 5%)",
  },
};

/**
 * Calculates Fractional Savings Uncertainty (FSU) according to ASHRAE Guideline 14-2014 Annex B.
 */
export function calculateAshraeFsu(
  cvRmsePct: number,
  savingsFraction: number,
  n: number,
  m: number,
  tStat: number = 1.96,
  r1Autocorr: number = 0.0
): number {
  if (savingsFraction <= 0 || n <= 0 || m <= 0 || cvRmsePct <= 0) {
    return 999.0;
  }
  const cvRmseFraction = cvRmsePct / 100;
  const r1Clamped = Math.max(0.0, Math.min(0.95, r1Autocorr));
  const autocorrFactor = (1.0 + r1Clamped) / (1.0 - r1Clamped);
  const varTerm = (1.0 / m + 1.0 / n) * autocorrFactor;
  const fsuFraction = tStat * (cvRmseFraction / savingsFraction) * Math.sqrt(varTerm);
  return Math.min(999.0, Math.round(fsuFraction * 1000) / 10);
}

export function evaluateEvidenceGate(
  input: EvidenceGateInput
): EvidenceGateAssessment {
  const {
    apparentSavingsKwh,
    baselineKwh,
    cvRmsePct,
    baselineObservations: n,
    reportingObservations: m,
    resolution,
    dataQuality,
  } = input;

  const alpha = input.alpha ?? 0.05;
  const confidencePct = Math.round((1 - alpha) * 100);
  const maxAllowableFsuPct = 50.0;
  const benchmark = CALIBRATED_BENCHMARK_THRESHOLDS[resolution];
  const thresholdPct = benchmark.empiricalThresholdPct;

  const apparentSavingsPct =
    baselineKwh > 0
      ? Math.round((apparentSavingsKwh / baselineKwh) * 1000) / 10
      : 0;

  const savingsFraction = Math.max(0.001, apparentSavingsPct / 100);
  const fsuPct = calculateAshraeFsu(cvRmsePct, savingsFraction, n, m, 1.96);

  const rationale: string[] = [];
  let classification: EvidenceClassification = "INSUFFICIENT_EVIDENCE";

  // Stage 1: Data Quality Screening
  if (!dataQuality.passed) {
    classification = "INSUFFICIENT_EVIDENCE";
    rationale.push(
      `Pre-intervention data quality gate failed: ${dataQuality.flags.join("; ")}.`
    );
    rationale.push(
      "The Evidence Gate refuses certification when underlying interval data exhibits excessive missingness, duplicate annual profiles, or physical violations."
    );
  } else {
    rationale.push("Pre-intervention data quality gates passed successfully.");

    // Stage 2: Apparent Savings vs Calibrated Empirical Threshold
    if (apparentSavingsPct < thresholdPct) {
      classification = "INSUFFICIENT_EVIDENCE";
      rationale.push(
        `Apparent savings (${apparentSavingsPct.toFixed(1)}%) fail to clear the calibrated ${resolution} Evidence Gate threshold (${thresholdPct.toFixed(1)}%).`
      );
      rationale.push(
        `Observed reduction is within the expected baseline noise / variance floor for ${resolution} resolution.`
      );
    } else {
      // Savings clear threshold. Check Uncertainty (FSU)
      rationale.push(
        `Apparent savings (${apparentSavingsPct.toFixed(1)}%) exceed the calibrated threshold (${thresholdPct.toFixed(1)}%).`
      );

      if (fsuPct > maxAllowableFsuPct) {
        classification = "ADDITIONAL_MEASUREMENT_REQUIRED";
        rationale.push(
          `Fractional Savings Uncertainty (${fsuPct.toFixed(1)}%) exceeds the ASHRAE Guideline 14 allowable maximum of ${maxAllowableFsuPct}%.`
        );
        rationale.push(
          `Extended monitoring period (currently m=${m} observations) is required to reduce variance before statistical estimate support can be claimed.`
        );
      } else {
        classification = "EVIDENCE_SUPPORTS_ESTIMATE";
        rationale.push(
          `Fractional Savings Uncertainty (${fsuPct.toFixed(1)}%) satisfies the ASHRAE Guideline 14 tolerance (≤ ${maxAllowableFsuPct}% at 95% confidence).`
        );
        rationale.push(
          `Evidence supports the statistical estimate under modeled counterfactual baseline assumptions.`
        );
      }
    }
  }

  // Duration context
  const approxDays =
    resolution === "hourly"
      ? Math.round(m / 24)
      : resolution === "daily"
      ? m
      : Math.round(m * 30.4);

  return {
    classification,
    apparentSavingsPct,
    apparentSavingsKwh: Math.round(apparentSavingsKwh),
    calibratedThresholdPct: thresholdPct,
    fsuPct,
    maxAllowableFsuPct,
    alpha,
    confidencePct,
    monitoringDurationDays: approxDays,
    dataQualityPassed: dataQuality.passed,
    resolution,
    decisionRationale: rationale,
    disclaimer:
      "Evidence assessments are analytical decision-support outputs based on modeled counterfactual baselines. They do not constitute formal regulatory certification or prove causal attribution.",
  };
}
