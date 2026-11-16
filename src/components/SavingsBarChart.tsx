"use client";

import React from "react";

interface EcmChartItem {
  id: string;
  name: string;
  annualKwhSavings: number;
  annualGrossSavingsAzn?: number;
  annualCostSavingsAzn?: number;
  annualNetSavingsAzn?: number;
  implementationCostAzn?: number;
  capitalCostAzn?: number;
  simplePaybackYears?: number | null;
  avoidedCo2TonnesYear?: number | null;
}

interface SavingsBarChartProps {
  interventions: EcmChartItem[];
}

export function SavingsBarChart({ interventions }: SavingsBarChartProps) {
  if (!interventions || interventions.length === 0) return null;

  const maxKwh = Math.max(...interventions.map((i) => i.annualKwhSavings), 1);

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#DFE5E0] rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#DFE5E0]">
        <div>
          <h3 className="text-sm font-semibold text-[#18211C]">Annual Savings by Energy Conservation Measure</h3>
          <p className="text-xs text-[#68736C]">Electricity & Gas Equivalent Savings (kWh/yr)</p>
        </div>
      </div>

      <div className="space-y-4">
        {interventions.map((ecm) => {
          const pct = Math.round((ecm.annualKwhSavings / maxKwh) * 100);
          const costSavings = ecm.annualGrossSavingsAzn ?? ecm.annualCostSavingsAzn ?? 0;
          const capEx = ecm.implementationCostAzn ?? ecm.capitalCostAzn ?? 0;

          return (
            <div key={ecm.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#18211C]">{ecm.name}</span>
                <span className="font-mono font-semibold text-[#245C43]">
                  {ecm.annualKwhSavings.toLocaleString()} kWh/yr ({costSavings.toLocaleString()} AZN)
                </span>
              </div>
              <div className="w-full bg-[#F8F9F7] h-3 rounded-full overflow-hidden border border-[#DFE5E0]">
                <div
                  className="bg-[#245C43] h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#68736C]">
                <span>CapEx: {capEx.toLocaleString()} AZN</span>
                <span>
                  Simple Payback:{" "}
                  {ecm.simplePaybackYears !== null && ecm.simplePaybackYears !== undefined
                    ? `${ecm.simplePaybackYears.toFixed(1)} yrs`
                    : "No positive payback"}
                </span>
                <span>
                  Avoided CO₂:{" "}
                  {ecm.avoidedCo2TonnesYear !== null && ecm.avoidedCo2TonnesYear !== undefined
                    ? `${ecm.avoidedCo2TonnesYear.toFixed(1)} t/yr`
                    : "Unvalidated"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
