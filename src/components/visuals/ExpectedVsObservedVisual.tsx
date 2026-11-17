"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Layers, TrendingDown, ArrowDownRight } from "lucide-react";

export function ExpectedVsObservedVisual() {
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(3);

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* 3 Tier Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTier(1)}
          className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
            activeTier === 1
              ? "border-[#152E27] bg-[#152E27] text-white shadow-md"
              : "border-[#DDE3DB] bg-white text-[#101C18] hover:border-[#152E27]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${activeTier === 1 ? "text-[#D9FF91]" : "text-[#5D6D63]"}`}>
              Tier 1
            </span>
            <span className="text-[11px] font-mono font-bold">60,000 kWh/yr</span>
          </div>
          <div className="font-display font-bold text-sm">Engineering Estimate</div>
          <p className={`text-xs ${activeTier === 1 ? "text-[#A3B8AC]" : "text-[#5D6D63]"}`}>
            Theoretical model based on physical fixture counts and rated wattage delta (40W).
          </p>
        </button>

        <button
          onClick={() => setActiveTier(2)}
          className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
            activeTier === 2
              ? "border-[#9B641B] bg-[#9B641B] text-white shadow-md"
              : "border-[#DDE3DB] bg-white text-[#101C18] hover:border-[#9B641B]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${activeTier === 2 ? "text-[#FEF3C7]" : "text-[#9B641B]"}`}>
              Tier 2 (Unadjusted)
            </span>
            <span className="text-[11px] font-mono font-bold">42,000 kWh/yr</span>
          </div>
          <div className="font-display font-bold text-sm">Observed Meter Delta</div>
          <p className={`text-xs ${activeTier === 2 ? "text-[#FEF3C7]" : "text-[#5D6D63]"}`}>
            Raw bill difference without weather adjustment. Confounded by an unseasonably cold winter.
          </p>
        </button>

        <button
          onClick={() => setActiveTier(3)}
          className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
            activeTier === 3
              ? "border-[#152E27] bg-[#152E27] text-white shadow-md"
              : "border-[#DDE3DB] bg-white text-[#101C18] hover:border-[#152E27]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${activeTier === 3 ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
              Tier 3 (Verified)
            </span>
            <span className={`text-[11px] font-mono font-bold ${activeTier === 3 ? "text-[#D9FF91]" : "text-[#152E27]"}`}>
              54,600 &plusmn; 8% kWh
            </span>
          </div>
          <div className="font-display font-bold text-sm">Evidence-Supported Verdict</div>
          <p className={`text-xs ${activeTier === 3 ? "text-[#A3B8AC]" : "text-[#5D6D63]"}`}>
            Degree-day weather normalized counterfactual minus measured sub-meter intervals under ASHRAE 14.
          </p>
        </button>
      </div>

      {/* Visual Chart Comparison */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDE3DB] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DB]">
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            {activeTier === 1 && "Tier 1: Theoretical Engineering Calculation"}
            {activeTier === 2 && "Tier 2: Confounded Raw Bill Delta (Why Simple Subtraction Fails)"}
            {activeTier === 3 && "Tier 3: Weather-Normalized Counterfactual with Uncertainty Cone"}
          </h4>
          <span className="text-xs font-mono text-[#5D6D63]">Daily kWh Profile</span>
        </div>

        {/* SVG Profile Chart */}
        <div className="relative w-full aspect-[16/7] bg-[#F4F5F0] rounded-xl p-4 overflow-hidden border border-[#DDE3DB] flex items-center justify-center">
          <svg viewBox="0 0 720 260" className="w-full h-full" fill="none">
            {/* Axis Lines */}
            <line x1="50" y1="210" x2="680" y2="210" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="50" y1="30" x2="50" y2="210" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Y Axis Labels */}
            <text x="40" y="40" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">1,200</text>
            <text x="40" y="95" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">900</text>
            <text x="40" y="150" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">600</text>
            <text x="40" y="205" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">0</text>

            {/* X Axis Labels */}
            <text x="120" y="228" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">Jan</text>
            <text x="240" y="228" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">Apr</text>
            <text x="360" y="228" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">Jul (Retrofit)</text>
            <text x="480" y="228" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">Oct</text>
            <text x="600" y="228" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">Dec</text>

            {/* Intervention Date Vertical Marker */}
            <line x1="360" y1="30" x2="360" y2="210" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="365" y="45" fill="#152E27" fontSize="9" fontFamily="monospace" fontWeight="bold">Retrofit Date</text>

            {/* Baseline Curve (Jan - Jun) */}
            <path
              d="M 50 120 Q 120 160 200 130 T 360 110"
              stroke="#152E27"
              strokeWidth="2.5"
              fill="none"
            />

            {/* Counterfactual Expected Baseline (Jul - Dec) */}
            <path
              d="M 360 110 Q 440 90 520 100 T 680 85"
              stroke="#152E27"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
            />
            <text x="620" y="75" fill="#152E27" fontSize="8" fontFamily="monospace">Expected Baseline</text>

            {/* Uncertainty Cone for Tier 3 */}
            {activeTier === 3 && (
              <polygon
                points="360,110 440,75 520,85 680,70 680,100 520,115 440,105"
                fill="#D9FF91"
                fillOpacity="0.3"
              />
            )}

            {/* Actual Observed Consumption (Jul - Dec) */}
            <path
              d="M 360 110 Q 440 145 520 155 T 680 140"
              stroke={activeTier === 2 ? "#9B641B" : "#152E27"}
              strokeWidth="2.5"
              fill="none"
            />
            <text x="620" y="155" fill={activeTier === 2 ? "#9B641B" : "#152E27"} fontSize="8" fontFamily="monospace" fontWeight="bold">
              Actual Metered
            </text>

            {/* Delta Savings Shading */}
            <polygon
              points="360,110 440,90 520,100 680,85 680,140 520,155 440,145"
              fill={activeTier === 3 ? "#152E27" : "#CBD5E1"}
              fillOpacity={activeTier === 3 ? "0.15" : "0.2"}
            />

            {/* Savings Callout Bracket */}
            <line x1="560" y1="95" x2="560" y2="150" stroke="#152E27" strokeWidth="1.5" />
            <text x="570" y="125" fill="#152E27" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {activeTier === 3 ? "Verified Delta" : "Raw Delta"}
            </text>
          </svg>
        </div>

        {/* Dynamic Explanation Note */}
        <div className="p-3.5 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] text-xs text-[#101C18] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#152E27] shrink-0" />
            <span>
              {activeTier === 1 && "Theoretical models assume ideal standard test conditions. Real buildings experience occupancy drift and voltage sags."}
              {activeTier === 2 && "Raw utility bill drops give false impressions: a colder winter increases heating load, disguising true lighting reductions if weather normalization is omitted."}
              {activeTier === 3 && "By training an in-sample degree-day model and evaluating out-of-sample calibration noise, EnerProof proves the 54,600 kWh savings clear statistical noise with 95% confidence."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
