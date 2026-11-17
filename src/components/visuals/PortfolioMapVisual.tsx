"use client";

import React, { useState } from "react";
import { Building2, CloudSun, ShieldCheck, Activity, ArrowRight } from "lucide-react";

export function PortfolioMapVisual() {
  const [modelType, setModelType] = useState<"empirical" | "naive">("empirical");

  const buildings = [
    { id: "b1", name: "Student Residence 1", kwh: "300 MWh", savings: "45 MWh (15.0%)", x: 120, y: 140 },
    { id: "b2", name: "Academic Wing A", kwh: "520 MWh", savings: "68 MWh (13.1%)", x: 280, y: 80 },
    { id: "b3", name: "Engineering Lab", kwh: "440 MWh", savings: "52 MWh (11.8%)", x: 440, y: 160 },
    { id: "b4", name: "Campus Library", kwh: "210 MWh", savings: "28 MWh (13.3%)", x: 600, y: 90 },
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#DDE3DB]">
        <div>
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            Multi-Building Campus Portfolio Risk &amp; Residual Correlation
          </h4>
          <p className="text-xs text-[#5D6D63]">
            Illustrative simulation of cross-building correlation (&rho; &asymp; 0.33) modeling shared weather shocks. Arbitrary user portfolios require empirical covariance matrices or return UNESTABLISHED.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F0] rounded-lg border border-[#DDE3DB] text-xs">
          <button
            onClick={() => setModelType("empirical")}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              modelType === "empirical"
                ? "bg-[#152E27] text-[#D9FF91] shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Illustrative Model (&rho; = 0.33)
          </button>
          <button
            onClick={() => setModelType("naive")}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              modelType === "naive"
                ? "bg-[#9B641B] text-white shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Naive Independence (1/&radic;K)
          </button>
        </div>
      </div>

      {/* SVG Campus Map Graphic */}
      <div className="relative w-full aspect-[16/7] bg-[#101C18] rounded-xl p-4 overflow-hidden border border-white/10 flex items-center justify-center">
        <svg viewBox="0 0 740 260" className="w-full h-full relative z-10" fill="none">
          {/* Shared Weather Station Node (Absheron Baku) */}
          <g transform="translate(370, 40)">
            <circle cx="0" cy="0" r="22" fill="#152E27" stroke="#D9FF91" strokeWidth="1.5" />
            <CloudSun className="w-5 h-5 text-[#D9FF91] -translate-x-2.5 -translate-y-2.5" />
            <text x="0" y="32" fill="#D9FF91" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              SHARED WEATHER STATION
            </text>
            <text x="0" y="44" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
              Baku Absheron &bull; 18.33°C Base
            </text>
          </g>

          {/* Correlation Lines connecting Weather to all 4 buildings */}
          {buildings.map((b) => (
            <path
              key={`w-${b.id}`}
              d={`M 370 40 L ${b.x} ${b.y}`}
              stroke="#D9FF91"
              strokeWidth={modelType === "empirical" ? "1.5" : "0.5"}
              strokeDasharray={modelType === "empirical" ? "4 4" : "2 2"}
              opacity={modelType === "empirical" ? 0.8 : 0.2}
              className={modelType === "empirical" ? "animate-energy-flow" : ""}
            />
          ))}

          {/* Intra-building Correlation Cross-Ties (rho=0.33) */}
          {modelType === "empirical" && (
            <g opacity="0.4">
              <line x1="120" y1="140" x2="280" y2="80" stroke="#D9FF91" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="280" y1="80" x2="440" y2="160" stroke="#D9FF91" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="440" y1="160" x2="600" y2="90" stroke="#D9FF91" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          )}

          {/* 4 Building Nodes */}
          {buildings.map((b) => (
            <g key={b.id} transform={`translate(${b.x}, ${b.y})`}>
              <rect x="-45" y="-30" width="90" height="60" rx="6" fill="#152E27" stroke="#3D6B5B" strokeWidth="1.5" />
              <rect x="-40" y="-25" width="80" height="8" rx="2" fill="#0D1F1A" />
              {/* Windows grid */}
              <circle cx="-25" cy="-5" r="2.5" fill="#D9FF91" />
              <circle cx="-10" cy="-5" r="2.5" fill="#D9FF91" />
              <circle cx="10" cy="-5" r="2.5" fill="#D9FF91" />
              <circle cx="25" cy="-5" r="2.5" fill="#D9FF91" />
              <circle cx="-25" cy="10" r="2.5" fill="#D9FF91" />
              <circle cx="-10" cy="10" r="2.5" fill="#D9FF91" />
              <circle cx="10" cy="10" r="2.5" fill="#D9FF91" />
              <circle cx="25" cy="10" r="2.5" fill="#D9FF91" />

              <text x="0" y="42" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {b.name}
              </text>
              <text x="0" y="54" fill="#D9FF91" fontSize="8" fontFamily="monospace" textAnchor="middle">
                {b.savings}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Metrics Badge in Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-[#0D1A16]/90 backdrop-blur-md p-2.5 rounded-lg border border-white/10 text-xs font-mono">
          <div className="text-[10px] text-[#8EA094]">
            {modelType === "empirical" ? "Illustrative Microclimate Model (BDG2 Simulation)" : "Naive Independent Model"}
          </div>
          <div className="text-[#D9FF91] font-bold mt-0.5">
            {modelType === "empirical" ? "Illustrative Correlation: ρ = 0.33 (Theoretical Floor)" : "Assumed Independence: ρ = 0.0 (Unrealistic)"}
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DB] text-xs text-[#101C18] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#152E27] shrink-0" />
          <span>
            {modelType === "empirical"
              ? "Illustrative Model: Same-campus facilities share microclimates and schedules, so portfolio variance asymptotes to σ√ρ rather than zero. Custom user portfolios require empirical covariance Σ or return UNESTABLISHED."
              : "Assuming buildings are independent artificially understates financial risk for performance contracts and the Energy Efficiency Fund."}
          </span>
        </div>
      </div>
    </div>
  );
}
