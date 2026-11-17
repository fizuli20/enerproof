"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, XCircle } from "lucide-react";

export function EvidenceGateVisual() {
  const [scenario, setScenario] = useState<"pass" | "refusal_short" | "refusal_duplicate">("pass");

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE3DB]">
        <div>
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            The Deterministic Evidence Gate Architecture
          </h4>
          <p className="text-xs text-[#5D6D63]">
            Every savings claim must pass three sequential quality gates before verification.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F0] rounded-lg border border-[#DDE3DB] text-xs">
          <button
            onClick={() => setScenario("pass")}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              scenario === "pass"
                ? "bg-[#152E27] text-[#D9FF91] shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Scenario 1: Verified Isolation
          </button>
          <button
            onClick={() => setScenario("refusal_short")}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              scenario === "refusal_short"
                ? "bg-[#9B641B] text-white shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Scenario 2: High Uncertainty (FSU &gt; 50%)
          </button>
          <button
            onClick={() => setScenario("refusal_duplicate")}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              scenario === "refusal_duplicate"
                ? "bg-[#B74740] text-white shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Scenario 3: Flawed Data (BHOS Case)
          </button>
        </div>
      </div>

      {/* 3 Sequential Decision Gates Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* GATE 1: DATA INTEGRITY */}
        <div
          className={`p-5 rounded-2xl border transition-all space-y-3 ${
            scenario === "refusal_duplicate"
              ? "bg-[#FEE2E2]/60 border-[#B74740] ring-2 ring-[#B74740]"
              : "bg-white border-[#DDE3DB]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#152E27] text-[#D9FF91]">
              Gate 01
            </span>
            {scenario === "refusal_duplicate" ? (
              <XCircle className="w-5 h-5 text-[#B74740]" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#152E27]" />
            )}
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-[#101C18]">1. Is the Data Reliable?</h5>
            <p className="text-xs text-[#5D6D63] mt-1 leading-relaxed">
              Screens raw meter records for missing blocks, negative readings, 100% duplicate annual profiles, and GHG arithmetic errors.
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDE3DB] font-mono text-[11px]">
            {scenario === "refusal_duplicate" ? (
              <span className="text-[#B74740] font-bold">REJECTED: Duplicate 2023–2024 profile</span>
            ) : (
              <span className="text-[#152E27] font-semibold">PASSED: Clean time-series</span>
            )}
          </div>
        </div>

        {/* GATE 2: MEASUREMENT SUITABILITY */}
        <div
          className={`p-5 rounded-2xl border transition-all space-y-3 ${
            scenario === "refusal_short"
              ? "bg-[#FEF3C7]/60 border-[#9B641B] ring-2 ring-[#9B641B]"
              : "bg-white border-[#DDE3DB]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#152E27] text-[#D9FF91]">
              Gate 02
            </span>
            {scenario === "refusal_short" ? (
              <AlertTriangle className="w-5 h-5 text-[#9B641B]" />
            ) : scenario === "refusal_duplicate" ? (
              <span className="text-xs font-mono text-[#5D6D63]">Halted</span>
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#152E27]" />
            )}
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-[#101C18]">2. Is Measurement Appropriate?</h5>
            <p className="text-xs text-[#5D6D63] mt-1 leading-relaxed">
              Verifies if the savings clear the whole-facility noise threshold (&ge; 11.8%) or if dedicated sub-meter circuit isolation (Option A/B) is deployed.
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDE3DB] font-mono text-[11px]">
            {scenario === "refusal_short" ? (
              <span className="text-[#9B641B] font-bold">WARNING: 14-day window too short</span>
            ) : scenario === "refusal_duplicate" ? (
              <span className="text-[#5D6D63]">Gate bypassed due to Gate 1 failure</span>
            ) : (
              <span className="text-[#152E27] font-semibold">PASSED: Isolated lighting circuit</span>
            )}
          </div>
        </div>

        {/* GATE 3: ASHRAE 14 UNCERTAINTY */}
        <div
          className={`p-5 rounded-2xl border transition-all space-y-3 ${
            scenario === "pass"
              ? "bg-[#D9FF91]/15 border-[#152E27] ring-2 ring-[#152E27]"
              : "bg-white border-[#DDE3DB]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#152E27] text-[#D9FF91]">
              Gate 03
            </span>
            {scenario === "pass" ? (
              <CheckCircle2 className="w-5 h-5 text-[#152E27]" />
            ) : (
              <span className="text-xs font-mono text-[#5D6D63]">Unmet</span>
            )}
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-[#101C18]">3. Does Evidence Support Estimate?</h5>
            <p className="text-xs text-[#5D6D63] mt-1 leading-relaxed">
              Calculates Fractional Savings Uncertainty (FSU) under ASHRAE Guideline 14 Annex B at 95% nominal confidence. Must be &le; 50%.
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDE3DB] font-mono text-[11px]">
            {scenario === "pass" ? (
              <span className="text-[#152E27] font-bold">CONFIRMED: FSU = 18.4% (&le; 50%)</span>
            ) : scenario === "refusal_short" ? (
              <span className="text-[#9B641B] font-bold">EXCEEDED: FSU = 64.2% (&gt; 50%)</span>
            ) : (
              <span className="text-[#5D6D63]">Evaluation halted</span>
            )}
          </div>
        </div>
      </div>

      {/* Result Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          scenario === "pass"
            ? "bg-[#D9FF91]/10 border-[#152E27]"
            : scenario === "refusal_short"
            ? "bg-[#FEF3C7]/40 border-[#9B641B]"
            : "bg-[#FEE2E2]/40 border-[#B74740]"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                scenario === "pass"
                  ? "bg-[#152E27] text-[#D9FF91]"
                  : scenario === "refusal_short"
                  ? "bg-[#9B641B] text-white"
                  : "bg-[#B74740] text-white"
              }`}
            >
              {scenario === "pass" && "EVIDENCE_SUPPORTS_ESTIMATE"}
              {scenario === "refusal_short" && "ADDITIONAL_MEASUREMENT_REQUIRED"}
              {scenario === "refusal_duplicate" && "DATA_INTEGRITY_REFUSAL"}
            </span>
            <span className="text-xs text-[#5D6D63]">Deterministic Classification</span>
          </div>

          <h3 className="font-display font-bold text-lg text-[#101C18]">
            {scenario === "pass" && "The available evidence supports this savings estimate."}
            {scenario === "refusal_short" && "Additional measurements recommended before relying on this estimate."}
            {scenario === "refusal_duplicate" && "Data quality audit failed: baseline modeling refused."}
          </h3>

          <p className="text-xs text-[#5D6D63] leading-relaxed max-w-2xl">
            {scenario === "pass" &&
              "Physical fixture ratings are verified within plausible engineering bounds and dedicated circuit isolation removes whole-building weather noise."}
            {scenario === "refusal_short" &&
              "The 14-day monitoring duration is too brief to rule out random weather drift under ASHRAE 14 criteria. Extend monitoring to 30 continuous days."}
            {scenario === "refusal_duplicate" &&
              "Identical duplicate calendar profiles or arithmetic discrepancies detected in energy disclosures. Clean utility source records required."}
          </p>
        </div>

        <div className="shrink-0 font-mono text-xs text-right">
          <div className="text-[#5D6D63]">Prescribed Next Action:</div>
          <div className="font-bold text-[#101C18] mt-0.5">
            {scenario === "pass" && "Export Verification Report"}
            {scenario === "refusal_short" && "Extend Logging by 16 Days"}
            {scenario === "refusal_duplicate" && "Resolve Meter Provenance"}
          </div>
        </div>
      </div>
    </div>
  );
}
