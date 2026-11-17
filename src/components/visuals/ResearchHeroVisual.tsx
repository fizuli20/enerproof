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
            Repeated synthetic null draws prove that an isolated single building cannot detect 5% savings at 80% power from whole-building meters alone.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto font-mono text-xs">
          <div className="p-3.5 bg-[#152E27] rounded-xl border border-white/10 space-y-1">
            <span className="text-[#A3B8AC] text-[10px] block">Hourly MDE</span>
            <span className="text-lg font-bold text-[#FFFFFF] block">4.2%</span>
            <span className="text-[10px] text-[#B74740] block">FPR &gt; 5% (Fails Gate)</span>
          </div>

          <div className="p-3.5 bg-[#152E27] rounded-xl border border-[#D9FF91]/40 space-y-1 ring-1 ring-[#D9FF91]/30">
            <span className="text-[#D9FF91] text-[10px] block">Daily MDE</span>
            <span className="text-lg font-bold text-[#D9FF91] block">5.1%</span>
            <span className="text-[10px] text-[#D9FF91] block">4.21% FPR (Passes Gate)</span>
          </div>

          <div className="p-3.5 bg-[#152E27] rounded-xl border border-white/10 space-y-1">
            <span className="text-[#A3B8AC] text-[10px] block">Monthly MDE</span>
            <span className="text-lg font-bold text-[#FFFFFF] block">10.5%</span>
            <span className="text-[10px] text-[#B74740] block">Too coarse for operational ECMs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
