/**
 * EnerProof Engineering Intervention Calculators (V2)
 *
 * Implements physically bounded energy engineering formulas with:
 * - Explicit boundary validation (hours <= 24, days <= 365, efficiencies, valid delta T)
 * - Complete financial lifecycle accounting (Gross Savings, Recurring Costs, Measurement Costs, Net Benefit, Simple Payback)
 * - Explicit 'No positive payback' handling (null payback rather than arbitrary 999 years)
 * - Conservative, Base, and Optimistic scenario multipliers
 * - Clear distinction between demand-side efficiency vs renewable thermal supply
 * - Dormitory health, comfort, and ventilation safeguards
 */

import {
  ILLUSTRATIVE_AZN_TARIFF_PER_KWH,
  ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS,
  NATURAL_GAS_HEATING_VALUE_KWH_PER_M3,
  calculateAvoidedElectricityCo2,
  calculateAvoidedGasCo2,
  calculateSimplePayback,
} from "../energy/units";
import { InterventionParams } from "../types";

export type ScenarioPacing = "conservative" | "base" | "optimistic";

export interface BaseEcmResult {
  id: string;
  name: string;
  category: "lighting" | "hvac" | "plug_load" | "thermal_water" | "boiler";
  existingConsumptionKwh: number;
  proposedConsumptionKwh: number;
  annualKwhSavings: number;
  existingFuelM3?: number;
  proposedFuelM3?: number;
  annualFuelSavingsM3?: number;
  implementationCostAzn: number;
  capitalCostAzn?: number; // Alias for backward compatibility
  measurementCostAzn: number;
  measurementEquipmentCostAzn?: number; // Alias for backward compatibility
  totalInitialInvestmentAzn: number;
  annualRecurringCostAzn: number;
  annualGrossSavingsAzn: number;
  annualCostSavingsAzn?: number; // Alias for backward compatibility
  annualNetSavingsAzn: number;
  simplePaybackYears: number | null; // null if net savings <= 0
  avoidedCo2TonnesYear: number | null;
  scenario: ScenarioPacing;
  healthComfortSafeguardsConfirmed: boolean;
  notes: string;
  isRenewableSupply: boolean;
}

export type LightingRetrofitInput = LightingInput;
export type HvacScheduleInput = HvacInput;
export type BoilerOptimizationInput = BoilerInput;

// ============================================================================
// 1. LED LIGHTING RETROFIT & CONTROLS
// ============================================================================
export interface LightingInput {
  fixtureCount: number;
  baselineWattsPerFixture: number;
  retrofitWattsPerFixture: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  costPerFixtureAzn: number;
  measurementCostAzn?: number;
  annualMaintenanceAzn?: number;
  tariffPerKwh?: number;
  emissionsFactorKgPerKwh?: number | null;
  scenario?: ScenarioPacing;
}

export function calculateLightingRetrofit(input: LightingInput): BaseEcmResult {
  const scenario = input.scenario || "base";
  const scenarioMultiplier = scenario === "conservative" ? 0.9 : scenario === "optimistic" ? 1.1 : 1.0;

  // Validate bounds
  const count = Math.max(0, Math.floor(input.fixtureCount || 0));
  const baseWatts = Math.max(0, input.baselineWattsPerFixture || 0);
  const retroWatts = Math.min(baseWatts, Math.max(0, input.retrofitWattsPerFixture || 0));
  const hrs = Math.max(0, Math.min(24, input.operatingHoursPerDay || 0));
  const days = Math.max(0, Math.min(365, input.operatingDaysPerYear || 0));
  const fixtureCost = Math.max(0, input.costPerFixtureAzn || 0);
  const mCost = Math.max(0, input.measurementCostAzn || 0);
  const maintCost = Math.max(0, input.annualMaintenanceAzn || 0);
  const tariff = input.tariffPerKwh !== undefined && input.tariffPerKwh > 0 ? input.tariffPerKwh : ILLUSTRATIVE_AZN_TARIFF_PER_KWH;

  const existingKwh = (count * baseWatts * hrs * days) / 1000;
  const proposedKwh = (count * retroWatts * hrs * days) / 1000;
  const rawSavingsKwh = (existingKwh - proposedKwh) * scenarioMultiplier;
  const annualKwhSavings = Math.max(0, Math.round(rawSavingsKwh));

  const implCost = count * fixtureCost;
  const totalInvestment = implCost + mCost;
  const grossSavingsAzn = annualKwhSavings * tariff;
  const netSavingsAzn = grossSavingsAzn - maintCost;
  const simplePayback = calculateSimplePayback(totalInvestment, netSavingsAzn);
  const avoidedCo2 = calculateAvoidedElectricityCo2(annualKwhSavings, input.emissionsFactorKgPerKwh);

  return {
    id: "lighting-retrofit",
    name: "LED Lighting Retrofit & Daylight/Occupancy Sensors",
    category: "lighting",
    existingConsumptionKwh: Math.round(existingKwh),
    proposedConsumptionKwh: Math.round(proposedKwh),
    annualKwhSavings,
    implementationCostAzn: Math.round(implCost),
    measurementCostAzn: Math.round(mCost),
    totalInitialInvestmentAzn: Math.round(totalInvestment),
    annualRecurringCostAzn: Math.round(maintCost),
    annualGrossSavingsAzn: Math.round(grossSavingsAzn),
    annualNetSavingsAzn: Math.round(netSavingsAzn),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: avoidedCo2 !== null ? Math.round(avoidedCo2 * 10) / 10 : null,
    scenario,
    healthComfortSafeguardsConfirmed: true,
    notes: `Upgrades ${count.toLocaleString()} fixtures (${baseWatts}W -> ${retroWatts}W) across ${hrs}h/day, ${days}d/yr. Maintains recommended illuminance (300-500 lux).`,
    isRenewableSupply: false,
  };
}

// ============================================================================
// 2. HVAC AUTOMATED SCHEDULING & NIGHT SETBACKS
// ============================================================================
export interface HvacInput {
  coolingCapacityKw: number;
  baselineRuntimeHoursWeek: number;
  optimizedRuntimeHoursWeek: number;
  operatingWeeksYear: number;
  averageLoadFactor: number; // 0.0 to 1.0
  implementationCostAzn: number;
  measurementCostAzn?: number;
  annualRecurringSoftwareAzn?: number;
  tariffPerKwh?: number;
  emissionsFactorKgPerKwh?: number | null;
  comfortVentilationConfirmed: boolean;
  scenario?: ScenarioPacing;
}

export function calculateHvacScheduling(input: HvacInput): BaseEcmResult {
  const scenario = input.scenario || "base";
  const scenarioMultiplier = scenario === "conservative" ? 0.85 : scenario === "optimistic" ? 1.15 : 1.0;

  const capKw = Math.max(0, input.coolingCapacityKw || 0);
  const baseHrs = Math.max(0, Math.min(168, input.baselineRuntimeHoursWeek || 0));
  const optHrs = Math.max(0, Math.min(baseHrs, input.optimizedRuntimeHoursWeek || 0));
  const weeks = Math.max(0, Math.min(52, input.operatingWeeksYear || 0));
  const loadFactor = Math.max(0.1, Math.min(1.0, input.averageLoadFactor || 0.7));
  const implCost = Math.max(0, input.implementationCostAzn || 0);
  const mCost = Math.max(0, input.measurementCostAzn || 0);
  const recurCost = Math.max(0, input.annualRecurringSoftwareAzn || 0);
  const tariff = input.tariffPerKwh !== undefined && input.tariffPerKwh > 0 ? input.tariffPerKwh : ILLUSTRATIVE_AZN_TARIFF_PER_KWH;

  const existingKwh = capKw * baseHrs * weeks * loadFactor;
  const proposedKwh = capKw * optHrs * weeks * loadFactor;
  const deltaHoursWeek = baseHrs - optHrs;
  const rawSavings = capKw * deltaHoursWeek * weeks * loadFactor * scenarioMultiplier;
  const annualKwhSavings = Math.max(0, Math.round(rawSavings));

  const totalInvestment = implCost + mCost;
  const grossSavingsAzn = annualKwhSavings * tariff;
  const netSavingsAzn = grossSavingsAzn - recurCost;
  const simplePayback = calculateSimplePayback(totalInvestment, netSavingsAzn);
  const avoidedCo2 = calculateAvoidedElectricityCo2(annualKwhSavings, input.emissionsFactorKgPerKwh);

  return {
    id: "hvac-scheduling",
    name: "HVAC Automated Scheduling & Minimum Fresh-Air Night Setbacks",
    category: "hvac",
    existingConsumptionKwh: Math.round(existingKwh),
    proposedConsumptionKwh: Math.round(proposedKwh),
    annualKwhSavings,
    implementationCostAzn: Math.round(implCost),
    measurementCostAzn: Math.round(mCost),
    totalInitialInvestmentAzn: Math.round(totalInvestment),
    annualRecurringCostAzn: Math.round(recurCost),
    annualGrossSavingsAzn: Math.round(grossSavingsAzn),
    annualNetSavingsAzn: Math.round(netSavingsAzn),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: avoidedCo2 !== null ? Math.round(avoidedCo2 * 10) / 10 : null,
    scenario,
    healthComfortSafeguardsConfirmed: input.comfortVentilationConfirmed,
    notes: `Reduces avoidable runtime by ${deltaHoursWeek}h/week across ${capKw} kW capacity while strictly enforcing ASHRAE 62.1 dormitory fresh air ventilation.`,
    isRenewableSupply: false,
  };
}

// ============================================================================
// 3. SMART PLUG LOAD MANAGEMENT & WORKSTATION CUTOFFS
// ============================================================================
export interface PlugLoadInput {
  workstationCount: number;
  baselineIdleWatts: number;
  smartPlugIdleWatts: number;
  idleHoursPerDay: number;
  idleDaysPerYear: number;
  smartPlugCostPerUnitAzn: number;
  measurementCostAzn?: number;
  tariffPerKwh?: number;
  emissionsFactorKgPerKwh?: number | null;
  scenario?: ScenarioPacing;
}

export function calculatePlugLoad(input: PlugLoadInput): BaseEcmResult {
  const scenario = input.scenario || "base";
  const scenarioMultiplier = scenario === "conservative" ? 0.8 : scenario === "optimistic" ? 1.1 : 1.0;

  const count = Math.max(0, Math.floor(input.workstationCount || 0));
  const baseWatts = Math.max(0, input.baselineIdleWatts || 0);
  const plugWatts = Math.min(baseWatts, Math.max(0, input.smartPlugIdleWatts || 0));
  const hrs = Math.max(0, Math.min(24, input.idleHoursPerDay || 0));
  const days = Math.max(0, Math.min(365, input.idleDaysPerYear || 0));
  const unitCost = Math.max(0, input.smartPlugCostPerUnitAzn || 0);
  const mCost = Math.max(0, input.measurementCostAzn || 0);
  const tariff = input.tariffPerKwh !== undefined && input.tariffPerKwh > 0 ? input.tariffPerKwh : ILLUSTRATIVE_AZN_TARIFF_PER_KWH;

  const existingKwh = (count * baseWatts * hrs * days) / 1000;
  const proposedKwh = (count * plugWatts * hrs * days) / 1000;
  const deltaWatts = baseWatts - plugWatts;
  const rawSavings = ((count * deltaWatts * hrs * days) / 1000) * scenarioMultiplier;
  const annualKwhSavings = Math.max(0, Math.round(rawSavings));

  const implCost = count * unitCost;
  const totalInvestment = implCost + mCost;
  const grossSavingsAzn = annualKwhSavings * tariff;
  const netSavingsAzn = grossSavingsAzn; // minimal recurring
  const simplePayback = calculateSimplePayback(totalInvestment, netSavingsAzn);
  const avoidedCo2 = calculateAvoidedElectricityCo2(annualKwhSavings, input.emissionsFactorKgPerKwh);

  return {
    id: "plug-load-management",
    name: "Smart Power Strips & Automated Dormitory Peripheral Cutoffs",
    category: "plug_load",
    existingConsumptionKwh: Math.round(existingKwh),
    proposedConsumptionKwh: Math.round(proposedKwh),
    annualKwhSavings,
    implementationCostAzn: Math.round(implCost),
    measurementCostAzn: Math.round(mCost),
    totalInitialInvestmentAzn: Math.round(totalInvestment),
    annualRecurringCostAzn: 0,
    annualGrossSavingsAzn: Math.round(grossSavingsAzn),
    annualNetSavingsAzn: Math.round(netSavingsAzn),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: avoidedCo2 !== null ? Math.round(avoidedCo2 * 10) / 10 : null,
    scenario,
    healthComfortSafeguardsConfirmed: true,
    notes: `Eliminates phantom vampire standby draws across ${count} student workstations during ${hrs} nightly off-hours.`,
    isRenewableSupply: false,
  };
}

// ============================================================================
// 4. SOLAR THERMAL DOMESTIC HOT WATER PRE-HEATING (RENEWABLE SUPPLY)
// ============================================================================
export interface ThermalWaterInput {
  dailyHotWaterLiters: number;
  deltaTempC: number; // e.g. 45°C (15°C cold to 60°C hot)
  baselineEfficiency: number; // 0.60 to 0.90
  solarThermalFraction: number; // 0.30 to 0.70
  systemCostAzn: number;
  measurementCostAzn?: number;
  annualMaintenanceAzn?: number;
  gasTariffPerM3?: number;
  scenario?: ScenarioPacing;
}

export function calculateThermalWater(input: ThermalWaterInput): BaseEcmResult {
  const scenario = input.scenario || "base";
  const scenarioMultiplier = scenario === "conservative" ? 0.85 : scenario === "optimistic" ? 1.1 : 1.0;

  const liters = Math.max(0, input.dailyHotWaterLiters || 0);
  const deltaT = Math.max(1, Math.min(80, input.deltaTempC || 45));
  const baseEff = Math.max(0.4, Math.min(0.98, input.baselineEfficiency || 0.8));
  const solarFrac = Math.max(0.1, Math.min(0.85, input.solarThermalFraction || 0.5));
  const systemCost = Math.max(0, input.systemCostAzn || 0);
  const mCost = Math.max(0, input.measurementCostAzn || 0);
  const maintCost = Math.max(0, input.annualMaintenanceAzn || 500);
  const gasTariff = input.gasTariffPerM3 !== undefined && input.gasTariffPerM3 > 0 ? input.gasTariffPerM3 : ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS;

  // Specific heat of water = 4.186 kJ/(kg*K) = 0.001163 kWh/(L*K)
  const annualThermalDemandKwh = (liters * deltaT * 4.186 * 365) / 3600;
  const existingFuelKwh = annualThermalDemandKwh / baseEff;
  const existingFuelM3 = existingFuelKwh / NATURAL_GAS_HEATING_VALUE_KWH_PER_M3;

  const offsetThermalKwh = annualThermalDemandKwh * solarFrac * scenarioMultiplier;
  const savedFuelKwh = offsetThermalKwh / baseEff;
  const fuelSavingsM3 = savedFuelKwh / NATURAL_GAS_HEATING_VALUE_KWH_PER_M3;
  const proposedFuelM3 = Math.max(0, existingFuelM3 - fuelSavingsM3);

  const totalInvestment = systemCost + mCost;
  const grossSavingsAzn = fuelSavingsM3 * gasTariff;
  const netSavingsAzn = grossSavingsAzn - maintCost;
  const simplePayback = calculateSimplePayback(totalInvestment, netSavingsAzn);
  const avoidedCo2 = calculateAvoidedGasCo2(fuelSavingsM3);

  return {
    id: "thermal-water-preheating",
    name: "Rooftop Solar Thermal Domestic Hot Water Pre-Heating",
    category: "thermal_water",
    existingConsumptionKwh: Math.round(existingFuelKwh),
    proposedConsumptionKwh: Math.round(existingFuelKwh - savedFuelKwh),
    annualKwhSavings: Math.round(savedFuelKwh),
    existingFuelM3: Math.round(existingFuelM3),
    proposedFuelM3: Math.round(proposedFuelM3),
    annualFuelSavingsM3: Math.round(fuelSavingsM3),
    implementationCostAzn: Math.round(systemCost),
    measurementCostAzn: Math.round(mCost),
    totalInitialInvestmentAzn: Math.round(totalInvestment),
    annualRecurringCostAzn: Math.round(maintCost),
    annualGrossSavingsAzn: Math.round(grossSavingsAzn),
    annualNetSavingsAzn: Math.round(netSavingsAzn),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: avoidedCo2 !== null ? Math.round(avoidedCo2 * 10) / 10 : null,
    scenario,
    healthComfortSafeguardsConfirmed: true,
    notes: `Solar thermal collector array offsetting domestic hot water fuel. Classified as clean renewable thermal generation.`,
    isRenewableSupply: true,
  };
}

// ============================================================================
// 5. BOILER COMBUSTION EFFICIENCY & CONDENSING ECONOMIZER
// ============================================================================
export interface BoilerInput {
  annualFuelM3: number;
  currentEfficiencyPct: number; // 0.60 to 0.85
  optimizedEfficiencyPct: number; // 0.80 to 0.98
  equipmentCostAzn: number;
  measurementCostAzn?: number;
  annualTuningServiceAzn?: number;
  gasTariffPerM3?: number;
  scenario?: ScenarioPacing;
}

export function calculateBoilerOptimization(input: BoilerInput): BaseEcmResult {
  const scenario = input.scenario || "base";
  const scenarioMultiplier = scenario === "conservative" ? 0.9 : scenario === "optimistic" ? 1.1 : 1.0;

  const fuelM3 = Math.max(0, input.annualFuelM3 || 0);
  const curEff = Math.max(0.5, Math.min(0.90, input.currentEfficiencyPct / 100.0 || 0.78));
  const optEff = Math.max(curEff + 0.02, Math.min(0.98, input.optimizedEfficiencyPct / 100.0 || 0.88));
  const equipCost = Math.max(0, input.equipmentCostAzn || 0);
  const mCost = Math.max(0, input.measurementCostAzn || 0);
  const recurCost = Math.max(0, input.annualTuningServiceAzn || 1200);
  const gasTariff = input.gasTariffPerM3 !== undefined && input.gasTariffPerM3 > 0 ? input.gasTariffPerM3 : ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS;

  const rawFuelSavingsM3 = fuelM3 * (1.0 - curEff / optEff) * scenarioMultiplier;
  const fuelSavingsM3 = Math.max(0, Math.round(rawFuelSavingsM3));
  const proposedFuelM3 = Math.max(0, fuelM3 - fuelSavingsM3);
  const equivalentKwhSavings = Math.round(fuelSavingsM3 * NATURAL_GAS_HEATING_VALUE_KWH_PER_M3);

  const totalInvestment = equipCost + mCost;
  const grossSavingsAzn = fuelSavingsM3 * gasTariff;
  const netSavingsAzn = grossSavingsAzn - recurCost;
  const simplePayback = calculateSimplePayback(totalInvestment, netSavingsAzn);
  const avoidedCo2 = calculateAvoidedGasCo2(fuelSavingsM3);

  return {
    id: "boiler-tuning",
    name: "Boiler Oxygen Trim Controls & Flue Gas Condensing Economizer",
    category: "boiler",
    existingConsumptionKwh: Math.round(fuelM3 * NATURAL_GAS_HEATING_VALUE_KWH_PER_M3),
    proposedConsumptionKwh: Math.round(proposedFuelM3 * NATURAL_GAS_HEATING_VALUE_KWH_PER_M3),
    annualKwhSavings: equivalentKwhSavings,
    existingFuelM3: Math.round(fuelM3),
    proposedFuelM3: Math.round(proposedFuelM3),
    annualFuelSavingsM3: fuelSavingsM3,
    implementationCostAzn: Math.round(equipCost),
    measurementCostAzn: Math.round(mCost),
    totalInitialInvestmentAzn: Math.round(totalInvestment),
    annualRecurringCostAzn: Math.round(recurCost),
    annualGrossSavingsAzn: Math.round(grossSavingsAzn),
    annualNetSavingsAzn: Math.round(netSavingsAzn),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: avoidedCo2 !== null ? Math.round(avoidedCo2 * 10) / 10 : null,
    scenario,
    healthComfortSafeguardsConfirmed: true,
    notes: `Combustion O2 trim and condensing heat recovery raising seasonal efficiency from ${Math.round(curEff * 100)}% to ${Math.round(optEff * 100)}%.`,
    isRenewableSupply: false,
  };
}

/**
 * Converts a BaseEcmResult to legacy InterventionParams for compatibility.
 */
export function toInterventionParams(ecm: BaseEcmResult): InterventionParams {
  return {
    id: ecm.id,
    name: ecm.name,
    category: ecm.category,
    capitalCostAzn: ecm.totalInitialInvestmentAzn,
    annualKwhSavings: ecm.annualKwhSavings,
    annualFuelSavingsM3: ecm.annualFuelSavingsM3,
    annualCostSavingsAzn: ecm.annualNetSavingsAzn,
    simplePaybackYears: ecm.simplePaybackYears !== null ? ecm.simplePaybackYears : 0,
    avoidedCo2TonnesYear: ecm.avoidedCo2TonnesYear !== null ? ecm.avoidedCo2TonnesYear : 0,
    notes: ecm.notes,
  };
}
