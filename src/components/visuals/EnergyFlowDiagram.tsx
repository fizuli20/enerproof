"use client";

import React, { useState } from "react";
import { Zap, Activity, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export function EnergyFlowDiagram() {
  const [activeMode, setActiveMode] = useState<"isolated" | "whole">("isolated");

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Mode Selector */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DB]">
        <div>
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            Building Energy Flow &amp; Measurement Boundaries
          </h4>
          <p className="text-xs text-[#5D6D63]">
            Compare whole-building revenue metering vs IPMVP sub-circuit isolation
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F0] rounded-lg border border-[#DDE3DB]">
          <button
            onClick={() => setActiveMode("isolated")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              activeMode === "isolated"
                ? "bg-[#152E27] text-[#D9FF91] shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Option A/B: Isolated Sub-metering
          </button>
          <button
            onClick={() => setActiveMode("whole")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              activeMode === "whole"
                ? "bg-[#152E27] text-[#D9FF91] shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Option C: Whole-Building Meter
          </button>
        </div>
      </div>

      {/* Diagram SVG */}
      <div className="relative w-full aspect-[16/8] bg-[#101C18] rounded-xl p-4 overflow-hidden border border-white/10 flex items-center justify-center">
        <svg
          viewBox="0 0 760 360"
          className="w-full h-full relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Node 1: Grid Incomer */}
          <rect x="20" y="140" width="110" height="80" rx="8" fill="#152E27" stroke="#3D6B5B" strokeWidth="2" />
          <text x="75" y="175" fill="#D9FF91" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            UTILITY GRID
          </text>
          <text x="75" y="195" fill="#8EA094" fontSize="9" fontFamily="monospace" textAnchor="middle">
            10 kV Feed &bull; 0.125 AZN
          </text>

          {/* Node 2: Main Revenue Meter */}
          <rect x="200" y="130" width="130" height="100" rx="8" fill="#1A382F" stroke={activeMode === "whole" ? "#D9FF91" : "#3D6B5B"} strokeWidth={activeMode === "whole" ? 2.5 : 1.5} />
          <text x="265" y="165" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            MAIN REVENUE METER
          </text>
          <text x="265" y="185" fill="#D9FF91" fontSize="10" fontFamily="monospace" textAnchor="middle">
            300,000 kWh/yr
          </text>
          <text x="265" y="205" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
            {activeMode === "whole" ? "High Weather Variance (CV=14.8%)" : "Total Facility Load"}
          </text>

          {/* Flow 1: Grid to Main Meter */}
          <path d="M 130 180 L 200 180" stroke="#D9FF91" strokeWidth="3" className="animate-energy-flow" />

          {/* Branching from Main Meter to 3 End-Use Boards */}
          {/* Top Branch: Lighting */}
          <path d="M 330 180 L 400 180 L 400 70 L 450 70" stroke={activeMode === "isolated" ? "#D9FF91" : "#487867"} strokeWidth={activeMode === "isolated" ? 3 : 1.5} className={activeMode === "isolated" ? "animate-energy-flow" : ""} />

          {/* Middle Branch: HVAC & Cooling */}
          <path d="M 330 180 L 450 180" stroke={activeMode === "isolated" ? "#D9FF91" : "#487867"} strokeWidth={activeMode === "isolated" ? 3 : 1.5} className={activeMode === "isolated" ? "animate-energy-flow" : ""} />

          {/* Bottom Branch: Plug Loads & Misc */}
          <path d="M 330 180 L 400 180 L 400 290 L 450 290" stroke={activeMode === "isolated" ? "#D9FF91" : "#487867"} strokeWidth={activeMode === "isolated" ? 3 : 1.5} className={activeMode === "isolated" ? "animate-energy-flow" : ""} />

          {/* Node 3A: Lighting Sub-Panel */}
          <rect x="450" y="30" width="160" height="75" rx="6" fill="#152E27" stroke={activeMode === "isolated" ? "#D9FF91" : "#346353"} strokeWidth={activeMode === "isolated" ? 2 : 1} />
          <text x="530" y="60" fill="#D9FF91" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            LIGHTING PANEL
          </text>
          <text x="530" y="78" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
            500 Fixtures &bull; 96,000 kWh/yr
          </text>
          {activeMode === "isolated" && (
            <text x="530" y="93" fill="#D9FF91" fontSize="8" fontFamily="monospace" textAnchor="middle">
              CT Logger Installed (Opt A)
            </text>
          )}

          {/* Node 3B: HVAC Mechanical Feeder */}
          <rect x="450" y="142" width="160" height="75" rx="6" fill="#152E27" stroke={activeMode === "isolated" ? "#D9FF91" : "#346353"} strokeWidth={activeMode === "isolated" ? 2 : 1} />
          <text x="530" y="172" fill="#D9FF91" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            HVAC &amp; CHILLER FEEDER
          </text>
          <text x="530" y="190" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
            120 kW Split Units &bull; 130,000 kWh
          </text>
          {activeMode === "isolated" && (
            <text x="530" y="205" fill="#D9FF91" fontSize="8" fontFamily="monospace" textAnchor="middle">
              Feeder Sub-meter (Opt B)
            </text>
          )}

          {/* Node 3C: Plug Loads & Receptacles */}
          <rect x="450" y="255" width="160" height="75" rx="6" fill="#152E27" stroke="#346353" strokeWidth="1" />
          <text x="530" y="285" fill="#D9FF91" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            RECEPTACLES &amp; MISC
          </text>
          <text x="530" y="303" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Dorm Suites &bull; 74,000 kWh/yr
          </text>
          <text x="530" y="318" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
            Student Plug Loads &bull; Unmonitored
          </text>

          {/* Verification Status Target Box */}
          <rect x="640" y="30" width="100" height="300" rx="8" fill="#0D1A16" stroke={activeMode === "isolated" ? "#D9FF91" : "#9B641B"} strokeWidth="1.5" />
          <text x="690" y="65" fill="#8EA094" fontSize="9" fontFamily="monospace" textAnchor="middle">
            VERIFICATION
          </text>
          <text x="690" y="80" fill="#8EA094" fontSize="9" fontFamily="monospace" textAnchor="middle">
            EVIDENCE
          </text>

          {activeMode === "isolated" ? (
            <g>
              <circle cx="690" cy="140" r="16" fill="#D9FF91" />
              <path d="M 683 140 L 688 145 L 697 134" stroke="#101C18" strokeWidth="2.5" />
              <text x="690" y="180" fill="#D9FF91" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                CLEAN NOISE
              </text>
              <text x="690" y="200" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle">
                FSU &le; 18.4%
              </text>
              <text x="690" y="225" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Evidence Supports
              </text>
              <text x="690" y="240" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Savings Claim
              </text>
            </g>
          ) : (
            <g>
              <circle cx="690" cy="140" r="16" fill="#9B641B" />
              <path d="M 690 132 L 690 144 M 690 148 L 690 150" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="690" y="180" fill="#9B641B" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                HIGH NOISE
              </text>
              <text x="690" y="200" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle">
                FSU &gt; 50%
              </text>
              <text x="690" y="225" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Savings Drowned by
              </text>
              <text x="690" y="240" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Weather &amp; Suitemates
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Plain Language Explanatory Banner */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DB] flex items-center justify-between text-xs text-[#101C18]">
        <div className="flex items-center gap-2">
          {activeMode === "isolated" ? (
            <ShieldCheck className="w-4 h-4 text-[#152E27] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#9B641B] shrink-0" />
          )}
          <span>
            {activeMode === "isolated" ? (
              <strong>Why Sub-metering Works:</strong>
            ) : (
              <strong>The Whole-Building Trap:</strong>
            )}{" "}
            {activeMode === "isolated"
              ? "CT transducers isolate the 60,000 kWh lighting load from uncontrolled student heaters, microwave surges, and weather spikes, allowing 95% confidence verification."
              : "Looking only at the main utility revenue meter means weather drift and semester calendar changes create ±11.8% baseline noise, making a 5–10% saving mathematically undetectable."}
          </span>
        </div>
      </div>
    </div>
  );
}
