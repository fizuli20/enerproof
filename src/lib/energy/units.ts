/**
 * EnerProof Energy & Financial Unit System
 * Provides validated unit conversions, default Azerbaijan tariff structures,
 * and standard emission factor calculations.
 */

// Default non-residential electricity tariff in Azerbaijan (as of 2026/2027)
// Source: Azerbaijan Tariff Council decrees. 0.125 AZN/kWh (12.5 qəpik).
export const DEFAULT_AZN_TARIFF_PER_KWH = 0.125;

// Default natural gas tariff for non-residential users in Azerbaijan (AZN/m³)
export const DEFAULT_AZN_TARIFF_PER_M3_GAS = 0.25;

// Standard conversion factor: AZN to USD (~1.70 AZN = 1 USD)
export const AZN_PER_USD = 1.7;

// Default Azerbaijan grid electricity greenhouse gas intensity (kg CO₂ / kWh)
// Note: Grid average factor used in public reporting studies.
export const DEFAULT_GRID_CO2_FACTOR_KG_PER_KWH = 0.5;

// Natural gas combustion CO₂ intensity (kg CO₂ / m³)
export const DEFAULT_NATURAL_GAS_CO2_FACTOR_KG_PER_M3 = 1.9;

export function kwhToMwh(kwh: number): number {
  return kwh / 1000;
}

export function mwhToKwh(mwh: number): number {
  return mwh * 1000;
}

export function aznToUsd(azn: number): number {
  return azn / AZN_PER_USD;
}

export function usdToAzn(usd: number): number {
  return usd * AZN_PER_USD;
}

export function calculateAvoidedElectricityCo2(
  kwh: number,
  factorKgPerKwh: number = DEFAULT_GRID_CO2_FACTOR_KG_PER_KWH
): number {
  // Returns metric tonnes of CO2
  return (kwh * factorKgPerKwh) / 1000;
}

export function calculateAvoidedGasCo2(
  m3: number,
  factorKgPerM3: number = DEFAULT_NATURAL_GAS_CO2_FACTOR_KG_PER_M3
): number {
  // Returns metric tonnes of CO2
  return (m3 * factorKgPerM3) / 1000;
}

export function calculateSimplePayback(
  capitalCost: number,
  annualSavings: number
): number {
  if (annualSavings <= 0) return 999.0;
  return Math.round((capitalCost / annualSavings) * 10) / 10;
}
