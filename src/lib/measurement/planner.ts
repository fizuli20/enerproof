import { Resolution } from "../types";

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

export function generateMeasurementPlan(params: {
  category: "lighting" | "hvac" | "plug_load" | "thermal_water" | "boiler" | "multi_measure";
  expectedSavingsPct: number;
  baselineCvRmsePct: number;
  resolution: Resolution;
  hasSubmetering: boolean;
}): MeasurementPlan {
  const { category, expectedSavingsPct, baselineCvRmsePct, hasSubmetering } = params;

  // Decision logic for IPMVP Option:
  if (category === "lighting" || category === "plug_load") {
    return {
      recommendedOption: "IPMVP Option A",
      optionTitle: "Retrofit Isolation: Key Parameter Measurement",
      rationale:
        "Lighting and plug loads exhibit stable nominal power draws. Measuring operating hours via light/current loggers with spot wattage checks provides high accuracy with minimal metering expense.",
      meteringBoundary: "Individual electrical lighting circuits / panelboards or representative fixture sample.",
      recommendedHardware: [
        "Current-activated state loggers (e.g. Onset HOBO UX90)",
        "True-RMS digital clamp meter for pre/post spot power measurements",
        "Panel-level sub-meter with Modbus/Pulse output",
      ],
      loggingIntervalMinutes: 15,
      minimumRecommendedDurationDays: 30,
      expectedFsuPct: 12.5,
      riskMitigation: [
        "Take calibrated spot power measurements on 10% random fixture sample",
        "Log operational hours across both weekday and weekend patterns",
        "Verify cleaning and janitorial night shift schedules",
      ],
    };
  }

  if (category === "thermal_water" || category === "boiler") {
    return {
      recommendedOption: "IPMVP Option B",
      optionTitle: "Retrofit Isolation: All Parameter Measurement",
      rationale:
        "Thermal energy flows vary continuously with weather, water inlet temperature, and occupancy. Continuous measurement of flow rates, supply/return temperatures, and gas fuel input is required.",
      meteringBoundary: "Boiler room gas manifold, heat exchanger supply/return headers, domestic hot water inlet/outlet.",
      recommendedHardware: [
        "Ultrasonic BTU/thermal energy flow meter with matched PT1000 temperature sensors",
        "Turbine or diaphragm natural gas pulse meter with volume corrector",
        "Flue gas oxygen & temperature analyzer for combustion efficiency logging",
      ],
      loggingIntervalMinutes: 15,
      minimumRecommendedDurationDays: 60,
      expectedFsuPct: 18.0,
      riskMitigation: [
        "Calibrate ultrasonic flow transducers against pipe wall thickness and fluid glycol concentration",
        "Ensure gas volume corrector compensates for Baku ambient pressure and seasonal temperature fluctuations",
      ],
    };
  }

  // HVAC or Multi-measure
  if (hasSubmetering || expectedSavingsPct < 12.0) {
    return {
      recommendedOption: "IPMVP Option B",
      optionTitle: "Retrofit Isolation: Dedicated HVAC Sub-Metering",
      rationale:
        expectedSavingsPct < 12.0
          ? `Expected savings (${expectedSavingsPct.toFixed(1)}%) are below the whole-building daily detection threshold (11.8%). Whole-facility meter (Option C) would yield unacceptable uncertainty. Submetering the HVAC plant directly is mandatory.`
          : "Submetering isolates the HVAC cooling and ventilation circuits from unaffected lighting and receptacle noise.",
      meteringBoundary: "Main HVAC distribution panel / chiller power feeds / Air Handling Unit VFD circuits.",
      recommendedHardware: [
        "Three-phase multi-circuit power meter with split-core current transformers (CTs)",
        "Ambient air dry-bulb and wet-bulb temperature sensors (Class A RTD)",
        "Building Automation System (BAS) trend log export for chilled water setpoints",
      ],
      loggingIntervalMinutes: 15,
      minimumRecommendedDurationDays: 90,
      expectedFsuPct: 16.4,
      riskMitigation: [
        "Establish baseline cooling degree-day regressions over at least 3 months of summer cooling season",
        "Cross-validate chiller electrical power against thermal refrigeration output (kW/ton)",
      ],
    };
  }

  // Deep retrofits with large savings (> 12%) and whole-building smart meters
  const minDays = Math.max(90, Math.round((2.0 * baselineCvRmsePct) / (expectedSavingsPct / 100)));
  return {
    recommendedOption: "IPMVP Option C",
    optionTitle: "Whole Facility M&V: Interval Utility Metering",
    rationale:
      `Expected savings (${expectedSavingsPct.toFixed(1)}%) clear the whole-facility detection threshold. Whole-building interval meter analysis with weather regression is acceptable.`,
    meteringBoundary: "Main utility billing revenue meter (Azerishiq boundary meter).",
    recommendedHardware: [
      "Azerishiq smart utility meter interval data export (hourly or daily)",
      "On-site ambient weather station or Baku Heydar Aliyev International Airport NOAA station",
    ],
    loggingIntervalMinutes: 60,
    minimumRecommendedDurationDays: Math.min(365, minDays),
    expectedFsuPct: 24.8,
    riskMitigation: [
      "Monitor non-routine events (unplanned campus closures, new server rooms, construction)",
      "Ensure balance point temperature (typically 18.33°C) is verified through degree-day sensitivity testing",
    ],
  };
}
