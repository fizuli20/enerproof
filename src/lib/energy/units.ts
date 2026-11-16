/**
 * EnerProof Energy & Financial Unit System (V2)
 *
 * Implements physically validated unit conversions, transparent tariff structures,
 * and explicit handling of emissions factors.
 *
 * Mandatory rule: Do NOT assume a universal national grid emissions factor.
 * The 0.5 kg CO2/kWh factor is an illustrative figure from the BHOS sustainability disclosure case study.
 */

// Illustrative non-residential electricity tariff assumption for Azerbaijan (AZN/kWh).
// Source: Azerbaijan Tariff (Price) Council regulatory decrees.
// Note: Tariff schedules vary by voltage level, metering category, and subsidies.
export const ILLUSTRATIVE_AZN_TARIFF_PER_KWH = 0.125;
export const DEFAULT_AZN_TARIFF_PER_KWH = ILLUSTRATIVE_AZN_TARIFF_PER_KWH;

// Illustrative natural gas tariff for non-residential commercial users (AZN/m³).
export const ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS = 0.25;
export const DEFAULT_AZN_TARIFF_PER_M3_GAS = ILLUSTRATIVE_AZN_TARIFF_PER_M3_GAS;

// Exchange rate reference: ~1.70 AZN = 1 USD (Central Bank of Azerbaijan fixed peg).
export const AZN_PER_USD = 1.7;

// Illustrative emission factor from the BHOS 2022 public filing (kg CO₂ / kWh).
// Must be labeled as an illustrative case input, not an authoritative national factor.
export const ILLUSTRATIVE_BHOS_CO2_FACTOR_KG_PER_KWH = 0.5;

// Typical natural gas combustion emissions factor (kg CO₂ / m³).
export const NATURAL_GAS_CO2_FACTOR_KG_PER_M3 = 1.9;

// Natural gas lower heating value (kWh / m³), typical range 9.5 - 11.0 kWh/m³.
export const NATURAL_GAS_HEATING_VALUE_KWH_PER_M3 = 10.5;

export function kwhToMwh(kwh: number): number {
  if (!isFinite(kwh) || kwh < 0) return 0;
  return kwh / 1000;
}

export function mwhToKwh(mwh: number): number {
  if (!isFinite(mwh) || mwh < 0) return 0;
  return mwh * 1000;
}

export function aznToUsd(azn: number): number {
  if (!isFinite(azn)) return 0;
  return azn / AZN_PER_USD;
}

export function usdToAzn(usd: number): number {
  if (!isFinite(usd)) return 0;
  return usd * AZN_PER_USD;
}

/**
 * Calculates avoided electricity CO₂ emissions in metric tonnes.
 * Returns null if the factor is not provided or invalid.
 */
export function calculateAvoidedElectricityCo2(
  kwh: number,
  factorKgPerKwh?: number | null
): number | null {
  if (
    factorKgPerKwh === undefined ||
    factorKgPerKwh === null ||
    !isFinite(factorKgPerKwh) ||
    factorKgPerKwh <= 0
  ) {
    return null; // Unavailable without validated emissions factor
  }
  if (!isFinite(kwh) || kwh <= 0) return 0.0;
  return (kwh * factorKgPerKwh) / 1000;
}

/**
 * Calculates avoided natural gas combustion CO₂ emissions in metric tonnes.
 */
export function calculateAvoidedGasCo2(
  m3: number,
  factorKgPerM3: number = NATURAL_GAS_CO2_FACTOR_KG_PER_M3
): number | null {
  if (!isFinite(factorKgPerM3) || factorKgPerM3 <= 0) return null;
  if (!isFinite(m3) || m3 <= 0) return 0.0;
  return (m3 * factorKgPerM3) / 1000;
}

/**
 * Calculates simple payback period in years.
 * Returns null if annual savings are non-positive (displays 'No positive payback').
 * Never returns arbitrary 999 years.
 */
export function calculateSimplePayback(
  capitalCost: number,
  annualNetSavings: number
): number | null {
  if (!isFinite(capitalCost) || capitalCost < 0) return null;
  if (!isFinite(annualNetSavings) || annualNetSavings <= 0) {
    return null; // No positive payback
  }
  return Math.round((capitalCost / annualNetSavings) * 10) / 10;
}
