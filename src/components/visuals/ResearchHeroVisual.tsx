"use client";

import React from "react";
import { Database, ShieldCheck, BarChart3, AlertTriangle } from "lucide-react";

export function ResearchHeroVisual() {
  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#DDE3DB]">
        <div>
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            Building Data Genome 2 (BDG2) Empirical Cohort Benchmark
          </h4>
          <p className="text-xs text-[#5D6D63]">
            152 commercial and higher-education buildings evaluated across 2 years of interval telemetry
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#152E27] text-[#D9FF91]">
          Sample: N = 152 Facilities
        </span>
      </div>

      {/* Hero Visual Distribution Card */}
      <div className="p-6 rounded-2xl bg-[#101C18] border border-white/10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-mono font-semibold">
            <Database className="w-3.5 h-3.5" />
            Empirical Noise Floor
          </span>
          <h3 className="font-display font-bold text-xl text-white">
            Single-Building Detection Limits
          </h3>
          <p className="text-xs text-[#A3B8AC] leading-relaxed">
            Repeated synthetic null draws and historical placebos prove that single buildings cannot detect 5% savings at 80% power from whole-building meters alone; historical placebos exhibit 18.2%–28.7% operational drift.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto font-mono text-xs">
          <div className="p-3.5 bg-[#152E27] rounded-xl border border-white/10 space-y-1">
            <span className="text-[#A3B8AC] text-[10px] block">Hourly Interval</span>
            <span className="text-lg font-bold text-[#FFFFFF] block">8.4% Floor</span>
            <span className="text-[10px] text-[#B74740] block">Placebo FAR 28.7% (Unestablished)</span>
          </div>

          <div className="p-3.5 bg-[#152E27] rounded-xl border border-[#D9FF91]/30 space-y-1">
            <span className="text-[#D9FF91] text-[10px] block">Daily Interval</span>
            <span className="text-lg font-bold text-[#D9FF91] block">15.0% MDE</span>
            <span className="text-[10px] text-[#FDE68A] block">Synth 4.2% • Placebo 22.4% (Partial)</span>
          </div>

          <div className="p-3.5 bg-[#152E27] rounded-xl border border-white/10 space-y-1">
            <span className="text-[#A3B8AC] text-[10px] block">Monthly Utility Bill</span>
            <span className="text-lg font-bold text-[#FFFFFF] block">13.6% Floor</span>
            <span className="text-[10px] text-[#B74740] block">Placebo FAR 18.2% (n&lt;12 Unestablished)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
