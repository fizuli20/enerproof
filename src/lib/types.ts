export type Resolution = "hourly" | "daily" | "monthly";

export type EvidenceClassification =
  | "EVIDENCE_SUPPORTS_ESTIMATE"
  | "ADDITIONAL_MEASUREMENT_REQUIRED"
  | "INSUFFICIENT_EVIDENCE";

export interface DataQualitySummary {
  totalRows: number;
  missingRows: number;
  missingPct: number;
  zeroCount: number;
  zeroPct: number;
  maxConsecutiveZeros: number;
  hasNegativeValues: boolean;
  hasDuplicateAnnualProfile: boolean;
  isContinuousTimestamps: boolean;
  flags: string[];
  passed: boolean;
}

export interface BHOSAuditResult {
  temporalIndependencePass: boolean;
  duplicatedRecordCount: number;
  duplicatedPercentage: number;
  emissionsArithmeticPass: boolean;
  reportedEmissionsTonnes: number;
  calculatedEmissionsTonnes: number;
  emissionsDiscrepancyFactor: number;
  spatialDisaggregationPass: boolean;
  submeteringStatus: string;
  boilerSeasonalityPct: number;
  overallAuditStatus: "REJECT" | "ACCEPT_WITH_RESERVATIONS" | "VERIFIED";
  recommendations: string[];
}

export interface InterventionParams {
  id: string;
  name: string;
  category: "lighting" | "hvac" | "plug_load" | "thermal_water" | "boiler";
  capitalCostAzn: number;
  annualKwhSavings: number;
  annualFuelSavingsM3?: number;
  annualCostSavingsAzn: number;
  simplePaybackYears: number;
  avoidedCo2TonnesYear: number;
  notes: string;
}

export interface BaselineRegressionResult {
  r2: number;
  rmse: number;
  cvRmsePct: number;
  nmbePct: number;
  ashraeCompliant: boolean;
  coefficients: {
    intercept: number;
    hddCoeff: number;
    cddCoeff: number;
    occCoeff?: number;
  };
  sampleSize: number;
  predictedSeries: number[];
  actualSeries: number[];
  dates: string[];
}

export interface EvidenceGateAssessment {
  classification: EvidenceClassification;
  apparentSavingsPct: number;
  apparentSavingsKwh: number;
  calibratedThresholdPct: number;
  fsuPct: number;
  maxAllowableFsuPct: number;
  alpha: number;
  confidencePct: number;
  monitoringDurationDays: number;
  dataQualityPassed: boolean;
  resolution: Resolution;
  decisionRationale: string[];
  disclaimer: string;
}

export interface PortfolioAggregationResult {
  buildingCount: number;
  totalBaselineKwh: number;
  totalApparentSavingsKwh: number;
  portfolioSavingsPct: number;
  individualMdePct: number;
  theoreticalPortfolioMdePct: number;
  empiricalPortfolioMdePct: number;
  crossBuildingCorrelation: number;
  pooledDetectionPowerPct: number;
}
