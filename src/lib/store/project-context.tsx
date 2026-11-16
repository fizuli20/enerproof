"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FullProjectState,
  BuildingMetadata,
  TariffSettings,
  DataQualitySummary,
  BHOSAuditResult,
  MeasurementPlan,
} from "../types";
import {
  calculateLightingRetrofit,
  calculateHvacScheduling,
  calculatePlugLoad,
  calculateThermalWater,
  calculateBoilerOptimization,
  BaseEcmResult,
} from "../interventions/calculators";
import { BaselineRegressionResult } from "../baseline/regression";
import { BuildingEvidenceAssessment } from "../evidence/evidence-gate";
import { generateMeasurementPlan } from "../measurement/planner";
import { ILLUSTRATIVE_AZN_TARIFF_PER_KWH, ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS } from "../energy/units";

const STORAGE_KEY_CURRENT = "enerproof_v2_current_project";
const STORAGE_KEY_SAVED_LIST = "enerproof_v2_saved_projects";

const DEFAULT_TARIFFS: TariffSettings = {
  electricityTariffAznPerKwh: ILLUSTRATIVE_AZN_TARIFF_PER_KWH,
  naturalGasTariffAznPerM3: ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS,
  gridEmissionsFactorKgPerKwh: 0.5, // Labeled as illustrative case input
  gasEmissionsFactorKgPerM3: 1.9,
  sourceNote: "Illustrative non-residential rate assumption for Azerbaijan.",
};

const DEFAULT_METADATA: BuildingMetadata = {
  id: "student-residence-01",
  name: "Baku Student Residence Hall 1",
  facilityType: "University Dormitory & Living Complex",
  location: "Baku, Absheron Peninsula",
  leadAuditor: "Fizuli Hasanov",
  createdDate: "2026-11-16",
  lastUpdatedDate: "2026-11-16",
  isDemoProject: true,
  demoType: "student_residence",
};

export function createDefaultStudentResidenceProject(): FullProjectState {
  const tariffs = { ...DEFAULT_TARIFFS };

  // 5 verified ECMs
  const lighting = calculateLightingRetrofit({
    fixtureCount: 500,
    baselineWattsPerFixture: 64,
    retrofitWattsPerFixture: 24,
    operatingHoursPerDay: 12,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: 35,
    tariffPerKwh: tariffs.electricityTariffAznPerKwh,
    emissionsFactorKgPerKwh: tariffs.gridEmissionsFactorKgPerKwh,
  });

  const hvac = calculateHvacScheduling({
    coolingCapacityKw: 120,
    baselineRuntimeHoursWeek: 70,
    optimizedRuntimeHoursWeek: 45,
    operatingWeeksYear: 26,
    averageLoadFactor: 0.7,
    implementationCostAzn: 4500,
    comfortVentilationConfirmed: true,
    tariffPerKwh: tariffs.electricityTariffAznPerKwh,
    emissionsFactorKgPerKwh: tariffs.gridEmissionsFactorKgPerKwh,
  });

  const plug = calculatePlugLoad({
    workstationCount: 200,
    baselineIdleWatts: 45,
    smartPlugIdleWatts: 5,
    idleHoursPerDay: 14,
    idleDaysPerYear: 365,
    smartPlugCostPerUnitAzn: 25,
    tariffPerKwh: tariffs.electricityTariffAznPerKwh,
    emissionsFactorKgPerKwh: tariffs.gridEmissionsFactorKgPerKwh,
  });

  const thermal = calculateThermalWater({
    dailyHotWaterLiters: 10000,
    deltaTempC: 45,
    baselineEfficiency: 0.8,
    solarThermalFraction: 0.5,
    systemCostAzn: 28000,
    gasTariffPerM3: tariffs.naturalGasTariffAznPerM3,
  });

  const boiler = calculateBoilerOptimization({
    annualFuelM3: 600000,
    currentEfficiencyPct: 78,
    optimizedEfficiencyPct: 88,
    equipmentCostAzn: 35000,
    gasTariffPerM3: tariffs.naturalGasTariffAznPerM3,
  });

  const interventions = [lighting, hvac, plug, thermal, boiler];

  const measurementPlan = generateMeasurementPlan({
    category: "lighting",
    expectedSavingsPct: 15.2,
    baselineCvRmsePct: 9.8,
    resolution: "daily",
    hasSubmetering: true,
  });

  return {
    version: "2.0.0",
    metadata: { ...DEFAULT_METADATA },
    tariffs,
    staleFlags: {
      baselineStale: false,
      interventionsStale: false,
      measurementStale: false,
      evidenceGateStale: false,
      reportsStale: false,
    },
    rawDataset: {
      fileName: "student_residence_daily.csv",
      rowCount: 365,
      uploadedAt: "2026-11-16T18:00:00Z",
    },
    auditSummary: {
      totalRows: 365,
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
    interventions,
    measurementPlan,
    reportingObservationsCount: 184,
    unresolvedNonRoutineEvents: false,
  };
}

export function createBhosAuditDemoProject(): FullProjectState {
  return {
    version: "2.0.0",
    metadata: {
      id: "bhos-public-audit",
      name: "Baku Higher Oil School (BHOS) Campus & Dormitories",
      facilityType: "Higher Education Campus & Dormitories",
      location: "Baku, Bibiheybat Campus",
      leadAuditor: "Fizuli Hasanov",
      createdDate: "2026-11-16",
      lastUpdatedDate: "2026-11-16",
      isDemoProject: true,
      demoType: "bhos_audit",
    },
    tariffs: { ...DEFAULT_TARIFFS },
    staleFlags: {
      baselineStale: false,
      interventionsStale: false,
      measurementStale: false,
      evidenceGateStale: false,
      reportsStale: false,
    },
    rawDataset: {
      fileName: "bhos_public_monthly.csv",
      rowCount: 36,
      uploadedAt: "2026-11-16T18:00:00Z",
    },
    auditSummary: {
      totalRows: 36,
      missingRows: 0,
      missingPct: 0.0,
      zeroCount: 0,
      zeroPct: 0.0,
      maxConsecutiveZeros: 0,
      hasNegativeValues: false,
      hasDuplicateAnnualProfile: true,
      isContinuousTimestamps: true,
      flags: [
        "100% duplicate profile: 36 of 36 monthly readings in 2024 duplicate 2023 identically.",
        "Emissions discrepancy: Reported ~4,978 t vs calculated 497.79 t (exact 10x error).",
      ],
      passed: false,
    },
    bhosAudit: {
      temporalIndependencePass: false,
      duplicatedRecordCount: 36,
      duplicatedPercentage: 100.0,
      emissionsArithmeticPass: false,
      reportedEmissionsTonnes: 4978.0,
      calculatedEmissionsTonnes: 497.79,
      emissionsDiscrepancyFactor: 10.0,
      spatialDisaggregationPass: false,
      submeteringStatus: "Single Campus Boundary Meter (No Dormitory Submetering)",
      boilerSeasonalityPct: 79.86,
      overallAuditStatus: "REJECT",
      recommendations: [
        "Reject duplicate profile: 36 of 36 monthly readings in 2024 duplicate 2023 identically.",
        "Correct GHG emissions calculation: 995,575 kWh @ 0.5 kg/kWh = 497.79 t, not 4,978 t (10x error flag).",
        "Submeter campus zones: Currently all dormitories and academic wings are rolled into a single bulk boundary meter.",
      ],
    },
    interventions: [],
    reportingObservationsCount: 36,
    unresolvedNonRoutineEvents: false,
  };
}

interface ProjectContextType {
  project: FullProjectState;
  savedProjects: BuildingMetadata[];
  setMetadata: (meta: Partial<BuildingMetadata>) => void;
  updateTariffs: (tariffs: Partial<TariffSettings>) => void;
  setAuditResult: (summary: DataQualitySummary, bhosAudit?: BHOSAuditResult) => void;
  setBaselineResult: (baseline: BaselineRegressionResult | null) => void;
  setInterventions: (interventions: BaseEcmResult[]) => void;
  updateIntervention: (id: string, updated: BaseEcmResult) => void;
  setMeasurementPlan: (plan: MeasurementPlan) => void;
  setEvidenceAssessment: (assessment: BuildingEvidenceAssessment | null) => void;
  setUnresolvedNonRoutineEvents: (val: boolean) => void;
  loadDemoProject: (type: "student_residence" | "bhos_audit") => void;
  saveProject: () => void;
  resetProject: () => void;
  exportProjectJson: () => void;
  importProjectJson: (jsonStr: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<FullProjectState>(createDefaultStudentResidenceProject);
  const [savedProjects, setSavedProjects] = useState<BuildingMetadata[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === "2.0.0") {
          setProject(parsed);
        }
      }
      const list = localStorage.getItem(STORAGE_KEY_SAVED_LIST);
      if (list) {
        setSavedProjects(JSON.parse(list));
      }
    } catch (e) {
      console.error("Failed to load project from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(project));
    } catch (e) {
      console.error("Failed to persist project to localStorage", e);
    }
  }, [project, isInitialized]);

  const setMetadata = (meta: Partial<BuildingMetadata>) => {
    setProject((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...meta,
        lastUpdatedDate: new Date().toISOString().split("T")[0],
      },
    }));
  };

  const updateTariffs = (newTariffs: Partial<TariffSettings>) => {
    setProject((prev) => {
      const mergedTariffs: TariffSettings = {
        ...prev.tariffs,
        ...newTariffs,
      };

      // Automatically recalculate all active intervention financial returns
      const updatedInterventions = prev.interventions.map((ecm) => {
        const isGas = ecm.category === "thermal_water" || ecm.category === "boiler";
        const tariff = isGas
          ? mergedTariffs.naturalGasTariffAznPerM3
          : mergedTariffs.electricityTariffAznPerKwh;
        const grossSavingsAzn = isGas
          ? (ecm.annualFuelSavingsM3 || 0) * tariff
          : ecm.annualKwhSavings * tariff;
        const netSavingsAzn = grossSavingsAzn - ecm.annualRecurringCostAzn;
        const simplePaybackYears =
          netSavingsAzn > 0
            ? Math.round((ecm.totalInitialInvestmentAzn / netSavingsAzn) * 10) / 10
            : null;

        return {
          ...ecm,
          annualGrossSavingsAzn: Math.round(grossSavingsAzn),
          annualNetSavingsAzn: Math.round(netSavingsAzn),
          simplePaybackYears,
        };
      });

      return {
        ...prev,
        tariffs: mergedTariffs,
        interventions: updatedInterventions,
        staleFlags: {
          ...prev.staleFlags,
          reportsStale: true,
        },
      };
    });
  };

  const setAuditResult = (summary: DataQualitySummary, bhosAudit?: BHOSAuditResult) => {
    setProject((prev) => ({
      ...prev,
      auditSummary: summary,
      bhosAudit,
      staleFlags: {
        ...prev.staleFlags,
        baselineStale: true,
        evidenceGateStale: true,
        reportsStale: true,
      },
    }));
  };

  const setBaselineResult = (baseline: BaselineRegressionResult | null) => {
    setProject((prev) => ({
      ...prev,
      baselineResult: baseline,
      staleFlags: {
        ...prev.staleFlags,
        baselineStale: false,
        evidenceGateStale: true,
        reportsStale: true,
      },
    }));
  };

  const setInterventions = (interventions: BaseEcmResult[]) => {
    setProject((prev) => ({
      ...prev,
      interventions,
      staleFlags: {
        ...prev.staleFlags,
        measurementStale: true,
        evidenceGateStale: true,
        reportsStale: true,
      },
    }));
  };

  const updateIntervention = (id: string, updated: BaseEcmResult) => {
    setProject((prev) => {
      const interventions = prev.interventions.map((item) => (item.id === id ? updated : item));
      return {
        ...prev,
        interventions,
        staleFlags: {
          ...prev.staleFlags,
          measurementStale: true,
          evidenceGateStale: true,
          reportsStale: true,
        },
      };
    });
  };

  const setMeasurementPlan = (plan: MeasurementPlan) => {
    setProject((prev) => ({
      ...prev,
      measurementPlan: plan,
      staleFlags: {
        ...prev.staleFlags,
        measurementStale: false,
        reportsStale: true,
      },
    }));
  };

  const setEvidenceAssessment = (assessment: BuildingEvidenceAssessment | null) => {
    setProject((prev) => ({
      ...prev,
      evidenceAssessment: assessment,
      staleFlags: {
        ...prev.staleFlags,
        evidenceGateStale: false,
        reportsStale: false,
      },
    }));
  };

  const setUnresolvedNonRoutineEvents = (val: boolean) => {
    setProject((prev) => ({
      ...prev,
      unresolvedNonRoutineEvents: val,
      staleFlags: {
        ...prev.staleFlags,
        evidenceGateStale: true,
      },
    }));
  };

  const loadDemoProject = (type: "student_residence" | "bhos_audit") => {
    if (type === "bhos_audit") {
      setProject(createBhosAuditDemoProject());
    } else {
      setProject(createDefaultStudentResidenceProject());
    }
  };

  const saveProject = () => {
    try {
      const currentMeta = project.metadata;
      setSavedProjects((prev) => {
        const filtered = prev.filter((p) => p.id !== currentMeta.id);
        const updated = [...filtered, currentMeta];
        localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(project));
    } catch (e) {
      console.error("Save error", e);
    }
  };

  const resetProject = () => {
    const fresh = createDefaultStudentResidenceProject();
    setProject(fresh);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }
  };

  const exportProjectJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EnerProof_Project_${project.metadata.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProjectJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.metadata && parsed.interventions) {
        setProject(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import error", e);
      return false;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        savedProjects,
        setMetadata,
        updateTariffs,
        setAuditResult,
        setBaselineResult,
        setInterventions,
        updateIntervention,
        setMeasurementPlan,
        setEvidenceAssessment,
        setUnresolvedNonRoutineEvents,
        loadDemoProject,
        saveProject,
        resetProject,
        exportProjectJson,
        importProjectJson,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
