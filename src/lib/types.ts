export type Resolution = "hourly" | "daily" | "monthly";

export type EvidenceClassification =
  | "EVIDENCE_SUPPORTS_ESTIMATE"
  | "ADDITIONAL_MEASUREMENT_REQUIRED"
  | "INSUFFICIENT_EVIDENCE";

export type ProjectId = string;

export interface BuildingMetadata {
  id: ProjectId;
  name: string;
  facilityType: string;
  location: string;
  leadAuditor: string;
  createdDate: string;
  lastUpdatedDate: string;
  isDemoProject?: boolean;
  demoType?: "bhos_audit" | "student_residence" | "research_portfolio";
}

export interface TariffSettings {
  electricityTariffAznPerKwh: number;
  naturalGasTariffAznPerM3: number;
  gridEmissionsFactorKgPerKwh: number | null; // null if unvalidated
  gasEmissionsFactorKgPerM3: number;
  sourceNote: string;
}

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

export interface MeasurementPlan {
  recommendedOption: "IPMVP Option A" | "IPMVP Option B" | "IPMVP Option C";
  optionTitle: string;
  rationale: string;
  meteringBoundary: string;
  recommendedHardware: string[];
  loggingIntervalMinutes: number;
  minimumRecommendedDurationDays: number;
  expectedFsuPct: number;
  riskMitigation: string[];
}

export interface StaleFlags {
  baselineStale: boolean;
  interventionsStale: boolean;
  measurementStale: boolean;
  evidenceGateStale: boolean;
  reportsStale: boolean;
}

export interface FullProjectState {
  version: "2.0.0";
  metadata: BuildingMetadata;
  tariffs: TariffSettings;
  staleFlags: StaleFlags;
  rawDataset?: {
    fileName: string;
    rowCount: number;
    uploadedAt: string;
  };
  auditSummary?: DataQualitySummary;
  bhosAudit?: BHOSAuditResult;
  baselineResult?: import("./baseline/regression").BaselineRegressionResult | null;
  interventions: import("./interventions/calculators").BaseEcmResult[];
  measurementPlan?: MeasurementPlan;
  evidenceAssessment?: import("./evidence/evidence-gate").BuildingEvidenceAssessment | null;
  reportingObservationsCount: number;
  unresolvedNonRoutineEvents: boolean;
}

export type { BaselineRegressionResult } from "./baseline/regression";
export type { BuildingEvidenceAssessment } from "./evidence/evidence-gate";
export type { BaseEcmResult } from "./interventions/calculators";

