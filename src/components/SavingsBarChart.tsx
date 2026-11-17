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
    <div className="w-full card-editorial p-6 bg-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDE3DB] gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#101C18]">Annual Savings by Energy Conservation Measure</h3>
          <p className="text-xs text-[#5D6D63]">Electricity &amp; Gas Equivalent Savings (kWh/yr)</p>
        </div>
        <span className="text-xs font-mono text-[#5D6D63]">Relative impact comparison</span>
      </div>

      <div className="space-y-4 pt-1">
        {interventions.map((ecm) => {
          const pct = Math.max(4, Math.round((ecm.annualKwhSavings / maxKwh) * 100));
          const costSavings = ecm.annualGrossSavingsAzn ?? ecm.annualCostSavingsAzn ?? 0;
          const capEx = ecm.implementationCostAzn ?? ecm.capitalCostAzn ?? 0;

          return (
            <div key={ecm.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#101C18]">{ecm.name}</span>
                <span className="font-mono font-bold text-[#152E27]">
                  {ecm.annualKwhSavings.toLocaleString()} kWh/yr ({costSavings.toLocaleString()} AZN)
                </span>
              </div>

              {/* Progress Bar with Lime Accent */}
              <div className="w-full bg-[#F4F5F0] h-2.5 rounded-full overflow-hidden border border-[#DDE3DB]">
                <div
                  className="bg-[#152E27] h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${pct}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#D9FF91] rounded-r-full" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5D6D63] font-mono">
                <span>CapEx: {capEx.toLocaleString()} AZN</span>
                <span>
                  Simple Payback:{" "}
                  {ecm.simplePaybackYears !== null && ecm.simplePaybackYears !== undefined
                    ? `${ecm.simplePaybackYears.toFixed(1)} yrs`
                    : "No positive payback"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
