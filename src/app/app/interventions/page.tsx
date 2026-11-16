"use client";

import React, { useState } from "react";
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
} from "@/lib/interventions/calculators";
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
} from "lucide-react";

export default function InterventionsPage() {
  // Global tariffs (editable)
  const [elecTariff, setElecTariff] = useState<number>(DEFAULT_AZN_TARIFF_PER_KWH);
  const [gasTariff, setGasTariff] = useState<number>(DEFAULT_AZN_TARIFF_PER_M3_GAS);

  // Measure 1: Lighting
  const [lightingInput, setLightingInput] = useState<LightingRetrofitInput>({
    fixtureCount: 500,
    baselineWattsPerFixture: 64, // 2x32W T8
    retrofitWattsPerFixture: 24, // 2x12W LED
    operatingHoursPerDay: 12,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: 35,
  });

  // Measure 2: HVAC
  const [hvacInput, setHvacInput] = useState<HvacScheduleInput>({
    coolingCapacityKw: 120,
    baselineRuntimeHoursWeek: 70,
    optimizedRuntimeHoursWeek: 45,
    operatingWeeksYear: 26,
    averageLoadFraction: 0.7,
    implementationCostAzn: 4500,
  });

  // Measure 3: Plug Load
  const [plugInput, setPlugInput] = useState<PlugLoadInput>({
    workstationCount: 200,
    baselineIdleWatts: 45,
    smartPlugIdleWatts: 5,
    idleHoursPerDay: 14,
    idleDaysPerYear: 365,
    smartPlugCostPerUnitAzn: 25,
  });

  // Measure 4: Solar Thermal Hot Water
  const [thermalInput, setThermalInput] = useState<ThermalWaterInput>({
    dailyHotWaterLiters: 10000,
    deltaTempC: 45,
    baselineEfficiency: 0.8,
    solarThermalFraction: 0.5,
    systemCostAzn: 28000,
  });

  // Measure 5: Boiler Combustion
  const [boilerInput, setBoilerInput] = useState<BoilerOptimizationInput>({
    annualFuelM3: 600000,
    currentEfficiencyPct: 78,
    optimizedEfficiencyPct: 88,
    equipmentCostAzn: 35000,
  });

  // Active inclusion toggles
  const [enabled, setEnabled] = useState({
    lighting: true,
    hvac: true,
    plug: true,
    thermal: true,
    boiler: true,
  });

  // Compute measures with active tariffs
  const lightingRes = calculateLightingRetrofit({ ...lightingInput, tariffPerKwh: elecTariff });
  const hvacRes = calculateHvacScheduling({ ...hvacInput, tariffPerKwh: elecTariff });
  const plugRes = calculatePlugLoad({ ...plugInput, tariffPerKwh: elecTariff });
  const thermalRes = calculateThermalWater({ ...thermalInput, gasTariffPerM3: gasTariff });
  const boilerRes = calculateBoilerOptimization({ ...boilerInput, gasTariffPerM3: gasTariff });

  const activeMeasures = [
    enabled.lighting ? lightingRes : null,
    enabled.hvac ? hvacRes : null,
    enabled.plug ? plugRes : null,
    enabled.thermal ? thermalRes : null,
    enabled.boiler ? boilerRes : null,
  ].filter(Boolean) as typeof lightingRes[];

  const totalCapEx = activeMeasures.reduce((a, b) => a + b.capitalCostAzn, 0);
  const totalKwh = activeMeasures.reduce((a, b) => a + b.annualKwhSavings, 0);
  const totalSavingsAzn = activeMeasures.reduce((a, b) => a + b.annualCostSavingsAzn, 0);
  const totalCo2 = activeMeasures.reduce((a, b) => a + b.avoidedCo2TonnesYear, 0);
  const combinedPayback = totalSavingsAzn > 0 ? Math.round((totalCapEx / totalSavingsAzn) * 10) / 10 : 999.0;

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="3. Energy Conservation Measures (ECMs) & Financials"
        subtitle="Interactive engineering calculators with localized Azerbaijan utility tariffs and simple payback analysis."
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Global Tariff Customization Box */}
        <div className="card-base p-5 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#DFE5E0]">
            <div>
              <h3 className="text-sm font-bold text-[#18211C] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#245C43]" />
                Utility Tariffs & Economic Parameters (Azerbaijan)
              </h3>
              <p className="text-xs text-[#68736C]">
                Subsidized non-residential rates decree. Adjust tariffs below to model market price reform scenarios.
              </p>
            </div>
            <button
              onClick={() => {
                setElecTariff(DEFAULT_AZN_TARIFF_PER_KWH);
                setGasTariff(DEFAULT_AZN_TARIFF_PER_M3_GAS);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#68736C] hover:text-[#18211C]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
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
                  onChange={(e) => setElecTariff(parseFloat(e.target.value) || 0.125)}
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
                  onChange={(e) => setGasTariff(parseFloat(e.target.value) || 0.25)}
                  className="w-36 p-2 rounded border border-[#DFE5E0] bg-[#F8F9F7] font-mono text-sm text-[#18211C]"
                />
                <span className="text-[#68736C]">
                  ~${(gasTariff / 1.7).toFixed(3)}/m³ (Default: 0.25 AZN)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Total Retrofit CapEx</div>
            <div className="text-xl font-bold text-[#18211C] mt-1 font-mono">
              {totalCapEx.toLocaleString()} AZN
            </div>
            <div className="text-[11px] text-[#68736C] mt-1">
              ~${Math.round(totalCapEx / 1.7).toLocaleString()} USD
            </div>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Annual Energy Savings</div>
            <div className="text-xl font-bold text-[#245C43] mt-1 font-mono">
              {totalKwh.toLocaleString()} kWh
            </div>
            <div className="text-[11px] text-[#245C43] mt-1">Equivalent site savings</div>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Annual Utility Savings</div>
            <div className="text-xl font-bold text-[#245C43] mt-1 font-mono">
              {totalSavingsAzn.toLocaleString()} AZN/yr
            </div>
            <div className="text-[11px] text-[#68736C] mt-1">
              ~${Math.round(totalSavingsAzn / 1.7).toLocaleString()} USD/yr
            </div>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-[#68736C]">Combined Payback</div>
            <div className="text-xl font-bold text-[#18211C] mt-1 font-mono">
              {combinedPayback.toFixed(1)} years
            </div>
            <div className="text-[11px] text-[#245C43] mt-1">Attractive ESCO ROI</div>
          </div>

          <div className="card-base p-4 col-span-2 sm:col-span-1">
            <div className="text-xs text-[#68736C]">Avoided Emissions</div>
            <div className="text-xl font-bold text-[#18211C] mt-1 font-mono">
              {totalCo2.toFixed(1)} t CO₂/yr
            </div>
            <div className="text-[11px] text-[#68736C] mt-1">Clean energy impact</div>
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
                    Lighting
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
                      value={lightingInput.fixtureCount}
                      onChange={(e) =>
                        setLightingInput({ ...lightingInput, fixtureCount: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Baseline Watts:</label>
                      <input
                        type="number"
                        value={lightingInput.baselineWattsPerFixture}
                        onChange={(e) =>
                          setLightingInput({
                            ...lightingInput,
                            baselineWattsPerFixture: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">LED Watts:</label>
                      <input
                        type="number"
                        value={lightingInput.retrofitWattsPerFixture}
                        onChange={(e) =>
                          setLightingInput({
                            ...lightingInput,
                            retrofitWattsPerFixture: parseInt(e.target.value) || 0,
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
                  <span>Cost Savings: {lightingRes.annualCostSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>Payback: {lightingRes.simplePaybackYears.toFixed(1)} yrs</span>
                </div>
              </div>
            </div>

            {/* ECM 2: HVAC */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px] font-semibold px-2 py-0.5 rounded">
                    HVAC Automation
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
                      value={hvacInput.coolingCapacityKw}
                      onChange={(e) =>
                        setHvacInput({ ...hvacInput, coolingCapacityKw: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Base Hrs/Wk:</label>
                      <input
                        type="number"
                        value={hvacInput.baselineRuntimeHoursWeek}
                        onChange={(e) =>
                          setHvacInput({
                            ...hvacInput,
                            baselineRuntimeHoursWeek: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">Target Hrs/Wk:</label>
                      <input
                        type="number"
                        value={hvacInput.optimizedRuntimeHoursWeek}
                        onChange={(e) =>
                          setHvacInput({
                            ...hvacInput,
                            optimizedRuntimeHoursWeek: parseInt(e.target.value) || 0,
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
                  <span>{hvacRes.annualKwhSavings.toLocaleString()} kWh/yr</span>
                </div>
                <div className="flex justify-between text-[#68736C]">
                  <span>Cost Savings: {hvacRes.annualCostSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>Payback: {hvacRes.simplePaybackYears.toFixed(1)} yrs</span>
                </div>
              </div>
            </div>

            {/* ECM 3: Plug Load */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-amber text-[10px] font-semibold px-2 py-0.5 rounded">
                    Plug Loads
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
                      value={plugInput.workstationCount}
                      onChange={(e) =>
                        setPlugInput({ ...plugInput, workstationCount: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[#68736C]">Nightly Idle Hours / Day:</label>
                    <input
                      type="number"
                      value={plugInput.idleHoursPerDay}
                      onChange={(e) =>
                        setPlugInput({ ...plugInput, idleHoursPerDay: parseInt(e.target.value) || 0 })
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
                  <span>Cost Savings: {plugRes.annualCostSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>Payback: {plugRes.simplePaybackYears.toFixed(1)} yrs</span>
                </div>
              </div>
            </div>

            {/* ECM 4: Thermal Hot Water */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-green text-[10px] font-semibold px-2 py-0.5 rounded">
                    Solar Thermal
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
                      value={thermalInput.dailyHotWaterLiters}
                      onChange={(e) =>
                        setThermalInput({
                          ...thermalInput,
                          dailyHotWaterLiters: parseInt(e.target.value) || 0,
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
                      min="0.2"
                      max="0.8"
                      value={thermalInput.solarThermalFraction}
                      onChange={(e) =>
                        setThermalInput({
                          ...thermalInput,
                          solarThermalFraction: parseFloat(e.target.value) || 0.5,
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
                  <span>Cost Savings: {thermalRes.annualCostSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>Payback: {thermalRes.simplePaybackYears.toFixed(1)} yrs</span>
                </div>
              </div>
            </div>

            {/* ECM 5: Boiler Tuning */}
            <div className="card-base p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px] font-semibold px-2 py-0.5 rounded">
                    Combustion
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
                      value={boilerInput.annualFuelM3}
                      onChange={(e) =>
                        setBoilerInput({ ...boilerInput, annualFuelM3: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#68736C]">Base Eff (%):</label>
                      <input
                        type="number"
                        value={boilerInput.currentEfficiencyPct}
                        onChange={(e) =>
                          setBoilerInput({
                            ...boilerInput,
                            currentEfficiencyPct: parseInt(e.target.value) || 78,
                          })
                        }
                        className="w-full p-1.5 mt-0.5 rounded border border-[#DFE5E0] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[#68736C]">Tuned Eff (%):</label>
                      <input
                        type="number"
                        value={boilerInput.optimizedEfficiencyPct}
                        onChange={(e) =>
                          setBoilerInput({
                            ...boilerInput,
                            optimizedEfficiencyPct: parseInt(e.target.value) || 88,
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
                  <span>Cost Savings: {boilerRes.annualCostSavingsAzn.toLocaleString()} AZN/yr</span>
                  <span>Payback: {boilerRes.simplePaybackYears.toFixed(1)} yrs</span>
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
