"use client";

import React, { useState } from "react";
import { Fan, Thermometer, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export function HvacSystemsVisual() {
  const [scheduleMode, setScheduleMode] = useState<"scheduled" | "uncontrolled">("scheduled");

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DB]">
        <div>
          <h4 className="font-display font-bold text-sm text-[#101C18]">
            HVAC Scheduling &amp; Thermal Comfort Boundaries
          </h4>
          <p className="text-xs text-[#5D6D63]">
            Isolate weather-dependent cooling load while protecting indoor air quality
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F0] rounded-lg border border-[#DDE3DB]">
          <button
            onClick={() => setScheduleMode("scheduled")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              scheduleMode === "scheduled"
                ? "bg-[#152E27] text-[#D9FF91] shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Smart Schedule (45 hrs/wk)
          </button>
          <button
            onClick={() => setScheduleMode("uncontrolled")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              scheduleMode === "uncontrolled"
                ? "bg-[#9B641B] text-white shadow-sm"
                : "text-[#5D6D63] hover:text-[#101C18]"
            }`}
          >
            Uncontrolled (70 hrs/wk)
          </button>
        </div>
      </div>

      {/* Visual Diagram */}
      <div className="relative w-full aspect-[16/7] bg-[#101C18] rounded-xl p-4 overflow-hidden border border-white/10 flex items-center justify-center">
        <svg viewBox="0 0 740 300" className="w-full h-full relative z-10" fill="none">
          {/* Day / Night Timeline Bar */}
          <rect x="50" y="30" width="640" height="28" rx="6" fill="#1A382F" stroke="#2D5447" strokeWidth="1" />
          <text x="70" y="48" fill="#8EA094" fontSize="9" fontFamily="monospace">00:00</text>
          <text x="210" y="48" fill="#8EA094" fontSize="9" fontFamily="monospace">08:00 (START CLASS)</text>
          <text x="490" y="48" fill="#8EA094" fontSize="9" fontFamily="monospace">18:00 (END STUDY)</text>
          <text x="660" y="48" fill="#8EA094" fontSize="9" fontFamily="monospace">24:00</text>

          {/* Active Runtime Zone Highlight */}
          {scheduleMode === "scheduled" ? (
            <rect x="210" y="30" width="280" height="28" fill="#D9FF91" fillOpacity="0.25" stroke="#D9FF91" strokeWidth="1.5" />
          ) : (
            <rect x="50" y="30" width="640" height="28" fill="#9B641B" fillOpacity="0.35" stroke="#9B641B" strokeWidth="1.5" />
          )}

          {/* Chiller Unit Graphic */}
          <rect x="50" y="100" width="180" height="120" rx="8" fill="#152E27" stroke="#3D6B5B" strokeWidth="1.5" />
          <circle cx="140" cy="150" r="32" fill="#0D1F1A" stroke="#D9FF91" strokeWidth="2" />
          {/* Fan blades */}
          <path d="M 140 125 L 140 175 M 115 150 L 165 150" stroke="#D9FF91" strokeWidth="2.5" />
          <text x="140" y="200" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            120 kW SPLIT CHILLER
          </text>
          <text x="140" y="214" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
            Load Factor: 0.70 &bull; 26 Wks Cooling
          </text>

          {/* Temperature & Comfort Target */}
          <rect x="270" y="100" width="220" height="120" rx="8" fill="#1A382F" stroke="#3D6B5B" strokeWidth="1.5" />
          <text x="380" y="125" fill="#D9FF91" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            THERMAL COMFORT BOUNDS
          </text>

          <g transform="translate(290, 140)">
            <text x="0" y="16" fill="#8EA094" fontSize="9" fontFamily="monospace">Occupied Setpoint:</text>
            <text x="130" y="16" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">22.0&deg;C</text>

            <text x="0" y="40" fill="#8EA094" fontSize="9" fontFamily="monospace">Night Setback:</text>
            <text x="130" y="40" fill={scheduleMode === "scheduled" ? "#D9FF91" : "#9B641B"} fontSize="11" fontWeight="bold" fontFamily="monospace">
              {scheduleMode === "scheduled" ? "26.0°C (Saved)" : "22.0°C (Wasted)"}
            </text>

            <text x="0" y="64" fill="#8EA094" fontSize="9" fontFamily="monospace">Fresh Air Flow:</text>
            <text x="130" y="64" fill="#D9FF91" fontSize="9" fontFamily="monospace">Compliant &ge; 10 l/s</text>
          </g>

          {/* Savings Metric Box */}
          <rect x="520" y="100" width="170" height="120" rx="8" fill="#0D1A16" stroke={scheduleMode === "scheduled" ? "#D9FF91" : "#9B641B"} strokeWidth="1.5" />
          <text x="605" y="128" fill="#8EA094" fontSize="9" fontFamily="monospace" textAnchor="middle">
            COOLING SAVINGS
          </text>
          <text x="605" y="160" fill={scheduleMode === "scheduled" ? "#D9FF91" : "#9B641B"} fontSize="18" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            {scheduleMode === "scheduled" ? "54,600 kWh" : "0 kWh"}
          </text>
          <text x="605" y="180" fill="#FFFFFF" fontSize="11" fontFamily="monospace" textAnchor="middle">
            {scheduleMode === "scheduled" ? "6,825 AZN / year" : "0 AZN"}
          </text>
          <text x="605" y="202" fill="#8EA094" fontSize="8" fontFamily="monospace" textAnchor="middle">
            {scheduleMode === "scheduled" ? "Payback: 0.9 yrs" : "Continuous Run"}
          </text>

          {/* Connection Lines */}
          <path d="M 230 160 L 270 160" stroke="#D9FF91" strokeWidth="2" className={scheduleMode === "scheduled" ? "animate-energy-flow" : ""} />
          <path d="M 490 160 L 520 160" stroke="#D9FF91" strokeWidth="2" className={scheduleMode === "scheduled" ? "animate-energy-flow" : ""} />
        </svg>
      </div>

      <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DB] text-xs text-[#101C18] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#152E27] shrink-0" />
          <span>
            <strong>Ventilation Safety Gate:</strong> Setback scheduling automatically preserves minimum fresh air exchange rates mandated by health codes, ensuring energy savings never compromise student well-being.
          </span>
        </div>
      </div>
    </div>
  );
}
