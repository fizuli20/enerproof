/**
 * EnerProof Baseline Regression Engine (V2)
 *
 * Implements strict chronological separation:
 * TRAIN (Baseline) → CALIBRATE (Independent Evaluation) → REPORT (Counterfactual Prediction)
 *
 * Preserves full coefficient precision, reports transparent diagnostics including
 * out-of-sample CV(RMSE), NMBE, unclipped R² (including negative values), and lag-1 autocorrelation.
 */

import { Resolution } from "../types";

export interface TimeSeriesObservation {
  date: string;
  energyKwh: number;
  hdd: number;
  cdd: number;
  occupancy?: number | null;
}

export type ScreeningStatus =
  | "MEETS_SCREENING_CRITERIA"
  | "BORDERLINE"
  | "EXCEEDS_RECOMMENDED_LIMITS"
  | "INSUFFICIENT_OBSERVATIONS"
  | "UNIDENTIFIED_MODEL";

export interface ModelDiagnostics {
  r2: number;
  rmse: number;
  cvRmsePct: number;
  nmbePct: number;
  sampleCount: number;
}

export interface BaselineRegressionResult {
  coefficients: {
    intercept: number;
    hddCoeff: number;
    cddCoeff: number;
    occCoeff: number | null;
  };
  hasOccupancyFeature: boolean;
  trainingDiagnostics: ModelDiagnostics;
  calibrationDiagnostics: (ModelDiagnostics & { r1Autocorr: number }) | null;
  screeningStatus: ScreeningStatus;
  screeningNotes: string[];
  trainSampleSize: number;
  calibSampleSize: number;
  hasNegativePredictions: boolean;
  cvRmsePct?: number;
  r2?: number;
  autocorrelationR1?: number;
}

export interface PredictionPoint {
  date: string;
  actualEnergyKwh?: number;
  counterfactualKwh: number;
  hdd: number;
  cdd: number;
  occupancy?: number | null;
}

/**
 * Solves (X^T X + lambda I) beta = X^T y using Gaussian elimination with partial pivoting.
 * Retains double-precision floating point accuracy.
 */
function solveRidgeSystem(
  X: number[][],
  y: number[],
  lambda: number = 0.01
): { beta: number[]; conditionOk: boolean } {
  const n = X.length;
  const p = X[0].length;

  const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  const Xty: number[] = Array(p).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      Xty[j] += X[i][j] * y[i];
      for (let k = 0; k < p; k++) {
        XtX[j][k] += X[i][j] * X[i][k];
      }
    }
  }

  // Regularize non-intercept features
  for (let j = 1; j < p; j++) {
    XtX[j][j] += lambda;
  }

  // Augmented matrix [A | b]
  const M: number[][] = XtX.map((row, i) => [...row, Xty[i]]);

  for (let i = 0; i < p; i++) {
    let maxRow = i;
    for (let k = i + 1; k < p; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-11) {
      return { beta: Array(p).fill(0), conditionOk: false };
    }

    for (let k = 0; k < p; k++) {
      if (k !== i) {
        const factor = M[k][i] / M[i][i];
        for (let j = i; j <= p; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  const beta = M.map((row, i) => row[p] / row[i]);
  return { beta, conditionOk: true };
}

/**
 * Calculates standard regression diagnostics.
 * Preserves true unclipped R², which can be negative for out-of-sample forecasts.
 */
function calculateDiagnostics(
  actual: number[],
  predicted: number[],
  degreeOfFreedomCorrection: boolean = true,
  pParams: number = 3
): ModelDiagnostics {
  const n = actual.length;
  if (n === 0) {
    return { r2: 0, rmse: 0, cvRmsePct: 0, nmbePct: 0, sampleCount: 0 };
  }

  let sumY = 0;
  for (let i = 0; i < n; i++) sumY += actual[i];
  const meanY = sumY / n;

  let ssTot = 0;
  let ssRes = 0;
  let sumDiff = 0;

  for (let i = 0; i < n; i++) {
    const diff = actual[i] - predicted[i];
    ssRes += diff * diff;
    ssTot += (actual[i] - meanY) * (actual[i] - meanY);
    sumDiff += diff;
  }

  // Out-of-sample R² can be negative if model performs worse than historical mean
  const r2 = ssTot > 1e-9 ? 1.0 - ssRes / ssTot : 0.0;

  const df = degreeOfFreedomCorrection ? Math.max(1, n - pParams) : n;
  const rmse = Math.sqrt(ssRes / df);
  const cvRmsePct = meanY > 1e-9 ? (rmse / meanY) * 100 : 0;
  // ASHRAE formula for NMBE: sum(y - y_hat) / (df * mean_y) * 100
  const nmbePct = meanY > 1e-9 ? (sumDiff / (df * meanY)) * 100 : 0;

  return {
    r2,
    rmse,
    cvRmsePct,
    nmbePct,
    sampleCount: n,
  };
}

/**
 * Trains a baseline model with proper chronological separation:
 * 1. Train on trainingData
 * 2. Evaluate out-of-sample on calibrationData
 * 3. Freeze parameters
 */
export function trainDegreeDayBaseline(
  trainingData: TimeSeriesObservation[],
  calibrationData: TimeSeriesObservation[] = [],
  resolution: Resolution = "daily",
  ridgeLambda: number = 0.01
): BaselineRegressionResult {
  const notes: string[] = [];

  // Minimum required observations
  const minRequiredTrain = resolution === "monthly" ? 12 : resolution === "daily" ? 30 : 168;

  if (trainingData.length < minRequiredTrain) {
    return {
      coefficients: { intercept: 0, hddCoeff: 0, cddCoeff: 0, occCoeff: null },
      hasOccupancyFeature: false,
      trainingDiagnostics: { r2: 0, rmse: 0, cvRmsePct: 0, nmbePct: 0, sampleCount: trainingData.length },
      calibrationDiagnostics: null,
      screeningStatus: "INSUFFICIENT_OBSERVATIONS",
      screeningNotes: [
        `Training dataset contains ${trainingData.length} observations; minimum required for ${resolution} baseline is ${minRequiredTrain}.`,
      ],
      trainSampleSize: trainingData.length,
      calibSampleSize: calibrationData.length,
      hasNegativePredictions: false,
    };
  }

  // Check if occupancy is reliably provided (defined on > 70% of rows)
  const occCount = trainingData.filter(
    (r) => r.occupancy !== undefined && r.occupancy !== null && isFinite(r.occupancy)
  ).length;
  const hasOccupancyFeature = occCount >= trainingData.length * 0.7;

  // Construct training design matrix
  const X_train: number[][] = [];
  const y_train: number[] = [];

  for (const r of trainingData) {
    if (!isFinite(r.energyKwh) || r.energyKwh < 0) continue;
    const hdd = isFinite(r.hdd) ? Math.max(0, r.hdd) : 0;
    const cdd = isFinite(r.cdd) ? Math.max(0, r.cdd) : 0;
    if (hasOccupancyFeature) {
      const occ = r.occupancy !== undefined && r.occupancy !== null && isFinite(r.occupancy) ? r.occupancy : 1.0;
      X_train.push([1.0, hdd, cdd, occ]);
    } else {
      X_train.push([1.0, hdd, cdd]);
    }
    y_train.push(r.energyKwh);
  }

  if (X_train.length < minRequiredTrain) {
    return {
      coefficients: { intercept: 0, hddCoeff: 0, cddCoeff: 0, occCoeff: null },
      hasOccupancyFeature,
      trainingDiagnostics: { r2: 0, rmse: 0, cvRmsePct: 0, nmbePct: 0, sampleCount: X_train.length },
      calibrationDiagnostics: null,
      screeningStatus: "INSUFFICIENT_OBSERVATIONS",
      screeningNotes: ["Insufficient valid observations after removing non-finite or negative energy records."],
      trainSampleSize: X_train.length,
      calibSampleSize: calibrationData.length,
      hasNegativePredictions: false,
    };
  }

  // Fit Ridge regression
  const { beta, conditionOk } = solveRidgeSystem(X_train, y_train, ridgeLambda);

  if (!conditionOk) {
    return {
      coefficients: { intercept: 0, hddCoeff: 0, cddCoeff: 0, occCoeff: null },
      hasOccupancyFeature,
      trainingDiagnostics: { r2: 0, rmse: 0, cvRmsePct: 0, nmbePct: 0, sampleCount: X_train.length },
      calibrationDiagnostics: null,
      screeningStatus: "UNIDENTIFIED_MODEL",
      screeningNotes: ["Collinear design matrix; unable to identify stable regression coefficients."],
      trainSampleSize: X_train.length,
      calibSampleSize: calibrationData.length,
      hasNegativePredictions: false,
    };
  }

  // Predict on training set
  let hasNegativePredictions = false;
  const p_train = X_train.map((row) => {
    let val = 0;
    for (let j = 0; j < row.length; j++) val += beta[j] * row[j];
    if (val < 0) hasNegativePredictions = true;
    return val;
  });

  const trainingDiagnostics = calculateDiagnostics(y_train, p_train, true, beta.length);

  // Evaluate on independent calibration window if provided
  let calibrationDiagnostics: (ModelDiagnostics & { r1Autocorr: number }) | null = null;

  if (calibrationData.length > 0) {
    const y_calib: number[] = [];
    const p_calib: number[] = [];

    for (const r of calibrationData) {
      if (!isFinite(r.energyKwh) || r.energyKwh < 0) continue;
      const hdd = isFinite(r.hdd) ? Math.max(0, r.hdd) : 0;
      const cdd = isFinite(r.cdd) ? Math.max(0, r.cdd) : 0;
      let val = beta[0] + beta[1] * hdd + beta[2] * cdd;
      if (hasOccupancyFeature) {
        const occ = r.occupancy !== undefined && r.occupancy !== null && isFinite(r.occupancy) ? r.occupancy : 1.0;
        val += beta[3] * occ;
      }
      if (val < 0) hasNegativePredictions = true;
      y_calib.push(r.energyKwh);
      p_calib.push(val);
    }

    if (y_calib.length >= 5) {
      const diag = calculateDiagnostics(y_calib, p_calib, false);

      // Calculate lag-1 autocorrelation on calibration residuals
      const res = y_calib.map((act, i) => act - p_calib[i]);
      let sumResSq = 0;
      let sumLagProd = 0;
      for (let i = 0; i < res.length; i++) {
        sumResSq += res[i] * res[i];
        if (i > 0) {
          sumLagProd += res[i] * res[i - 1];
        }
      }
      const r1Autocorr = sumResSq > 1e-8 ? Math.max(0.0, Math.min(0.95, sumLagProd / sumResSq)) : 0.0;

      calibrationDiagnostics = {
        ...diag,
        r1Autocorr,
      };
    }
  }

  // Determine screening status based on independent calibration (or training if calib missing)
  const evalDiag = calibrationDiagnostics || trainingDiagnostics;
  const maxCvRmse = resolution === "monthly" ? 15.0 : 25.0;
  const maxNmbe = 5.0;

  let screeningStatus: ScreeningStatus = "EXCEEDS_RECOMMENDED_LIMITS";

  if (calibrationDiagnostics === null) {
    notes.push(
      "No independent calibration window provided; diagnostics reflect in-sample training fit only. Out-of-sample reliability unverified."
    );
    if (trainingDiagnostics.cvRmsePct <= maxCvRmse && Math.abs(trainingDiagnostics.nmbePct) <= maxNmbe) {
      screeningStatus = "BORDERLINE";
    }
  } else {
    notes.push(
      `Model evaluated on ${calibrationData.length} independent calibration observations.`
    );
    if (evalDiag.cvRmsePct <= maxCvRmse && Math.abs(evalDiag.nmbePct) <= maxNmbe && evalDiag.r2 > 0.5) {
      screeningStatus = "MEETS_SCREENING_CRITERIA";
      notes.push("Out-of-sample diagnostics satisfy recommended screening guidelines.");
    } else if (evalDiag.cvRmsePct <= maxCvRmse * 1.4 && Math.abs(evalDiag.nmbePct) <= maxNmbe * 2.0) {
      screeningStatus = "BORDERLINE";
      notes.push("Out-of-sample forecast accuracy is borderline; uncertainty bounds will be wider.");
    } else {
      screeningStatus = "EXCEEDS_RECOMMENDED_LIMITS";
      notes.push("Out-of-sample forecast accuracy exceeds acceptable variance thresholds.");
    }
  }

  if (hasNegativePredictions) {
    notes.push("Model predicted negative energy consumption for some extreme weather conditions.");
  }

  return {
    coefficients: {
      intercept: beta[0],
      hddCoeff: beta[1],
      cddCoeff: beta[2],
      occCoeff: hasOccupancyFeature ? beta[3] : null,
    },
    hasOccupancyFeature,
    trainingDiagnostics,
    calibrationDiagnostics,
    screeningStatus,
    screeningNotes: notes,
    trainSampleSize: X_train.length,
    calibSampleSize: calibrationData.length,
    hasNegativePredictions,
    cvRmsePct: calibrationDiagnostics?.cvRmsePct ?? trainingDiagnostics.cvRmsePct,
    r2: calibrationDiagnostics?.r2 ?? trainingDiagnostics.r2,
    autocorrelationR1: calibrationDiagnostics?.r1Autocorr ?? 0.0,
  };
}

/**
 * Predicts counterfactual baseline energy for the post-intervention reporting period.
 * Parameters are strictly frozen.
 */
export function predictCounterfactual(
  coefficients: BaselineRegressionResult["coefficients"],
  observations: Array<{ hdd: number; cdd: number; occupancy?: number | null }>
): number[] {
  const { intercept, hddCoeff, cddCoeff, occCoeff } = coefficients;
  return observations.map((r) => {
    let pred = intercept + hddCoeff * Math.max(0, r.hdd) + cddCoeff * Math.max(0, r.cdd);
    if (occCoeff !== null) {
      const occ = r.occupancy !== undefined && r.occupancy !== null && isFinite(r.occupancy) ? r.occupancy : 1.0;
      pred += occCoeff * occ;
    }
    return pred; // Note: do NOT silently clamp to 0; return linear model output
  });
}
