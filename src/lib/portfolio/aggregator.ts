import { PortfolioAggregationResult } from "../types";

export interface BuildingPortfolioItem {
  id: string;
  name: string;
  baselineKwh: number;
  apparentSavingsKwh: number;
}

export const EMPIRICAL_CROSS_BUILDING_CORRELATION = 0.33;

/**
 * Calculates portfolio aggregation metrics for ESCO performance contracts.
 * Compares naive independent assumption (1/sqrt(K)) against real-world correlated noise floor.
 */
export function aggregatePortfolio(
  buildings: BuildingPortfolioItem[]
): PortfolioAggregationResult {
  const K = buildings.length;
  if (K === 0) {
    return {
      buildingCount: 0,
      totalBaselineKwh: 0,
      totalApparentSavingsKwh: 0,
      portfolioSavingsPct: 0,
      individualMdePct: 15.0,
      theoreticalPortfolioMdePct: 15.0,
      empiricalPortfolioMdePct: 15.0,
      crossBuildingCorrelation: EMPIRICAL_CROSS_BUILDING_CORRELATION,
      pooledDetectionPowerPct: 24.7,
    };
  }

  const totalBaselineKwh = buildings.reduce((acc, b) => acc + b.baselineKwh, 0);
  const totalApparentSavingsKwh = buildings.reduce((acc, b) => acc + b.apparentSavingsKwh, 0);
  const portfolioSavingsPct =
    totalBaselineKwh > 0 ? (totalApparentSavingsKwh / totalBaselineKwh) * 100 : 0;

  // Individual daily MDE benchmark: 15.0%
  const individualMde = 15.0;

  // Naive theoretical MDE under i.i.d. assumption: MDE / sqrt(K)
  const theoreticalPortfolioMde = individualMde / Math.sqrt(K);

  // Empirical MDE with cross-building correlation rho = 0.33
  // Variance factor: (1 + (K - 1) * rho) / K
  const correlationFactor = Math.sqrt((1 + (K - 1) * EMPIRICAL_CROSS_BUILDING_CORRELATION) / K);
  const empiricalPortfolioMde = individualMde * correlationFactor;

  // Empirical detection power for a 10% saving based on research benchmark
  let pooledPower = 24.7;
  if (K >= 50) pooledPower = 98.0;
  else if (K >= 20) pooledPower = 82.0;
  else if (K >= 10) pooledPower = 67.4;
  else if (K >= 5) pooledPower = 51.2;
  else if (K > 1) pooledPower = 35.0;

  return {
    buildingCount: K,
    totalBaselineKwh: Math.round(totalBaselineKwh),
    totalApparentSavingsKwh: Math.round(totalApparentSavingsKwh),
    portfolioSavingsPct: Math.round(portfolioSavingsPct * 10) / 10,
    individualMdePct: individualMde,
    theoreticalPortfolioMdePct: Math.round(theoreticalPortfolioMde * 10) / 10,
    empiricalPortfolioMdePct: Math.round(empiricalPortfolioMde * 10) / 10,
    crossBuildingCorrelation: EMPIRICAL_CROSS_BUILDING_CORRELATION,
    pooledDetectionPowerPct: pooledPower,
  };
}
