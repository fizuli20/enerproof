"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import {
  trainDegreeDayBaseline,
  predictCounterfactual,
  TimeSeriesObservation,
  BaselineRegressionResult,
} from "@/lib/baseline/regression";
import { useProject } from "@/lib/store/project-context";
import {
  LineChart,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";
import Papa from "papaparse";

export default function BaselinePage() {
  const { project, setBaselineResult: setStoreBaselineResult } = useProject();
  const [regressionResult, setRegressionResult] = useState<BaselineRegressionResult | null>(
    project.baselineResult || null
  );
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
      const baselineRows: TimeSeriesObservation[] = [];

      parsed.data.forEach((r) => {
        if (r.phase === "baseline") {
          baselineRows.push({
            date: String(r.date),
            energyKwh: Number(r.electricity_kwh || 0),
            hdd: Number(r.hdd || 0),
            cdd: Number(r.cdd || 0),
            occupancy: Number(r.occupancy_rate || 1.0),
          });
        }
      });

      // Chronological split: 145 training days, 36 independent calibration days
      const trainRows = baselineRows.slice(0, 145);
      const calibRows = baselineRows.slice(145);

      // Train baseline regression model
      const reg = trainDegreeDayBaseline(trainRows, calibRows, "daily");
      setRegressionResult(reg);
      setStoreBaselineResult(reg);

      // Prepare chart data for baseline period
      const predictions = predictCounterfactual(reg.coefficients, baselineRows);
      const cData = baselineRows.map((r, i) => ({
        date: r.date,
        actual: r.energyKwh,
        predicted: Math.round(predictions[i] || 0),
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
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="Baseline Regression & Normalization"
        subtitle="Chronological train-and-calibrate modeling with degree-day weather normalization."
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
        {/* Top Summary & Re-Run */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#DDE3DB] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#152E27] text-[#D9FF91] flex items-center justify-center shrink-0">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#101C18]">
                Student Residence Daily Baseline (181 Days &bull; Jan–Jun 2026)
              </div>
              <div className="text-xs text-[#5D6D63] mt-0.5">
                Weather Station: Baku Absheron &bull; Balance Point: 18.33°C (65°F) &bull; Model: Multi-Variable OLS Degree-Day
              </div>
            </div>
          </div>

          <button
            onClick={loadBaselineData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#152E27] hover:bg-[#101C18] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Re-Fit Regression
          </button>
        </div>

        {/* Chronological Architecture Callout */}
        {regressionResult && (
          <div className="card-editorial p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#152E27]" />
                Chronological Split Architecture
              </span>
              <span className="text-xs font-mono text-[#5D6D63]">
                Total Observations: {regressionResult.trainSampleSize + regressionResult.calibSampleSize} days
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[#F4F5F0] border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">1. In-Sample Training</div>
                <div className="font-mono text-[#152E27] font-bold text-sm mt-0.5">
                  {regressionResult.trainSampleSize} days (Jan 1 – May 25)
                </div>
                <div className="text-[11px] text-[#5D6D63] mt-0.5">Parameter estimation only</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F4F5F0] border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">2. Independent Calibration</div>
                <div className="font-mono text-[#152E27] font-bold text-sm mt-0.5">
                  {regressionResult.calibSampleSize} days (May 26 – Jun 30)
                </div>
                <div className="text-[11px] text-[#5D6D63] mt-0.5">Out-of-sample noise evaluation</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F4F5F0] border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">3. Reporting Window</div>
                <div className="font-mono text-[#101C18] font-bold text-sm mt-0.5">
                  Post-Intervention (Jul 1 – Dec 31)
                </div>
                <div className="text-[11px] text-[#5D6D63] mt-0.5">Counterfactual verification</div>
              </div>
            </div>
          </div>
        )}

        {/* Statistical Metrics Cards */}
        {regressionResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-editorial p-4 bg-white">
              <div className="text-xs text-[#5D6D63] font-medium">Calibration R²</div>
              <div className="text-2xl font-bold text-[#101C18] mt-1 font-mono">
                {(regressionResult.calibrationDiagnostics?.r2 ?? regressionResult.trainingDiagnostics.r2).toFixed(3)}
              </div>
              <div className="text-[11px] text-[#5D6D63] mt-1 font-mono">
                Training R²: {regressionResult.trainingDiagnostics.r2.toFixed(3)}
              </div>
            </div>

            <div className="card-editorial p-4 bg-white">
              <div className="text-xs text-[#5D6D63] font-medium">Calibration CV(RMSE)</div>
              <div className="text-2xl font-bold text-[#152E27] mt-1 font-mono">
                {(regressionResult.calibrationDiagnostics?.cvRmsePct ?? regressionResult.trainingDiagnostics.cvRmsePct).toFixed(1)}%
              </div>
              <div className="text-[11px] text-[#5D6D63] mt-1 font-mono">
                Training CV: {regressionResult.trainingDiagnostics.cvRmsePct.toFixed(1)}% &bull; Gate ≤ 25%
              </div>
            </div>

            <div className="card-editorial p-4 bg-white">
              <div className="text-xs text-[#5D6D63] font-medium">Autocorrelation (r₁)</div>
              <div className="text-2xl font-bold text-[#101C18] mt-1 font-mono">
                {(regressionResult.calibrationDiagnostics?.r1Autocorr ?? 0).toFixed(3)}
              </div>
              <div className="text-[11px] text-[#5D6D63] mt-1">
                Adjusts effective sample size
              </div>
            </div>

            <div className="card-editorial p-4 bg-white">
              <div className="text-xs text-[#5D6D63] font-medium">Screening Diagnostic</div>
              <div
                className={`text-base font-bold mt-1.5 flex items-center gap-1.5 font-mono ${
                  regressionResult.screeningStatus === "MEETS_SCREENING_CRITERIA"
                    ? "text-[#152E27]"
                    : regressionResult.screeningStatus === "BORDERLINE"
                    ? "text-[#9B641B]"
                    : "text-[#B74740]"
                }`}
              >
                {regressionResult.screeningStatus === "MEETS_SCREENING_CRITERIA" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#152E27] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#9B641B] shrink-0" />
                )}
                <span className="text-xs truncate">{regressionResult.screeningStatus}</span>
              </div>
              <div className="text-[11px] text-[#5D6D63] mt-1">
                Transparent screening gate
              </div>
            </div>
          </div>
        )}

        {/* Model Equation & Coefficients */}
        {regressionResult && (
          <div className="card-editorial p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-[#101C18]">
                Trained Degree-Day Baseline Equation
              </h3>
              <span className="text-xs font-mono text-[#5D6D63]">
                N = {regressionResult.trainSampleSize} training observations
              </span>
            </div>

            <div className="p-4 bg-[#F4F5F0] rounded-lg border border-[#DDE3DB] font-mono text-xs sm:text-sm text-[#101C18] text-center font-bold">
              E_pred (kWh) = {regressionResult.coefficients.intercept} +{" "}
              {regressionResult.coefficients.hddCoeff} &times; HDD +{" "}
              {regressionResult.coefficients.cddCoeff} &times; CDD
              {regressionResult.coefficients.occCoeff !== null && (
                <span> + {regressionResult.coefficients.occCoeff} &times; Occupancy</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">Heating Slope (&beta;_HDD):</div>
                <div className="text-[#5D6D63] mt-1">
                  +{regressionResult.coefficients.hddCoeff} kWh per heating degree-day below 18.33°C.
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">Cooling Slope (&beta;_CDD):</div>
                <div className="text-[#5D6D63] mt-1">
                  +{regressionResult.coefficients.cddCoeff} kWh per cooling degree-day above 18.33°C.
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#DDE3DB]">
                <div className="font-semibold text-[#101C18]">Occupancy Slope (&beta;_occ):</div>
                <div className="text-[#5D6D63] mt-1">
                  +{regressionResult.coefficients.occCoeff ?? 0} kWh daily load per unit occupancy fraction.
                </div>
              </div>
            </div>

            {/* Screening Notes Callout */}
            {regressionResult.screeningNotes && regressionResult.screeningNotes.length > 0 && (
              <div className="p-3.5 rounded-lg bg-[#F4F5F0] border border-[#DDE3DB] text-xs space-y-1">
                <span className="font-semibold text-[#101C18] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#152E27]" />
                  Diagnostic Screening Observations:
                </span>
                <ul className="list-disc list-inside text-[#5D6D63] space-y-0.5">
                  {regressionResult.screeningNotes.map((note: string, idx: number) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Interactive Chart */}
        <div className="card-editorial p-6 bg-white space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DB]">
            <h3 className="text-sm font-bold font-display text-[#101C18]">
              Measured Consumption vs Weather-Normalized Baseline
            </h3>
            <span className="text-xs font-mono text-[#5D6D63]">Daily Time Series (Jan–Jun 2026)</span>
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
