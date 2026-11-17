"use client";

import React, { useState } from "react";
import { Lightbulb, Fan, Power, Activity, CheckCircle2, ArrowRight } from "lucide-react";

export type BuildingSystem = "lighting" | "hvac" | "equipment" | "metering";

interface BuildingCutawayProps {
  initialSystem?: BuildingSystem;
  onSystemSelect?: (system: BuildingSystem) => void;
  compact?: boolean;
}

export function BuildingCutaway({
  initialSystem = "lighting",
  onSystemSelect,
  compact = false,
}: BuildingCutawayProps) {
  const [selectedSystem, setSelectedSystem] = useState<BuildingSystem>(initialSystem);

  const handleSelect = (system: BuildingSystem) => {
    setSelectedSystem(system);
    if (onSystemSelect) onSystemSelect(system);
  };

  const systemsData = {
    lighting: {
      name: "Common Area & Corridor Lighting",
      badge: "60,000 kWh/yr savings",
      tagline: "Replace 64W dual T8 fluorescent with 24W sensor-driven LEDs",
      kwh: "60,000",
      pct: "-62.5%",
      costSavings: "7,500 AZN/yr",
      payback: "2.7 years",
      measurement: "IPMVP Option A: 15-minute circuit runtime logging for 30 days",
      zones: ["Corridor 1", "Corridor 2", "Study Hall", "Lobby"],
    },
    hvac: {
      name: "Heating & Cooling Scheduling",
      badge: "54,600 kWh/yr savings",
      tagline: "Night setbacks and holiday shutoff on 120 kW split-unit cooling",
      kwh: "54,600",
      pct: "-18.2%",
      costSavings: "6,825 AZN/yr",
      payback: "0.9 years",
      measurement: "IPMVP Option B: Dedicated chiller/AC feeder sub-metering",
      zones: ["Dorm Wing North", "Dorm Wing South", "Central Core"],
    },
    equipment: {
      name: "Standby Plug Load Cutoffs",
      badge: "18,000 kWh/yr savings",
      tagline: "Automated timer switches for computer labs and communal appliances",
      kwh: "18,000",
      pct: "-6.0%",
      costSavings: "2,250 AZN/yr",
      payback: "3.3 years",
      measurement: "IPMVP Option A: Receptacle branch power sample logging",
      zones: ["Computer Lab", "Student Kitchen", "Laundry"],
    },
    metering: {
      name: "Continuous Sub-meter Telemetry",
      badge: "Measurement Foundation",
      tagline: "Dedicated current transducers isolating ECM circuits from weather noise",
      kwh: "Verified",
      pct: "100%",
      costSavings: "Enables Performance Guarantees",
      payback: "Prerequisite",
      measurement: "Split-core CT transducers logging at 15-min intervals to cloud/local CSV",
      zones: ["Main Switchboard", "Lighting Panel", "HVAC Feeder"],
    },
  };

  const current = systemsData[selectedSystem];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* System Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#101C18]/60 backdrop-blur-md rounded-xl border border-white/10">
        <button
          onClick={() => handleSelect("lighting")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedSystem === "lighting"
              ? "bg-[#D9FF91] text-[#101C18] font-semibold shadow-sm"
              : "text-[#A3B8AC] hover:text-white"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Lighting</span>
        </button>

        <button
          onClick={() => handleSelect("hvac")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedSystem === "hvac"
              ? "bg-[#D9FF91] text-[#101C18] font-semibold shadow-sm"
              : "text-[#A3B8AC] hover:text-white"
          }`}
        >
          <Fan className="w-3.5 h-3.5" />
          <span>HVAC & Cooling</span>
        </button>

        <button
          onClick={() => handleSelect("equipment")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedSystem === "equipment"
              ? "bg-[#D9FF91] text-[#101C18] font-semibold shadow-sm"
              : "text-[#A3B8AC] hover:text-white"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>Plug Loads</span>
        </button>

        <button
          onClick={() => handleSelect("metering")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedSystem === "metering"
              ? "bg-[#D9FF91] text-[#101C18] font-semibold shadow-sm"
              : "text-[#A3B8AC] hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Sub-metering</span>
        </button>
      </div>

      {/* Architectural Cutaway SVG */}
      <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-[#132822] via-[#0E1F1A] to-[#0A1613] rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-4 flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(217, 255, 145, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(217, 255, 145, 0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <svg
          viewBox="0 0 800 500"
          className="w-full h-full relative z-10 transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E3F35" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#152E27" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="limeGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D9FF91" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D9FF91" stopOpacity="0.1" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Foundation & Ground Plane */}
          <rect x="60" y="440" width="680" height="12" rx="4" fill="#1A332B" stroke="#2D5447" strokeWidth="1" />
          <line x1="40" y1="440" x2="760" y2="440" stroke="#3D6B5B" strokeWidth="1.5" strokeDasharray="6 4" />

          {/* Building Outer Shell */}
          <rect
            x="120"
            y="70"
            width="560"
            height="370"
            rx="8"
            fill="url(#wallGrad)"
            stroke="#346353"
            strokeWidth="2"
          />

          {/* Rooftop Plant & Solar Array */}
          <rect x="150" y="42" width="220" height="28" rx="4" fill="#142C25" stroke="#3A6A59" strokeWidth="1.5" />
          <path d="M 160 56 L 220 56 M 230 56 L 290 56 M 300 56 L 360 56" stroke="#D9FF91" strokeWidth="1.5" opacity="0.6" />
          <text x="260" y="34" fill="#8EA094" fontSize="10" fontFamily="monospace" textAnchor="middle">
            ROOFTOP HVAC &amp; SOLAR PRE-HEAT
          </text>

          {/* Floor Dividers */}
          {/* Level 3 */}
          <line x1="120" y1="160" x2="680" y2="160" stroke="#2D5447" strokeWidth="3" />
          {/* Level 2 */}
          <line x1="120" y1="250" x2="680" y2="250" stroke="#2D5447" strokeWidth="3" />
          {/* Level 1 */}
          <line x1="120" y1="340" x2="680" y2="340" stroke="#2D5447" strokeWidth="3" />

          {/* Internal Room Partitions */}
          {/* Level 3 Partitions */}
          <line x1="280" y1="70" x2="280" y2="160" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="500" y1="70" x2="500" y2="160" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Level 2 Partitions */}
          <line x1="300" y1="160" x2="300" y2="250" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="480" y1="160" x2="480" y2="250" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Level 1 Partitions */}
          <line x1="260" y1="250" x2="260" y2="340" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="520" y1="250" x2="520" y2="340" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Ground Floor Partitions */}
          <line x1="320" y1="340" x2="320" y2="440" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="460" y1="340" x2="460" y2="440" stroke="#24453A" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Room Labels (Technical Blueprint Style) */}
          <text x="140" y="90" fill="#658074" fontSize="9" fontFamily="monospace">L3: SUITES A</text>
          <text x="300" y="90" fill="#658074" fontSize="9" fontFamily="monospace">L3: SUITES B</text>
          <text x="520" y="90" fill="#658074" fontSize="9" fontFamily="monospace">L3: AIR HANDLER</text>

          <text x="140" y="180" fill="#658074" fontSize="9" fontFamily="monospace">L2: RESIDENCE WING</text>
          <text x="320" y="180" fill="#658074" fontSize="9" fontFamily="monospace">L2: STUDY HALL</text>
          <text x="500" y="180" fill="#658074" fontSize="9" fontFamily="monospace">L2: RESIDENCE WING</text>

          <text x="140" y="270" fill="#658074" fontSize="9" fontFamily="monospace">L1: CORRIDORS (500 FIXTURES)</text>
          <text x="280" y="270" fill="#658074" fontSize="9" fontFamily="monospace">L1: LAB WORKSTATIONS</text>
          <text x="540" y="270" fill="#658074" fontSize="9" fontFamily="monospace">L1: COMMON AREA</text>

          <text x="140" y="360" fill="#658074" fontSize="9" fontFamily="monospace">G: MAIN INCOMER &amp; CT METERS</text>
          <text x="340" y="360" fill="#658074" fontSize="9" fontFamily="monospace">G: RECEPTION</text>
          <text x="480" y="360" fill="#658074" fontSize="9" fontFamily="monospace">G: UTILITY SUBSTATION</text>

          {/* =============================================================== */}
          {/* SYSTEM-SPECIFIC HIGHLIGHTS & ANIMATED PATHS                     */}
          {/* =============================================================== */}

          {/* 1. LIGHTING SYSTEM HIGHLIGHTS */}
          {selectedSystem === "lighting" && (
            <g className="transition-all duration-500">
              {/* Highlight Corridors on Level 1 & Level 2 */}
              <rect x="125" y="255" width="550" height="80" rx="4" fill="#D9FF91" fillOpacity="0.12" stroke="#D9FF91" strokeWidth="1.5" />
              <rect x="125" y="165" width="170" height="80" rx="4" fill="#D9FF91" fillOpacity="0.08" stroke="#D9FF91" strokeWidth="1" strokeDasharray="4 2" />

              {/* Light Fixtures Symbols (500 fixtures represented) */}
              {[160, 210, 260, 310, 360, 410, 460, 510, 560, 610, 650].map((x, i) => (
                <g key={i} transform={`translate(${x}, 270)`} className="animate-glow-lime">
                  <circle cx="0" cy="0" r="5" fill="#D9FF91" />
                  <path d="M -8 10 L 0 0 L 8 10" stroke="#D9FF91" strokeWidth="1.5" opacity="0.6" />
                </g>
              ))}

              {/* Power Conduit from Switchboard */}
              <path
                d="M 180 390 L 180 290 L 660 290"
                stroke="#D9FF91"
                strokeWidth="2"
                className="animate-energy-flow"
              />

              {/* Annotation Callout Pin */}
              <g transform="translate(380, 240)">
                <circle cx="0" cy="0" r="8" fill="#152E27" stroke="#D9FF91" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#D9FF91" />
                <line x1="0" y1="-8" x2="0" y2="-28" stroke="#D9FF91" strokeWidth="1" />
                <rect x="-90" y="-52" width="180" height="24" rx="4" fill="#101C18" stroke="#D9FF91" strokeWidth="1" />
                <text x="0" y="-36" fill="#D9FF91" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  500 LEDS: -62.5% LOAD
                </text>
              </g>
            </g>
          )}

          {/* 2. HVAC & COOLING SYSTEM HIGHLIGHTS */}
          {selectedSystem === "hvac" && (
            <g className="transition-all duration-500">
              {/* Rooftop Unit & Ductwork */}
              <rect x="145" y="40" width="230" height="32" rx="4" fill="#D9FF91" fillOpacity="0.2" stroke="#D9FF91" strokeWidth="2" />
              <rect x="515" y="75" width="155" height="80" rx="4" fill="#D9FF91" fillOpacity="0.12" stroke="#D9FF91" strokeWidth="1.5" />

              {/* Main Supply Air Duct Vertical Shaft */}
              <path
                d="M 260 70 L 260 420 M 260 120 L 480 120 M 260 210 L 650 210 M 260 300 L 450 300"
                stroke="#D9FF91"
                strokeWidth="2.5"
                className="animate-energy-flow"
              />

              {/* Diffusers & Setback Sensors */}
              {[180, 340, 440, 580].map((x, i) => (
                <g key={i} transform={`translate(${x}, 100)`}>
                  <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#D9FF91" />
                  <path d="M -10 12 L -5 6 M 10 12 L 5 6" stroke="#D9FF91" strokeWidth="1" />
                </g>
              ))}

              {/* Annotation Callout Pin */}
              <g transform="translate(260, 160)">
                <circle cx="0" cy="0" r="8" fill="#152E27" stroke="#D9FF91" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#D9FF91" />
                <line x1="0" y1="-8" x2="0" y2="-28" stroke="#D9FF91" strokeWidth="1" />
                <rect x="-100" y="-52" width="200" height="24" rx="4" fill="#101C18" stroke="#D9FF91" strokeWidth="1" />
                <text x="0" y="-36" fill="#D9FF91" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  120 kW SPLIT-UNITS: NIGHT SETBACK
                </text>
              </g>
            </g>
          )}

          {/* 3. PLUG LOAD SYSTEM HIGHLIGHTS */}
          {selectedSystem === "equipment" && (
            <g className="transition-all duration-500">
              {/* Lab & Study Suites Receptacles */}
              <rect x="275" y="255" width="240" height="80" rx="4" fill="#D9FF91" fillOpacity="0.15" stroke="#D9FF91" strokeWidth="1.5" />
              <rect x="315" y="165" width="160" height="80" rx="4" fill="#D9FF91" fillOpacity="0.1" stroke="#D9FF91" strokeWidth="1" />

              {/* Workstation Icons */}
              {[300, 340, 380, 420, 460, 500].map((x, i) => (
                <g key={i} transform={`translate(${x}, 310)`}>
                  <rect x="-8" y="-12" width="16" height="12" rx="2" fill="#152E27" stroke="#D9FF91" strokeWidth="1" />
                  <circle cx="0" cy="5" r="3" fill="#D9FF91" />
                </g>
              ))}

              {/* Conduit */}
              <path
                d="M 180 390 L 280 390 L 280 310 L 510 310"
                stroke="#D9FF91"
                strokeWidth="2"
                className="animate-energy-flow"
              />

              {/* Annotation Callout Pin */}
              <g transform="translate(390, 260)">
                <circle cx="0" cy="0" r="8" fill="#152E27" stroke="#D9FF91" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#D9FF91" />
                <line x1="0" y1="-8" x2="0" y2="-28" stroke="#D9FF91" strokeWidth="1" />
                <rect x="-95" y="-52" width="190" height="24" rx="4" fill="#101C18" stroke="#D9FF91" strokeWidth="1" />
                <text x="0" y="-36" fill="#D9FF91" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  250 SMART TIMERS: 12H CUTOFF
                </text>
              </g>
            </g>
          )}

          {/* 4. SMART SUB-METERING HIGHLIGHTS */}
          {selectedSystem === "metering" && (
            <g className="transition-all duration-500">
              {/* Utility Substation & Meter Room */}
              <rect x="130" y="345" width="185" height="90" rx="4" fill="#D9FF91" fillOpacity="0.2" stroke="#D9FF91" strokeWidth="2" />

              {/* Main Switchboard */}
              <rect x="145" y="360" width="70" height="65" rx="4" fill="#101C18" stroke="#D9FF91" strokeWidth="1.5" />
              <circle cx="165" cy="380" r="6" fill="#D9FF91" />
              <circle cx="190" cy="380" r="6" fill="#D9FF91" />
              <text x="180" y="415" fill="#D9FF91" fontSize="8" fontFamily="monospace" textAnchor="middle">CT METERS</text>

              {/* Telemetry bus feeding upwards */}
              <path
                d="M 180 360 L 180 80 M 180 160 L 670 160 M 180 250 L 670 250"
                stroke="#D9FF91"
                strokeWidth="2"
                className="animate-energy-flow"
              />

              {/* Annotation Callout Pin */}
              <g transform="translate(180, 320)">
                <circle cx="0" cy="0" r="8" fill="#152E27" stroke="#D9FF91" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#D9FF91" />
                <line x1="0" y1="-8" x2="0" y2="-28" stroke="#D9FF91" strokeWidth="1" />
                <rect x="-95" y="-52" width="190" height="24" rx="4" fill="#101C18" stroke="#D9FF91" strokeWidth="1" />
                <text x="0" y="-36" fill="#D9FF91" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  15-MIN INTERVAL TELEMETRY
                </text>
              </g>
            </g>
          )}

          {/* External Grid Feed Line */}
          <path d="M 40 400 L 130 400" stroke="#487867" strokeWidth="3" />
          <circle cx="40" cy="400" r="5" fill="#487867" />
          <text x="40" y="385" fill="#658074" fontSize="8" fontFamily="monospace">GRID FEED</text>
        </svg>

        {/* Live System Badge in Top-Right of Cutaway */}
        <div className="absolute top-4 right-4 bg-[#101C18]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-right">
          <div className="text-[10px] font-mono text-[#D9FF91] uppercase tracking-wider font-semibold">
            Active System View
          </div>
          <div className="text-xs font-bold text-white mt-0.5">
            {current.name}
          </div>
        </div>
      </div>

      {/* Dynamic System Detail Card */}
      <div className="p-4 rounded-xl bg-white border border-[#DDE3DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-mono font-semibold">
              <CheckCircle2 className="w-3 h-3 text-[#D9FF91]" />
              {current.badge}
            </span>
            <span className="text-xs text-[#5D6D63]">Verified Engineering Calculation</span>
          </div>
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            {current.name}: {current.tagline}
          </h4>
          <p className="text-xs text-[#5D6D63]">
            <strong>Measurement Protocol:</strong> {current.measurement}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-right border-t md:border-t-0 md:border-l border-[#DDE3DB] pt-2 md:pt-0 md:pl-4">
          <div>
            <div className="text-[11px] text-[#5D6D63]">Annual Savings</div>
            <div className="text-base font-bold text-[#152E27]">{current.costSavings}</div>
          </div>
          <div>
            <div className="text-[11px] text-[#5D6D63]">Payback</div>
            <div className="text-base font-bold text-[#101C18]">{current.payback}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
