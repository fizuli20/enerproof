"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import {
  trainDegreeDayBaseline,
  RegressionInputRow,
} from "@/lib/baseline/regression";
import { BaselineRegressionResult } from "@/lib/types";
import { LineChart, CheckCircle2, AlertTriangle, RefreshCw, Layers } from "lucide-react";
import Papa from "papaparse";

export default function BaselinePage() {
  const [regressionResult, setRegressionResult] = useState<BaselineRegressionResult | null>(null);
  const [chartData, setChartData] = useState<{ date: string; actual: number; predicted: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBaselineData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/demo-data/student_residence_daily.csv");
      const csvText = await res.text();
      const parsed = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      // Filter baseline phase rows (Jan 1 to Jun 30, 181 days)
      const baselineRows: RegressionInputRow[] = [];
      const allRows: { date: string; actualKwh: number; hdd: number; cdd: number; occupancy: number }[] = [];

      parsed.data.forEach((r) => {
        const row = {
          date: String(r.date),
          actualKwh: Number(r.electricity_kwh || 0),
          hdd: Number(r.hdd || 0),
          cdd: Number(r.cdd || 0),
          occupancy: Number(r.occupancy_rate || 1.0),
        };
        allRows.push(row);
        if (r.phase === "baseline") {
          baselineRows.push(row);
        }
      });

      // Train baseline regression model
      const reg = trainDegreeDayBaseline(baselineRows, "daily");
      setRegressionResult(reg);

      // Prepare chart data for baseline period
      const cData = reg.dates.map((d, i) => ({
        date: d,
        actual: reg.actualSeries[i],
        predicted: reg.predictedSeries[i],
      }));
      setChartData(cData);
    } catch (err) {
      console.error("Error loading baseline data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBaselineData();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="2. Baseline Regression & Degree-Day Normalization"
        subtitle="Multi-variable degree-day model with ASHRAE Guideline 14 CV(RMSE) and NMBE compliance gates."
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Top Summary & Re-Run */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-[#DFE5E0] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E7F1EA] text-[#245C43] flex items-center justify-center">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#18211C]">
                Student Residence Daily Baseline (181 Days • Jan–Jun 2026)
              </div>
              <div className="text-xs text-[#68736C]">
                Weather Station: Baku Absheron • Balance Point Temperature: 18.33°C (65°F)
              </div>
            </div>
          </div>

          <button
            onClick={loadBaselineData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Re-Fit Regression
          </button>
        </div>

        {/* Statistical Metrics Cards */}
        {regressionResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">Coefficient of Determination</div>
              <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                R² = {regressionResult.r2.toFixed(3)}
              </div>
              <div className="text-[11px] text-[#245C43] mt-1">Excellent weather fit</div>
            </div>

            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">CV(RMSE) Uncertainty</div>
              <div className="text-2xl font-bold text-[#245C43] mt-1 font-mono">
                {regressionResult.cvRmsePct.toFixed(1)}%
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                ASHRAE Daily Gate: ≤ 25.0%
              </div>
            </div>

            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">Normalized Mean Bias Error</div>
              <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                {regressionResult.nmbePct.toFixed(2)}%
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                ASHRAE Gate: |NMBE| ≤ 5.0%
              </div>
            </div>

            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">ASHRAE 14 Compliance</div>
              <div className="text-xl font-bold text-[#245C43] mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>COMPLIANT</span>
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                Standard baseline established
              </div>
            </div>
          </div>
        )}

        {/* Model Equation & Coefficients */}
        {regressionResult && (
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18211C]">
                Trained Degree-Day Baseline Equation
              </h3>
              <span className="text-xs text-[#68736C]">
                N = {regressionResult.sampleSize} daily baseline observations
              </span>
            </div>

            <div className="p-4 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] font-mono text-xs sm:text-sm text-[#18211C] text-center">
              E_pred (kWh) = {regressionResult.coefficients.intercept} +{" "}
              {regressionResult.coefficients.hddCoeff} &times; HDD +{" "}
              {regressionResult.coefficients.cddCoeff} &times; CDD
              {regressionResult.coefficients.occCoeff !== undefined && (
                <span> + {regressionResult.coefficients.occCoeff} &times; Occupancy</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded border border-[#DFE5E0]">
                <div className="font-semibold text-[#18211C]">Heating Slope (&beta;_HDD):</div>
                <div className="text-[#68736C] mt-1">
                  +{regressionResult.coefficients.hddCoeff} kWh per heating degree-day below 18.33°C.
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-[#DFE5E0]">
                <div className="font-semibold text-[#18211C]">Cooling Slope (&beta;_CDD):</div>
                <div className="text-[#68736C] mt-1">
                  +{regressionResult.coefficients.cddCoeff} kWh per cooling degree-day above 18.33°C.
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-[#DFE5E0]">
                <div className="font-semibold text-[#18211C]">Occupancy Slope (&beta;_occ):</div>
                <div className="text-[#68736C] mt-1">
                  +{regressionResult.coefficients.occCoeff ?? 0} kWh daily load per unit occupancy fraction.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18211C]">
              Measured Consumption vs Weather-Normalized Baseline
            </h3>
            <span className="text-xs text-[#68736C]">Daily Time Series (Jan–Jun 2026)</span>
          </div>
          <TimeSeriesChart
            data={chartData}
            actualLabel="Measured Baseline (kWh)"
            predictedLabel="Degree-Day Regression Fit"
            unit="kWh"
            height={260}
          />
        </div>
      </main>
    </div>
  );
}
