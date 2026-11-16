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
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="2. Baseline Regression & Degree-Day Normalization"
        subtitle="Multi-variable degree-day model with strict chronological TRAIN → CALIBRATE → REPORT separation."
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
                Weather Station: Baku Absheron • Balance Point: 18.33°C (65°F) • Model: Multi-Variable OLS Degree-Day
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

        {/* Chronological Architecture Callout */}
        {regressionResult && (
          <div className="p-4 rounded-lg bg-white border border-[#DFE5E0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#245C43] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Chronological Split Architecture
              </span>
              <span className="text-[11px] font-mono text-[#68736C]">
                Total Observations: {regressionResult.trainSampleSize + regressionResult.calibSampleSize} days
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#F8F9F7] border border-[#DFE5E0]">
                <div className="font-semibold text-[#18211C]">1. In-Sample Training</div>
                <div className="font-mono text-[#245C43] font-bold mt-0.5">
                  {regressionResult.trainSampleSize} days (Jan 1 – May 25)
                </div>
                <div className="text-[11px] text-[#68736C] mt-0.5">Parameter estimation only</div>
              </div>
              <div className="p-2.5 rounded bg-[#F8F9F7] border border-[#DFE5E0]">
                <div className="font-semibold text-[#18211C]">2. Independent Calibration</div>
                <div className="font-mono text-[#245C43] font-bold mt-0.5">
                  {regressionResult.calibSampleSize} days (May 26 – Jun 30)
                </div>
                <div className="text-[11px] text-[#68736C] mt-0.5">Out-of-sample noise evaluation</div>
              </div>
              <div className="p-2.5 rounded bg-[#F8F9F7] border border-[#DFE5E0]">
                <div className="font-semibold text-[#18211C]">3. Reporting Window</div>
                <div className="font-mono text-[#18211C] font-bold mt-0.5">
                  Post-Intervention (Jul 1 – Dec 31)
                </div>
                <div className="text-[11px] text-[#68736C] mt-0.5">Counterfactual verification</div>
              </div>
            </div>
          </div>
        )}

        {/* Statistical Metrics Cards */}
        {regressionResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">Calibration R²</div>
              <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                {(regressionResult.calibrationDiagnostics?.r2 ?? regressionResult.trainingDiagnostics.r2).toFixed(3)}
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                Training R²: {regressionResult.trainingDiagnostics.r2.toFixed(3)}
              </div>
            </div>

            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">Calibration CV(RMSE)</div>
              <div className="text-2xl font-bold text-[#245C43] mt-1 font-mono">
                {(regressionResult.calibrationDiagnostics?.cvRmsePct ?? regressionResult.trainingDiagnostics.cvRmsePct).toFixed(1)}%
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                Training CV: {regressionResult.trainingDiagnostics.cvRmsePct.toFixed(1)}% • Gate ≤ 25%
              </div>
            </div>

            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">Residual Autocorrelation (r₁)</div>
              <div className="text-2xl font-bold text-[#18211C] mt-1 font-mono">
                {(regressionResult.calibrationDiagnostics?.r1Autocorr ?? 0).toFixed(3)}
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                Adjusts effective sample size
              </div>
            </div>

            <div className="card-base p-4">
              <div className="text-xs text-[#68736C]">Screening Diagnostic</div>
              <div
                className={`text-xl font-bold mt-1 flex items-center gap-1.5 ${
                  regressionResult.screeningStatus === "MEETS_SCREENING_CRITERIA"
                    ? "text-[#245C43]"
                    : regressionResult.screeningStatus === "BORDERLINE"
                    ? "text-[#A66A16]"
                    : "text-[#B74740]"
                }`}
              >
                {regressionResult.screeningStatus === "MEETS_SCREENING_CRITERIA" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span className="text-sm">{regressionResult.screeningStatus}</span>
              </div>
              <div className="text-[11px] text-[#68736C] mt-1">
                Transparent screening gate
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
                N = {regressionResult.trainSampleSize} training observations
              </span>
            </div>

            <div className="p-4 bg-[#F8F9F7] rounded-lg border border-[#DFE5E0] font-mono text-xs sm:text-sm text-[#18211C] text-center">
              E_pred (kWh) = {regressionResult.coefficients.intercept} +{" "}
              {regressionResult.coefficients.hddCoeff} &times; HDD +{" "}
              {regressionResult.coefficients.cddCoeff} &times; CDD
              {regressionResult.coefficients.occCoeff !== null && (
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

            {/* Screening Notes Callout */}
            {regressionResult.screeningNotes && regressionResult.screeningNotes.length > 0 && (
              <div className="p-3 rounded bg-[#F8F9F7] border border-[#DFE5E0] text-xs space-y-1">
                <span className="font-semibold text-[#18211C]">Diagnostic Screening Observations:</span>
                <ul className="list-disc list-inside text-[#68736C] space-y-0.5">
                  {regressionResult.screeningNotes.map((note: string, idx: number) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
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
