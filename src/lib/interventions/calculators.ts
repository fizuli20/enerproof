import {
  DEFAULT_AZN_TARIFF_PER_KWH,
  DEFAULT_AZN_TARIFF_PER_M3_GAS,
  DEFAULT_GRID_CO2_FACTOR_KG_PER_KWH,
  calculateAvoidedElectricityCo2,
  calculateAvoidedGasCo2,
  calculateSimplePayback,
} from "../energy/units";
import { InterventionParams } from "../types";

export interface LightingRetrofitInput {
  fixtureCount: number;
  baselineWattsPerFixture: number;
  retrofitWattsPerFixture: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  costPerFixtureAzn: number;
  tariffPerKwh?: number;
}

export function calculateLightingRetrofit(
  input: LightingRetrofitInput
): InterventionParams {
  const tariff = input.tariffPerKwh ?? DEFAULT_AZN_TARIFF_PER_KWH;
  const deltaWatts = Math.max(0, input.baselineWattsPerFixture - input.retrofitWattsPerFixture);
  const annualKwh =
    (input.fixtureCount * deltaWatts * input.operatingHoursPerDay * input.operatingDaysPerYear) /
    1000;
  const capitalCost = input.fixtureCount * input.costPerFixtureAzn;
  const annualCostSavings = annualKwh * tariff;
  const simplePayback = calculateSimplePayback(capitalCost, annualCostSavings);
  const avoidedCo2 = calculateAvoidedElectricityCo2(annualKwh);

  return {
    id: "lighting-retrofit",
    name: "LED Lighting Retrofit & Occupancy Sensors",
    category: "lighting",
    capitalCostAzn: Math.round(capitalCost),
    annualKwhSavings: Math.round(annualKwh),
    annualCostSavingsAzn: Math.round(annualCostSavings),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: Math.round(avoidedCo2 * 10) / 10,
    notes: `Replacing ${input.fixtureCount} fixtures (${input.baselineWattsPerFixture}W → ${input.retrofitWattsPerFixture}W) operating ${input.operatingHoursPerDay}h/day.`,
  };
}

export interface HvacScheduleInput {
  coolingCapacityKw: number;
  baselineRuntimeHoursWeek: number;
  optimizedRuntimeHoursWeek: number;
  operatingWeeksYear: number;
  averageLoadFraction: number; // 0.0 to 1.0
  implementationCostAzn: number;
  tariffPerKwh?: number;
}

export function calculateHvacScheduling(
  input: HvacScheduleInput
): InterventionParams {
  const tariff = input.tariffPerKwh ?? DEFAULT_AZN_TARIFF_PER_KWH;
  const avoidableHoursWeek = Math.max(
    0,
    input.baselineRuntimeHoursWeek - input.optimizedRuntimeHoursWeek
  );
  const annualKwh =
    input.coolingCapacityKw *
    avoidableHoursWeek *
    input.operatingWeeksYear *
    input.averageLoadFraction;
  const capitalCost = input.implementationCostAzn;
  const annualCostSavings = annualKwh * tariff;
  const simplePayback = calculateSimplePayback(capitalCost, annualCostSavings);
  const avoidedCo2 = calculateAvoidedElectricityCo2(annualKwh);

  return {
    id: "hvac-scheduling",
    name: "HVAC Automated Scheduling & Night Setbacks",
    category: "hvac",
    capitalCostAzn: Math.round(capitalCost),
    annualKwhSavings: Math.round(annualKwh),
    annualCostSavingsAzn: Math.round(annualCostSavings),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: Math.round(avoidedCo2 * 10) / 10,
    notes: `Night setback eliminating ${avoidableHoursWeek}h/week of off-hours ventilation runtime across ${input.coolingCapacityKw} kW equipment.`,
  };
}

export interface PlugLoadInput {
  workstationCount: number;
  baselineIdleWatts: number;
  smartPlugIdleWatts: number;
  idleHoursPerDay: number;
  idleDaysPerYear: number;
  smartPlugCostPerUnitAzn: number;
  tariffPerKwh?: number;
}

export function calculatePlugLoad(input: PlugLoadInput): InterventionParams {
  const tariff = input.tariffPerKwh ?? DEFAULT_AZN_TARIFF_PER_KWH;
  const deltaWatts = Math.max(0, input.baselineIdleWatts - input.smartPlugIdleWatts);
  const annualKwh =
    (input.workstationCount * deltaWatts * input.idleHoursPerDay * input.idleDaysPerYear) /
    1000;
  const capitalCost = input.workstationCount * input.smartPlugCostPerUnitAzn;
  const annualCostSavings = annualKwh * tariff;
  const simplePayback = calculateSimplePayback(capitalCost, annualCostSavings);
  const avoidedCo2 = calculateAvoidedElectricityCo2(annualKwh);

  return {
    id: "plug-load-management",
    name: "Smart Power Strips & Dormitory Workstation Cutoffs",
    category: "plug_load",
    capitalCostAzn: Math.round(capitalCost),
    annualKwhSavings: Math.round(annualKwh),
    annualCostSavingsAzn: Math.round(annualCostSavings),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: Math.round(avoidedCo2 * 10) / 10,
    notes: `Automated peripheral cutoffs across ${input.workstationCount} workstations during ${input.idleHoursPerDay} nightly idle hours.`,
  };
}

export interface ThermalWaterInput {
  dailyHotWaterLiters: number;
  deltaTempC: number; // e.g. 45°C (15°C cold to 60°C hot)
  baselineEfficiency: number; // 0.70 to 0.85
  solarThermalFraction: number; // 0.40 to 0.65
  systemCostAzn: number;
  gasTariffPerM3?: number;
}

export function calculateThermalWater(
  input: ThermalWaterInput
): InterventionParams {
  const gasTariff = input.gasTariffPerM3 ?? DEFAULT_AZN_TARIFF_PER_M3_GAS;
  // Specific heat of water: 4.186 kJ / (kg * K) = 0.001163 kWh / (liter * K)
  const dailyThermalKwh = (input.dailyHotWaterLiters * input.deltaTempC * 4.186) / 3600;
  const annualThermalKwh = dailyThermalKwh * 365;
  const offsetKwh = (annualThermalKwh * input.solarThermalFraction) / input.baselineEfficiency;
  // Natural gas heating value approx 10.5 kWh / m³
  const fuelSavingsM3 = offsetKwh / 10.5;
  const capitalCost = input.systemCostAzn;
  const annualCostSavings = fuelSavingsM3 * gasTariff;
  const simplePayback = calculateSimplePayback(capitalCost, annualCostSavings);
  const avoidedCo2 = calculateAvoidedGasCo2(fuelSavingsM3);

  return {
    id: "thermal-water-preheating",
    name: "Solar Thermal Domestic Hot Water Pre-Heating",
    category: "thermal_water",
    capitalCostAzn: Math.round(capitalCost),
    annualKwhSavings: Math.round(offsetKwh),
    annualFuelSavingsM3: Math.round(fuelSavingsM3),
    annualCostSavingsAzn: Math.round(annualCostSavings),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: Math.round(avoidedCo2 * 10) / 10,
    notes: `Pre-heating ${input.dailyHotWaterLiters.toLocaleString()} L/day domestic hot water with ${Math.round(input.solarThermalFraction * 100)}% solar fraction.`,
  };
}

export interface BoilerOptimizationInput {
  annualFuelM3: number;
  currentEfficiencyPct: number; // e.g. 78%
  optimizedEfficiencyPct: number; // e.g. 88% with economizer & O2 trim
  equipmentCostAzn: number;
  gasTariffPerM3?: number;
}

export function calculateBoilerOptimization(
  input: BoilerOptimizationInput
): InterventionParams {
  const gasTariff = input.gasTariffPerM3 ?? DEFAULT_AZN_TARIFF_PER_M3_GAS;
  const effRatio = input.currentEfficiencyPct / input.optimizedEfficiencyPct;
  const fuelSavingsM3 = input.annualFuelM3 * (1 - effRatio);
  const equivalentKwh = fuelSavingsM3 * 10.5;
  const capitalCost = input.equipmentCostAzn;
  const annualCostSavings = fuelSavingsM3 * gasTariff;
  const simplePayback = calculateSimplePayback(capitalCost, annualCostSavings);
  const avoidedCo2 = calculateAvoidedGasCo2(fuelSavingsM3);

  return {
    id: "boiler-tuning",
    name: "Boiler Oxygen Trim & Condensing Flue Gas Economizer",
    category: "boiler",
    capitalCostAzn: Math.round(capitalCost),
    annualKwhSavings: Math.round(equivalentKwh),
    annualFuelSavingsM3: Math.round(fuelSavingsM3),
    annualCostSavingsAzn: Math.round(annualCostSavings),
    simplePaybackYears: simplePayback,
    avoidedCo2TonnesYear: Math.round(avoidedCo2 * 10) / 10,
    notes: `Combustion tune-up and economizer raising seasonal efficiency from ${input.currentEfficiencyPct}% to ${input.optimizedEfficiencyPct}%.`,
  };
}
