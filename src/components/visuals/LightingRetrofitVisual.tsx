"use client";

import React, { useState } from "react";
import { Lightbulb, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

interface LightingRetrofitVisualProps {
  fixtures?: number;
  hours?: number;
  tariff?: number;
  onValuesChange?: (values: { fixtures: number; hours: number; tariff: number }) => void;
  showControls?: boolean;
}

export function LightingRetrofitVisual({
  fixtures: initialFixtures = 500,
  hours: initialHours = 12,
  tariff: initialTariff = 0.125,
  onValuesChange,
  showControls = true,
}: LightingRetrofitVisualProps) {
  const [fixtures, setFixtures] = useState<number>(initialFixtures);
  const [hours, setHours] = useState<number>(initialHours);
  const [tariff, setTariff] = useState<number>(initialTariff);

  const baselineWattsPerFixture = 64; // Dual 32W T8 + Ballast
  const retrofitWattsPerFixture = 24; // Directional Sensor LED
  const deltaWatts = baselineWattsPerFixture - retrofitWattsPerFixture; // 40W
  const operatingDays = 300; // University academic year

  const annualBaselineKwh = Math.round((fixtures * baselineWattsPerFixture * hours * operatingDays) / 1000);
  const annualRetrofitKwh = Math.round((fixtures * retrofitWattsPerFixture * hours * operatingDays) / 1000);
  const annualKwhSaved = annualBaselineKwh - annualRetrofitKwh;
  const annualAznSaved = Math.round(annualKwhSaved * tariff);
  const fixtureCostAzn = 35;
  const upfrontInvestmentAzn = Math.round(fixtures * fixtureCostAzn + 2500); // fixtures + 2500 M&V
  const paybackYears = annualAznSaved > 0 ? (upfrontInvestmentAzn / annualAznSaved).toFixed(1) : "N/A";

  const handleFixturesChange = (val: number) => {
    setFixtures(val);
    if (onValuesChange) onValuesChange({ fixtures: val, hours, tariff });
  };

  const handleHoursChange = (val: number) => {
    setHours(val);
    if (onValuesChange) onValuesChange({ fixtures, hours: val, tariff });
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Side-by-side Visual Comparison: Existing vs Proposed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EXISTING: Fluorescent */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE3DB] shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#9B641B] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                Existing Setup
              </span>
              <span className="text-xs font-mono text-[#5D6D63]">64 Watts / Unit</span>
            </div>
            <h4 className="font-display font-bold text-base text-[#101C18]">
              Dual 32W T8 Fluorescent with Ballast
            </h4>
            <p className="text-xs text-[#5D6D63]">
              Continuous diffuse 360&deg; glare &bull; High magnetic ballast loss &bull; No presence detection
            </p>
          </div>

          {/* Graphic: Fluorescent Fixture */}
          <div className="relative w-full h-36 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 320 120" className="w-full h-full" fill="none">
              {/* Ceiling mount */}
              <rect x="40" y="20" width="240" height="12" rx="2" fill="#DDE3DB" />
              {/* Dual Tubes */}
              <rect x="50" y="38" width="220" height="10" rx="4" fill="#F8F3DC" stroke="#D1BE8E" strokeWidth="1" />
              <rect x="50" y="54" width="220" height="10" rx="4" fill="#F8F3DC" stroke="#D1BE8E" strokeWidth="1" />
              {/* Diffuse yellow glow cone */}
              <polygon points="50,68 20,115 300,115 270,68" fill="#FEF3C7" fillOpacity="0.4" />
              {/* Inefficiency heat waves */}
              <path d="M 120 18 Q 125 10 130 18" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M 160 18 Q 165 10 170 18" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M 200 18 Q 205 10 210 18" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.6" />
            </svg>
            <div className="absolute bottom-2 right-3 font-mono text-[11px] text-[#9B641B] font-semibold">
              Power: 64 Watts
            </div>
          </div>

          <div className="pt-2 border-t border-[#DDE3DB] flex justify-between items-center text-xs font-mono">
            <span className="text-[#5D6D63]">Total Baseline Load:</span>
            <span className="font-bold text-[#101C18]">{annualBaselineKwh.toLocaleString()} kWh/yr</span>
          </div>
        </div>

        {/* PROPOSED: LED Retrofit */}
        <div className="p-5 rounded-2xl bg-[#152E27] border border-[#D9FF91]/30 shadow-lg flex flex-col justify-between space-y-4 text-white">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#101C18] bg-[#D9FF91] px-2.5 py-0.5 rounded-full">
                Proposed Upgrade
              </span>
              <span className="text-xs font-mono text-[#D9FF91]">24 Watts / Unit (-62.5%)</span>
            </div>
            <h4 className="font-display font-bold text-base text-white">
              Direct-Lit LED with Integrated Motion Sensor
            </h4>
            <p className="text-xs text-[#A3B8AC]">
              Targeted 120&deg; directional optics &bull; Automated PIR occupancy dimming &bull; Zero ballast loss
            </p>
          </div>

          {/* Graphic: LED Fixture */}
          <div className="relative w-full h-36 bg-[#0E1F1A] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 320 120" className="w-full h-full" fill="none">
              {/* Slimline ceiling mount */}
              <rect x="50" y="22" width="220" height="8" rx="2" fill="#2D5447" />
              {/* LED Strip */}
              <rect x="60" y="32" width="200" height="8" rx="3" fill="#D9FF91" />
              {/* PIR Sensor in Center */}
              <circle cx="160" cy="44" r="5" fill="#FFFFFF" stroke="#152E27" strokeWidth="1" />
              {/* Clean crisp light cone */}
              <polygon points="60,42 30,115 290,115 260,42" fill="#D9FF91" fillOpacity="0.18" />
              {/* Detection Arc */}
              <path d="M 130 80 Q 160 100 190 80" stroke="#D9FF91" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.8" />
            </svg>
            <div className="absolute bottom-2 right-3 font-mono text-[11px] text-[#D9FF91] font-semibold">
              Power: 24 Watts (-40W saved)
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-mono">
            <span className="text-[#A3B8AC]">Proposed Reduced Load:</span>
            <span className="font-bold text-[#D9FF91]">{annualRetrofitKwh.toLocaleString()} kWh/yr</span>
          </div>
        </div>
      </div>

      {/* Sliders & Controls */}
      {showControls && (
        <div className="p-6 rounded-2xl bg-white border border-[#DDE3DB] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDE3DB]">
            <div>
              <h4 className="font-display font-bold text-sm text-[#101C18]">
                Interactive Student Residence Parameters
              </h4>
              <p className="text-xs text-[#5D6D63]">
                Adjust fixture counts and operating runtimes to see real-time energy &amp; payback metrics.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#F4F5F0] text-[#152E27]">
              Tariff: {tariff.toFixed(3)} AZN/kWh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Fixture count slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-[#101C18]">
                <span>Number of Fixtures:</span>
                <span className="font-mono text-[#152E27] font-bold text-sm">{fixtures} units</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="25"
                value={fixtures}
                onChange={(e) => handleFixturesChange(parseInt(e.target.value) || 50)}
                className="w-full accent-[#152E27]"
              />
              <div className="flex justify-between text-[10px] text-[#5D6D63] font-mono">
                <span>50 (Wing)</span>
                <span>500 (Dormitory 1)</span>
                <span>1,200 (Campus)</span>
              </div>
            </div>

            {/* Operating hours slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-[#101C18]">
                <span>Operating Hours per Day:</span>
                <span className="font-mono text-[#152E27] font-bold text-sm">{hours} hrs/day</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="1"
                value={hours}
                onChange={(e) => handleHoursChange(parseInt(e.target.value) || 4)}
                className="w-full accent-[#152E27]"
              />
              <div className="flex justify-between text-[10px] text-[#5D6D63] font-mono">
                <span>4 hrs</span>
                <span>12 hrs (Standard)</span>
                <span>24 hrs (Continuous)</span>
              </div>
            </div>
          </div>

          {/* Prominent Impact Output Grid */}
          <div className="pt-3 border-t border-[#DDE3DB] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <span className="text-[11px] text-[#5D6D63] block font-sans">Annual Electricity Saved</span>
              <span className="text-xl sm:text-2xl font-bold font-display text-[#152E27]">
                {annualKwhSaved.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#5D6D63] block font-sans">kWh / year</span>
            </div>

            <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <span className="text-[11px] text-[#5D6D63] block font-sans">Annual Net Savings</span>
              <span className="text-xl sm:text-2xl font-bold font-display text-[#152E27]">
                {annualAznSaved.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#5D6D63] block font-sans">AZN / year</span>
            </div>

            <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <span className="text-[11px] text-[#5D6D63] block font-sans">Total Investment</span>
              <span className="text-xl sm:text-2xl font-bold font-display text-[#101C18]">
                {upfrontInvestmentAzn.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#5D6D63] block font-sans">CapEx + M&amp;V</span>
            </div>

            <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
              <span className="text-[11px] text-[#5D6D63] block font-sans">Estimated Payback</span>
              <span className="text-xl sm:text-2xl font-bold font-display text-[#152E27]">
                {paybackYears}
              </span>
              <span className="text-[10px] text-[#5D6D63] block font-sans">years</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
