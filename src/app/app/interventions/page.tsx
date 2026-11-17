"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { SavingsBarChart } from "@/components/SavingsBarChart";
import {
  calculateLightingRetrofit,
  calculateHvacScheduling,
  calculatePlugLoad,
  calculateThermalWater,
  calculateBoilerOptimization,
  LightingRetrofitInput,
  HvacScheduleInput,
  PlugLoadInput,
  ThermalWaterInput,
  BoilerOptimizationInput,
  BaseEcmResult,
} from "@/lib/interventions/calculators";
import { useProject } from "@/lib/store/project-context";
import {
  DEFAULT_AZN_TARIFF_PER_KWH,
  DEFAULT_AZN_TARIFF_PER_M3_GAS,
} from "@/lib/energy/units";
import {
  Sliders,
  DollarSign,
  TrendingDown,
  Leaf,
  Clock,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Eye,
} from "lucide-react";
import { LightingRetrofitVisual } from "@/components/visuals/LightingRetrofitVisual";
import { HvacSystemsVisual } from "@/components/visuals/HvacSystemsVisual";

type ScenarioMode = "conservative" | "base" | "optimistic";

export default function InterventionsPage() {
  const { project, updateTariffs, setInterventions: setStoreInterventions } = useProject();

  // Tariffs from project store
  const [elecTariff, setElecTariff] = useState<number>(
    project.tariffs.electricityTariffAznPerKwh || DEFAULT_AZN_TARIFF_PER_KWH
  );
  const [gasTariff, setGasTariff] = useState<number>(
    project.tariffs.naturalGasTariffAznPerM3 || DEFAULT_AZN_TARIFF_PER_M3_GAS
  );

  // Scenario toggle
  const [scenario, setScenario] = useState<ScenarioMode>("base");
  const [visualTab, setVisualTab] = useState<"lighting" | "hvac">("lighting");

  // Safeguard confirmation
  const [comfortVentilationConfirmed, setComfortVentilationConfirmed] = useState<boolean>(true);

  // Measure 1: Lighting
  const [lightingInput, setLightingInput] = useState<LightingRetrofitInput>({
    fixtureCount: 500,
    baselineWattsPerFixture: 64, // 2x32W T8
    retrofitWattsPerFixture: 24, // 2x12W LED
    operatingHoursPerDay: 12,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: 35,
    annualMaintenanceAzn: 300,
    measurementCostAzn: 800,
  });

  // Measure 2: HVAC
  const [hvacInput, setHvacInput] = useState<HvacScheduleInput>({
    coolingCapacityKw: 120,
    baselineRuntimeHoursWeek: 70,
    optimizedRuntimeHoursWeek: 45,
    operatingWeeksYear: 26,
    averageLoadFactor: 0.7,
    implementationCostAzn: 4500,
    comfortVentilationConfirmed: true,
    annualRecurringSoftwareAzn: 400,
    measurementCostAzn: 1200,
  });

  // Measure 3: Plug Load
  const [plugInput, setPlugInput] = useState<PlugLoadInput>({
    workstationCount: 200,
    baselineIdleWatts: 45,
    smartPlugIdleWatts: 5,
    idleHoursPerDay: 14,
    idleDaysPerYear: 365,
    smartPlugCostPerUnitAzn: 25,
    measurementCostAzn: 600,
  });

  // Measure 4: Solar Thermal Hot Water
  const [thermalInput, setThermalInput] = useState<ThermalWaterInput>({
    dailyHotWaterLiters: 10000,
    deltaTempC: 45,
    baselineEfficiency: 0.8,
    solarThermalFraction: 0.5,
    systemCostAzn: 28000,
    annualMaintenanceAzn: 800,
    measurementCostAzn: 1500,
  });

  // Measure 5: Boiler Combustion
  const [boilerInput, setBoilerInput] = useState<BoilerOptimizationInput>({
    annualFuelM3: 600000,
    currentEfficiencyPct: 78,
    optimizedEfficiencyPct: 88,
    equipmentCostAzn: 35000,
    annualTuningServiceAzn: 1200,
    measurementCostAzn: 2000,
  });

  // Active inclusion toggles
  const [enabled, setEnabled] = useState({
    lighting: true,
    hvac: true,
    plug: true,
    thermal: true,
    boiler: true,
  });

  // Apply scenario adjustments
  const scenarioMultiplier =
    scenario === "conservative" ? 0.85 : scenario === "optimistic" ? 1.15 : 1.0;

  // Compute measures with active tariffs & scenario
  const lightingRes = calculateLightingRetrofit({
    ...lightingInput,
    operatingHoursPerDay: Math.min(24, Math.max(0, lightingInput.operatingHoursPerDay)),
    operatingDaysPerYear: Math.min(365, Math.max(0, lightingInput.operatingDaysPerYear)),
    tariffPerKwh: elecTariff,
    emissionsFactorKgPerKwh: project.tariffs.gridEmissionsFactorKgPerKwh,
  });

  const hvacRes = calculateHvacScheduling({
    ...hvacInput,
    baselineRuntimeHoursWeek: Math.min(168, Math.max(0, hvacInput.baselineRuntimeHoursWeek)),
    optimizedRuntimeHoursWeek: Math.min(168, Math.max(0, hvacInput.optimizedRuntimeHoursWeek)),
    operatingWeeksYear: Math.min(52, Math.max(0, hvacInput.operatingWeeksYear)),
    averageLoadFactor: Math.min(1.0, Math.max(0.1, hvacInput.averageLoadFactor)),
    comfortVentilationConfirmed,
    tariffPerKwh: elecTariff,
    emissionsFactorKgPerKwh: project.tariffs.gridEmissionsFactorKgPerKwh,
  });

  const plugRes = calculatePlugLoad({
    ...plugInput,
    idleHoursPerDay: Math.min(24, Math.max(0, plugInput.idleHoursPerDay)),
    idleDaysPerYear: Math.min(365, Math.max(0, plugInput.idleDaysPerYear)),
    tariffPerKwh: elecTariff,
    emissionsFactorKgPerKwh: project.tariffs.gridEmissionsFactorKgPerKwh,
  });

  const thermalRes = calculateThermalWater({
    ...thermalInput,
    solarThermalFraction: Math.min(0.9, Math.max(0.1, thermalInput.solarThermalFraction)),
    gasTariffPerM3: gasTariff,
  });

  const boilerRes = calculateBoilerOptimization({
    ...boilerInput,
    gasTariffPerM3: gasTariff,
  });

  const rawActiveMeasures = [
    enabled.lighting ? lightingRes : null,
    enabled.hvac ? hvacRes : null,
    enabled.plug ? plugRes : null,
    enabled.thermal ? thermalRes : null,
    enabled.boiler ? boilerRes : null,
  ].filter(Boolean) as BaseEcmResult[];

  // Apply scenario scaling to savings
  const activeMeasures = rawActiveMeasures.map((ecm) => {
    if (scenario === "base") return ecm;
    const scaledKwh = Math.round(ecm.annualKwhSavings * scenarioMultiplier);
    const scaledFuel = ecm.annualFuelSavingsM3
      ? Math.round(ecm.annualFuelSavingsM3 * scenarioMultiplier)
      : undefined;
    const scaledGross = Math.round(ecm.annualGrossSavingsAzn * scenarioMultiplier);
    const scaledNet = scaledGross - ecm.annualRecurringCostAzn;
    const simplePaybackYears =
      scaledNet > 0
        ? Math.round((ecm.totalInitialInvestmentAzn / scaledNet) * 10) / 10
        : null;

    return {
      ...ecm,
      annualKwhSavings: scaledKwh,
      annualFuelSavingsM3: scaledFuel,
      annualGrossSavingsAzn: scaledGross,
      annualNetSavingsAzn: scaledNet,
      simplePaybackYears,
      avoidedCo2TonnesYear:
        ecm.avoidedCo2TonnesYear !== null
          ? Math.round(ecm.avoidedCo2TonnesYear * scenarioMultiplier * 10) / 10
          : null,
    };
  });

  // Keep store in sync
  useEffect(() => {
    setStoreInterventions(activeMeasures);
  }, [
    enabled,
    elecTariff,
    gasTariff,
    scenario,
    comfortVentilationConfirmed,
    lightingInput,
    hvacInput,
    plugInput,
    thermalInput,
    boilerInput,
  ]);

  const handleTariffChange = (newElec: number, newGas: number) => {
    setElecTariff(newElec);
    setGasTariff(newGas);
    updateTariffs({
      electricityTariffAznPerKwh: newElec,
      naturalGasTariffAznPerM3: newGas,
    });
  };

  const totalCapEx = activeMeasures.reduce((a, b) => a + (b.implementationCostAzn || 0), 0);
  const totalMAndVCost = activeMeasures.reduce((a, b) => a + (b.measurementCostAzn || 0), 0);
  const totalInvestmentAzn = activeMeasures.reduce((a, b) => a + (b.totalInitialInvestmentAzn || 0), 0);
  const totalKwh = activeMeasures.reduce((a, b) => a + b.annualKwhSavings, 0);
  const totalGrossSavingsAzn = activeMeasures.reduce((a, b) => a + b.annualGrossSavingsAzn, 0);
  const totalRecurringCostAzn = activeMeasures.reduce((a, b) => a + b.annualRecurringCostAzn, 0);
  const totalNetSavingsAzn = activeMeasures.reduce((a, b) => a + b.annualNetSavingsAzn, 0);
  const totalCo2 = activeMeasures.reduce((a, b) => a + (b.avoidedCo2TonnesYear || 0), 0);

  // Deterministic Simple Payback: Returns null if net savings <= 0 (never 999 years)
  const combinedPaybackYears =
    totalNetSavingsAzn > 0
      ? Math.round((totalInvestmentAzn / totalNetSavingsAzn) * 10) / 10
      : null;

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="3. Energy Conservation Measures (ECMs) & Financials"
        subtitle="Physically bounded engineering calculators with full lifecycle accounting and localized Azerbaijan tariffs."
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full space-y-8">
        {/* Global Tariff Customization Box */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DDE3DB]">
            <div>
              <h3 className="text-sm font-bold text-[#101C18] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#152E27]" />
                Utility Tariffs & Sensitivity Scenario (Azerbaijan)
              </h3>
              <p className="text-xs text-[#5D6D63]">
                Subsidized non-residential rate assumption: 0.125 AZN/kWh electricity, 0.25 AZN/m³ gas.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Scenario Toggle */}
              <div className="inline-flex rounded-lg border border-[#DDE3DB] p-0.5 bg-[#F4F5F0] text-xs font-semibold">
                <button
                  onClick={() => setScenario("conservative")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    scenario === "conservative"
                      ? "bg-white text-[#B74740] shadow-sm font-bold"
                      : "text-[#5D6D63] hover:text-[#101C18]"
                  }`}
                >
                  Conservative (-15%)
                </button>
                <button
                  onClick={() => setScenario("base")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    scenario === "base"
                      ? "bg-[#152E27] text-white shadow-sm font-bold"
                      : "text-[#5D6D63] hover:text-[#101C18]"
                  }`}
                >
                  Base Case
                </button>
                <button
                  onClick={() => setScenario("optimistic")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    scenario === "optimistic"
                      ? "bg-white text-[#152E27] shadow-sm font-bold"
                      : "text-[#5D6D63] hover:text-[#101C18]"
                  }`}
                >
                  Optimistic (+15%)
                </button>
              </div>

              <button
                onClick={() => handleTariffChange(DEFAULT_AZN_TARIFF_PER_KWH, DEFAULT_AZN_TARIFF_PER_M3_GAS)}
                className="inline-flex items-center gap-1.5 text-xs text-[#5D6D63] hover:text-[#101C18]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Electricity Tariff (AZN / kWh)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.005"
                  min="0.05"
                  max="0.50"
                  value={elecTariff}
                  onChange={(e) => handleTariffChange(parseFloat(e.target.value) || 0.125, gasTariff)}
                  className="w-36 p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-sm text-[#18211C]"
                />
                <span className="text-[#68736C]">
                  ~${(elecTariff / 1.7).toFixed(3)}/kWh (Default: 0.125 AZN)
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#18211C] mb-1">
                Natural Gas Tariff (AZN / m³)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.10"
                  max="1.00"
                  value={gasTariff}
                  onChange={(e) => handleTariffChange(elecTariff, parseFloat(e.target.value) || 0.25)}
                  className="w-36 p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-sm text-[#18211C]"
                />
                <span className="text-[#68736C]">
                  ~${(gasTariff / 1.7).toFixed(3)}/m³ (Default: 0.25 AZN)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lifecycle Portfolio Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="card-editorial p-4 bg-white">
            <div className="text-xs text-[#5D6D63]">Total Initial Investment</div>
            <div className="text-xl font-bold text-[#101C18] mt-1 font-mono">
              {totalInvestmentAzn.toLocaleString()} AZN
            </div>
            <div className="text-[11px] text-[#5D6D63] mt-1">
              CapEx: {totalCapEx.toLocaleString()} • M&V: {totalMAndVCost.toLocaleString()}
            </div>
          </div>

          <div className="card-editorial p-4 bg-white">
            <div className="text-xs text-[#5D6D63]">Gross Utility Savings</div>
            <div className="text-xl font-bold text-[#152E27] mt-1 font-mono">
              {totalGrossSavingsAzn.toLocaleString()} AZN/yr
            </div>
            <div className="text-[11px] text-[#152E27] mt-1 font-semibold">
              {totalKwh.toLocaleString()} kWh/yr total
            </div>
          </div>

          <div className="card-editorial p-4 bg-white">
            <div className="text-xs text-[#5D6D63]">Annual Recurring O&M</div>
            <div className="text-xl font-bold text-[#B74740] mt-1 font-mono">
              -{totalRecurringCostAzn.toLocaleString()} AZN/yr
            </div>
            <div className="text-[11px] text-[#5D6D63] mt-1">Maintenance & telemetry</div>
          </div>

          <div className="card-editorial p-4 bg-white">
            <div className="text-xs text-[#5D6D63]">Net Annual Cash Flow</div>
            <div
              className={`text-xl font-bold mt-1 font-mono ${
                totalNetSavingsAzn > 0 ? "text-[#152E27]" : "text-[#B74740]"
              }`}
            >
              {totalNetSavingsAzn.toLocaleString()} AZN/yr
            </div>
            <div className="text-[11px] text-[#5D6D63] mt-1">
              Gross savings minus recurring
            </div>
          </div>

          <div className="card-editorial p-4 bg-white col-span-2 sm:col-span-1">
            <div className="text-xs text-[#5D6D63]">Simple Payback Period</div>
            <div className="text-xl font-bold text-[#101C18] mt-1 font-mono">
              {combinedPaybackYears !== null ? `${combinedPaybackYears.toFixed(1)} years` : "No positive payback"}
            </div>
            <div className="text-[11px] text-[#5D6D63] mt-1">
              {combinedPaybackYears !== null ? "Total investment / net annual" : "Net annual savings ≤ 0"}
            </div>
          </div>
        </div>

        {/* Visual Engineering Models */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE3DB]">
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27] tracking-wider">
                Engineering Visualizer &bull; Physical Mechanics
              </span>
              <h3 className="text-sm font-bold text-[#101C18]">
                Interactive Equipment &amp; Retrofit Schematics
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisualTab("lighting")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  visualTab === "lighting"
                    ? "bg-[#152E27] text-[#D9FF91]"
                    : "bg-[#F4F5F0] text-[#5D6D63] hover:text-[#101C18]"
                }`}
              >
                LED vs Fluorescent Model
              </button>
              <button
                onClick={() => setVisualTab("hvac")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  visualTab === "hvac"
                    ? "bg-[#152E27] text-[#D9FF91]"
                    : "bg-[#F4F5F0] text-[#5D6D63] hover:text-[#101C18]"
                }`}
              >
                HVAC Runtime &amp; Setbacks
              </button>
            </div>
          </div>

          <div>
            {visualTab === "lighting" ? (
              <LightingRetrofitVisual />
            ) : (
              <HvacSystemsVisual />
            )}
          </div>
        </div>

        {/* 5 Interactive ECM Calculators */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#18211C]">
            Recommended Energy Conservation Measures (5 Modules)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ECM 1: LED */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-green text-[10px] font-semibold px-2 py-0.5 rounded">
                    Lighting (Option A)
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled.lighting}
                    onChange={(e) => setEnabled({ ...enabled, lighting: e.target.checked })}
                    className="w-4 h-4 accent-[#245C43]"
                  />
                </div>
                <h4 className="font-bold text-sm text-[#18211C]">
                  LED Lighting Retrofit & Sensors
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[#68736C]">Fixture Count:</label>
                    <input
                      type="number"
                      min="0"
                      value={lightingInput.fixtureCount}
                      onChange={(e) =>
                        setLightingInput({ ...lightingInput, fixtureCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Baseline Watts:</label>
                      <input
                        type="number"
                        min="1"
                        value={lightingInput.baselineWattsPerFixture}
                        onChange={(e) =>
                          setLightingInput({
                            ...lightingInput,
                            baselineWattsPerFixture: Math.max(1, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">LED Watts:</label>
                      <input
                        type="number"
                        min="1"
                        value={lightingInput.retrofitWattsPerFixture}
                        onChange={(e) =>
                          setLightingInput({
                            ...lightingInput,
                            retrofitWattsPerFixture: Math.max(1, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Operating Hrs/Day:</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={lightingInput.operatingHoursPerDay}
                        onChange={(e) =>
                          setLightingInput({
                            ...lightingInput,
                            operatingHoursPerDay: Math.min(24, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">Operating Days/Yr:</label>
                      <input
                        type="number"
                        min="0"
                        max="365"
                        value={lightingInput.operatingDaysPerYear}
                        onChange={(e) =>
                          setLightingInput({
                            ...lightingInput,
                            operatingDaysPerYear: Math.min(365, Math.max(0, parseInt(e.target.value) || 0)),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3 border-t border-[#DFE5E0] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#245C43]">
                  <span>Savings:</span>
                  <span>{lightingRes.annualKwhSavings.toLocaleString()} kWh/yr</span>
                </div>
                <div className="flex justify-between text-[#68736C]">
                  <span>Net Savings: {lightingRes.annualNetSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>
                    Payback:{" "}
                    {lightingRes.simplePaybackYears !== null
                      ? `${lightingRes.simplePaybackYears.toFixed(1)} yrs`
                      : "No payback"}
                  </span>
                </div>
              </div>
            </div>

            {/* ECM 2: HVAC */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px] font-semibold px-2 py-0.5 rounded">
                    HVAC (Option B/C)
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled.hvac}
                    onChange={(e) => setEnabled({ ...enabled, hvac: e.target.checked })}
                    className="w-4 h-4 accent-[#245C43]"
                  />
                </div>
                <h4 className="font-bold text-sm text-[#18211C]">
                  HVAC Scheduling & Night Setbacks
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[#68736C]">Cooling Capacity (kW):</label>
                    <input
                      type="number"
                      min="0"
                      value={hvacInput.coolingCapacityKw}
                      onChange={(e) =>
                        setHvacInput({ ...hvacInput, coolingCapacityKw: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Base Hrs/Wk:</label>
                      <input
                        type="number"
                        min="0"
                        max="168"
                        value={hvacInput.baselineRuntimeHoursWeek}
                        onChange={(e) =>
                          setHvacInput({
                            ...hvacInput,
                            baselineRuntimeHoursWeek: Math.min(168, Math.max(0, parseInt(e.target.value) || 0)),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">Target Hrs/Wk:</label>
                      <input
                        type="number"
                        min="0"
                        max="168"
                        value={hvacInput.optimizedRuntimeHoursWeek}
                        onChange={(e) =>
                          setHvacInput({
                            ...hvacInput,
                            optimizedRuntimeHoursWeek: Math.min(168, Math.max(0, parseInt(e.target.value) || 0)),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                  </div>
                  {/* Ventilation Safeguard Confirmation */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#18211C]">
                      <input
                        type="checkbox"
                        checked={comfortVentilationConfirmed}
                        onChange={(e) => setComfortVentilationConfirmed(e.target.checked)}
                        className="w-3.5 h-3.5 mt-0.5 accent-[#245C43]"
                      />
                      <span className="leading-tight text-[#68736C]">
                        Confirm ASHRAE 62.1 dormitory ventilation & thermal comfort minimums preserved
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3 border-t border-[#DFE5E0] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#245C43]">
                  <span>Savings:</span>
                  <span>{hvacRes.annualKwhSavings.toLocaleString()} kWh/yr</span>
                </div>
                <div className="flex justify-between text-[#68736C]">
                  <span>Net Savings: {hvacRes.annualNetSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>
                    Payback:{" "}
                    {hvacRes.simplePaybackYears !== null
                      ? `${hvacRes.simplePaybackYears.toFixed(1)} yrs`
                      : "No payback"}
                  </span>
                </div>
              </div>
            </div>

            {/* ECM 3: Plug Load */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-amber text-[10px] font-semibold px-2 py-0.5 rounded">
                    Plug Loads (Option A)
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled.plug}
                    onChange={(e) => setEnabled({ ...enabled, plug: e.target.checked })}
                    className="w-4 h-4 accent-[#245C43]"
                  />
                </div>
                <h4 className="font-bold text-sm text-[#18211C]">
                  Smart Power Strips / Cutoffs
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[#68736C]">Workstation Count:</label>
                    <input
                      type="number"
                      min="0"
                      value={plugInput.workstationCount}
                      onChange={(e) =>
                        setPlugInput({ ...plugInput, workstationCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[#68736C]">Nightly Idle Hours / Day:</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={plugInput.idleHoursPerDay}
                      onChange={(e) =>
                        setPlugInput({
                          ...plugInput,
                          idleHoursPerDay: Math.min(24, Math.max(0, parseFloat(e.target.value) || 0)),
                        })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3 border-t border-[#DFE5E0] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#245C43]">
                  <span>Savings:</span>
                  <span>{plugRes.annualKwhSavings.toLocaleString()} kWh/yr</span>
                </div>
                <div className="flex justify-between text-[#68736C]">
                  <span>Net Savings: {plugRes.annualNetSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>
                    Payback:{" "}
                    {plugRes.simplePaybackYears !== null
                      ? `${plugRes.simplePaybackYears.toFixed(1)} yrs`
                      : "No payback"}
                  </span>
                </div>
              </div>
            </div>

            {/* ECM 4: Thermal Hot Water */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-green text-[10px] font-semibold px-2 py-0.5 rounded">
                    Solar Thermal (Option B)
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled.thermal}
                    onChange={(e) => setEnabled({ ...enabled, thermal: e.target.checked })}
                    className="w-4 h-4 accent-[#245C43]"
                  />
                </div>
                <h4 className="font-bold text-sm text-[#18211C]">
                  Solar Thermal Hot Water Pre-Heat
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[#68736C]">Daily Hot Water (Liters):</label>
                    <input
                      type="number"
                      min="0"
                      value={thermalInput.dailyHotWaterLiters}
                      onChange={(e) =>
                        setThermalInput({
                          ...thermalInput,
                          dailyHotWaterLiters: Math.max(0, parseInt(e.target.value) || 0),
                        })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[#68736C]">Solar Solar Fraction (%):</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="0.9"
                      value={thermalInput.solarThermalFraction}
                      onChange={(e) =>
                        setThermalInput({
                          ...thermalInput,
                          solarThermalFraction: Math.min(0.9, Math.max(0.1, parseFloat(e.target.value) || 0.5)),
                        })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3 border-t border-[#DFE5E0] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#245C43]">
                  <span>Fuel Saved:</span>
                  <span>{thermalRes.annualFuelSavingsM3?.toLocaleString()} m³/yr</span>
                </div>
                <div className="flex justify-between text-[#68736C]">
                  <span>Net Savings: {thermalRes.annualNetSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>
                    Payback:{" "}
                    {thermalRes.simplePaybackYears !== null
                      ? `${thermalRes.simplePaybackYears.toFixed(1)} yrs`
                      : "No payback"}
                  </span>
                </div>
              </div>
            </div>

            {/* ECM 5: Boiler Tuning */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px] font-semibold px-2 py-0.5 rounded">
                    Combustion (Option B)
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled.boiler}
                    onChange={(e) => setEnabled({ ...enabled, boiler: e.target.checked })}
                    className="w-4 h-4 accent-[#245C43]"
                  />
                </div>
                <h4 className="font-bold text-sm text-[#18211C]">
                  Boiler O₂ Trim & Condensing Economizer
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[#68736C]">Annual Fuel Input (m³):</label>
                    <input
                      type="number"
                      min="0"
                      value={boilerInput.annualFuelM3}
                      onChange={(e) =>
                        setBoilerInput({ ...boilerInput, annualFuelM3: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Base Eff (%):</label>
                      <input
                        type="number"
                        min="50"
                        max="95"
                        value={boilerInput.currentEfficiencyPct}
                        onChange={(e) =>
                          setBoilerInput({
                            ...boilerInput,
                            currentEfficiencyPct: Math.min(95, Math.max(50, parseInt(e.target.value) || 78)),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">Tuned Eff (%):</label>
                      <input
                        type="number"
                        min="55"
                        max="98"
                        value={boilerInput.optimizedEfficiencyPct}
                        onChange={(e) =>
                          setBoilerInput({
                            ...boilerInput,
                            optimizedEfficiencyPct: Math.min(98, Math.max(55, parseInt(e.target.value) || 88)),
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-3 border-t border-[#DFE5E0] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#245C43]">
                  <span>Fuel Saved:</span>
                  <span>{boilerRes.annualFuelSavingsM3?.toLocaleString()} m³/yr</span>
                </div>
                <div className="flex justify-between text-[#68736C]">
                  <span>Net Savings: {boilerRes.annualNetSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>
                    Payback:{" "}
                    {boilerRes.simplePaybackYears !== null
                      ? `${boilerRes.simplePaybackYears.toFixed(1)} yrs`
                      : "No payback"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Breakdown Chart */}
        <SavingsBarChart interventions={activeMeasures} />
      </main>
    </div>
  );
}
