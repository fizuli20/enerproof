import { BaselineRegressionResult, Resolution } from "../types";

export interface RegressionInputRow {
  date: string;
  actualKwh: number;
  hdd: number;
  cdd: number;
  occupancy?: number;
}

/**
 * Solve linear system (X^T X + lambda I) beta = X^T y using Gaussian elimination with partial pivoting.
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  // Augmented matrix
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    // Swap rows
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    // Pivot check
    if (Math.abs(M[i][i]) < 1e-12) {
      M[i][i] = 1e-12; // Numerical stability
    }

    // Eliminate below and above
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  return M.map((row, i) => row[n] / row[i]);
}

export function trainDegreeDayBaseline(
  rows: RegressionInputRow[],
  resolution: Resolution = "daily",
  ridgeLambda: number = 0.01
): BaselineRegressionResult {
  const n = rows.length;
  if (n < 4) {
    throw new Error("Insufficient data points for baseline regression (minimum 4 required).");
  }

  const hasOcc = rows.some((r) => r.occupancy !== undefined && r.occupancy > 0);
  const p = hasOcc ? 4 : 3; // number of features including intercept

  // Construct design matrix X and target y
  const X: number[][] = [];
  const y: number[] = [];
  const dates: string[] = [];

  for (const r of rows) {
    if (hasOcc) {
      X.push([1.0, r.hdd, r.cdd, r.occupancy ?? 1.0]);
    } else {
      X.push([1.0, r.hdd, r.cdd]);
    }
    y.push(r.actualKwh);
    dates.push(r.date);
  }

  // Compute X^T X and X^T y
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

  // Add Ridge L2 regularization to diagonal (excluding intercept)
  for (let j = 1; j < p; j++) {
    XtX[j][j] += ridgeLambda;
  }

  // Solve for beta coefficients
  const beta = solveLinearSystem(XtX, Xty);

  // Predictions and metrics
  const predictedSeries: number[] = [];
  let ssTot = 0;
  let ssRes = 0;
  let sumY = 0;
  let sumDiff = 0;

  for (let i = 0; i < n; i++) {
    sumY += y[i];
  }
  const meanY = sumY / n;

  for (let i = 0; i < n; i++) {
    let pred = 0;
    for (let j = 0; j < p; j++) {
      pred += beta[j] * X[i][j];
    }
    predictedSeries.push(Math.round(pred * 10) / 10);

    const diff = y[i] - pred;
    ssRes += diff * diff;
    ssTot += (y[i] - meanY) * (y[i] - meanY);
    sumDiff += diff;
  }

  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  const df = Math.max(1, n - p);
  const rmse = Math.sqrt(ssRes / df);
  const cvRmsePct = meanY > 0 ? (rmse / meanY) * 100 : 0;
  const nmbePct = meanY > 0 ? (sumDiff / (df * meanY)) * 100 : 0;

  // ASHRAE Guideline 14 criteria:
  // Daily: CV(RMSE) <= 25%, NMBE <= +-5%
  // Monthly: CV(RMSE) <= 15%, NMBE <= +-5%
  const maxAllowableCvRmse = resolution === "monthly" ? 15.0 : 25.0;
  const ashraeCompliant = cvRmsePct <= maxAllowableCvRmse && Math.abs(nmbePct) <= 5.0;

  return {
    r2: Math.round(r2 * 1000) / 1000,
    rmse: Math.round(rmse * 10) / 10,
    cvRmsePct: Math.round(cvRmsePct * 10) / 10,
    nmbePct: Math.round(nmbePct * 10) / 10,
    ashraeCompliant,
    coefficients: {
      intercept: Math.round(beta[0] * 100) / 100,
      hddCoeff: Math.round(beta[1] * 100) / 100,
      cddCoeff: Math.round(beta[2] * 100) / 100,
      occCoeff: hasOcc ? Math.round(beta[3] * 100) / 100 : undefined,
    },
    sampleSize: n,
    predictedSeries,
    actualSeries: y,
    dates,
  };
}

export function predictCounterfactual(
  coefficients: BaselineRegressionResult["coefficients"],
  rows: { hdd: number; cdd: number; occupancy?: number }[]
): number[] {
  return rows.map((r) => {
    let val = coefficients.intercept + coefficients.hddCoeff * r.hdd + coefficients.cddCoeff * r.cdd;
    if (coefficients.occCoeff !== undefined && r.occupancy !== undefined) {
      val += coefficients.occCoeff * r.occupancy;
    }
    return Math.max(0, Math.round(val * 10) / 10);
  });
}
