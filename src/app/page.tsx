"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { calculateLightingRetrofit } from "@/lib/interventions/calculators";
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Sliders,
  Ruler,
  ShieldCheck,
  ChevronRight,
  Info,
  Building,
  Lightbulb,
} from "lucide-react";

export default function LandingPage() {
  // =========================================================================
  // INTERACTIVE ENERGY-SAVING CALCULATOR STATE (Section 4)
  // =========================================================================
  const [fixtureCount, setFixtureCount] = useState<number>(500);
  const [baselineWatts, setBaselineWatts] = useState<number>(64);
  const [retrofitWatts, setRetrofitWatts] = useState<number>(24);
  const [hoursPerDay, setHoursPerDay] = useState<number>(12);
  const [tariff, setTariff] = useState<number>(0.125);
  const [costPerFixture, setCostPerFixture] = useState<number>(35);

  const calcResult = calculateLightingRetrofit({
    fixtureCount,
    baselineWattsPerFixture: baselineWatts,
    retrofitWattsPerFixture: retrofitWatts,
    operatingHoursPerDay: hoursPerDay,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: costPerFixture,
    tariffPerKwh: tariff,
    emissionsFactorKgPerKwh: 0.5,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F0] text-[#101C18]">
      <Navbar />

      <main className="flex-1">
        {/* =================================================================== */}
        {/* SECTION 1: HERO (CONFIDENT DEEP FOREST EDITORIAL COMPOSITION)       */}
        {/* =================================================================== */}
        <section className="bg-[#152E27] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#0D1F1A] relative overflow-hidden">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #D9FF91 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Confident Editorial Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9FF91]/10 border border-[#D9FF91]/25 text-xs font-semibold text-[#D9FF91]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CECECO Clean Energy Hackathon 2027 &bull; Official Entry</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-white">
                    Save energy.<br />
                    <span className="text-[#D9FF91]">Know what works.</span>
                  </h1>
                  <p className="text-xl sm:text-2xl font-light text-[#D9FF91]/90 tracking-tight">
                    Energy efficiency you can prove.
                  </p>
                </div>

                <p className="max-w-xl text-base sm:text-lg text-[#8EA094] leading-relaxed font-normal">
                  Find practical ways to reduce building energy costs, plan smarter upgrades, and understand whether your improvements make a measurable difference.
                </p>

                {/* Primary & Secondary Action: Two clean choices */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/judge"
                    className="inline-flex items-center justify-center gap-2 btn-lime text-base py-3.5 px-6 rounded-lg font-semibold shadow-lg shadow-[#D9FF91]/10"
                  >
                    <Sparkles className="w-4 h-4 text-[#101C18]" />
                    <span>Experience in 3 minutes</span>
                    <ArrowRight className="w-4 h-4 text-[#101C18]" />
                  </Link>

                  <Link
                    href="/research"
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#8EA094] hover:text-white transition-colors px-3 py-2"
                  >
                    <span>Read the empirical research</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Subtext: 100% Client Privacy */}
                <div className="pt-2 flex items-center gap-2 text-xs text-[#8EA094]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF91]" />
                  <span>No login required &bull; 100% client-side data privacy &bull; Zero server data storage</span>
                </div>
              </div>

              {/* Right Column: Live Product Story Visualization */}
              <div className="lg:col-span-5">
                <div className="bg-[#101C18] rounded-2xl p-6 border border-[#D9FF91]/20 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D9FF91] animate-pulse" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D9FF91]">
                        Live Verification Pipeline
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8EA094]">Student Hall &bull; Baku</span>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-3 text-xs">
                    {/* Step 1: Baseline */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-[#8EA094]">1. Existing Consumption</div>
                        <div className="text-sm font-semibold font-mono text-white mt-0.5">115,200 kWh/yr</div>
                      </div>
                      <span className="text-[11px] text-[#8EA094]">500 &times; 64W fixtures</span>
                    </div>

                    {/* Step 2: Proposed Intervention */}
                    <div className="p-3 rounded-lg bg-[#D9FF91]/5 border border-[#D9FF91]/20 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-[#D9FF91]">2. Proposed Upgrade</div>
                        <div className="text-sm font-semibold text-white mt-0.5">LED Retrofit + Smart Controls</div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#D9FF91]">-40W per unit</span>
                    </div>

                    {/* Step 3: Potential Reduction */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-[#8EA094]">3. Potential Savings</div>
                        <div className="text-sm font-bold font-mono text-[#D9FF91] mt-0.5">72,000 kWh/yr (9,000 AZN)</div>
                      </div>
                      <span className="text-[11px] font-mono text-white/90">1.9 yr payback</span>
                    </div>

                    {/* Step 4: Measurement Recommendation */}
                    <div className="p-3.5 rounded-lg bg-[#152E27] border border-[#D9FF91]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-bold text-[#D9FF91]">
                          4. Measurement Decision
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D9FF91] bg-[#D9FF91]/15 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Evidence Supports
                        </span>
                      </div>
                      <p className="text-[11px] text-[#D9FF91]/90 leading-relaxed">
                        Isolate lighting panelboards with 15-min current loggers. Avoids whole-building weather noise.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 text-center">
                    <Link
                      href="/judge"
                      className="text-xs font-semibold text-[#D9FF91] hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <span>Run interactive test case in 3 minutes</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 2: A PRACTICAL PROBLEM (OBSERVED VS TRUE SAVINGS)           */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#152E27]">
              The Real-World Dilemma
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] mt-2 tracking-tight">
              Lower consumption is not always the same as proven savings.
            </h2>
            <p className="text-base sm:text-lg text-[#5D6D63] mt-4 leading-relaxed">
              A building may consume less electricity because its equipment became more efficient, fewer people occupied it, or the weather changed. Traditional dashboards treat every drop in utility bills as success, leading to misallocated capital and unverified promises.
            </p>
          </div>

          {/* Visual Comparison: The Weather vs Efficiency Reality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: The Misleading Metric */}
            <div className="card-editorial p-7 border-l-4 border-l-[#B74740] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B74740] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  What Dashboards Show
                </span>
                <span className="text-xs text-[#5D6D63]">Unadjusted Utility Bill</span>
              </div>
              <h3 className="text-xl font-bold text-[#101C18]">
                &ldquo;Electricity fell 8% this winter &mdash; retrofit succeeded!&rdquo;
              </h3>
              <p className="text-sm text-[#5D6D63] leading-relaxed">
                In reality, Baku experienced a milder winter with 20% fewer heating degree-days, and university exam schedules shifted two weeks. The new equipment contributed almost nothing to the bill reduction.
              </p>
              <div className="p-3.5 rounded-lg bg-[#FEE2E2]/30 border border-[#FECACA] text-xs text-[#991B1B] font-medium">
                Consequence: False sense of efficiency; no verified operational return on investment.
              </div>
            </div>

            {/* Card 2: The EnerProof Approach */}
            <div className="card-editorial p-7 border-l-4 border-l-[#152E27] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#152E27]" />
                  What EnerProof Proves
                </span>
                <span className="text-xs text-[#5D6D63]">Calibrated Counterfactual</span>
              </div>
              <h3 className="text-xl font-bold text-[#101C18]">
                &ldquo;Weather accounted for 6.5%. The retrofit delivered 1.5%.&rdquo;
              </h3>
              <p className="text-sm text-[#5D6D63] leading-relaxed">
                EnerProof compares real consumption against what the building would have used under exact prevailing weather conditions and occupancy schedules, or isolates equipment circuits to eliminate noise completely.
              </p>
              <div className="p-3.5 rounded-lg bg-[#152E27]/5 border border-[#152E27]/15 text-xs text-[#152E27] font-semibold">
                Benefit: Verifiable, bankable evidence that Energy Efficiency Funds and lenders can trust.
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 3: THE PRODUCT EXPERIENCE (CONNECTED WORKFLOW)              */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#DDE3DB]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#152E27]">
                The Clear Pathway
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
                From opportunity to evidence.
              </h2>
              <p className="text-base text-[#5D6D63]">
                Four connected steps turn raw utility records into verified, bankable energy conservation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="card-editorial p-6 space-y-3 relative group hover:border-[#152E27]">
                <div className="w-10 h-10 rounded-lg bg-[#F4F5F0] flex items-center justify-center font-mono font-bold text-sm text-[#152E27]">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#101C18]">Understand</h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Know how your building actually uses energy. Screen interval bills for gaps, duplicate reporting, and arithmetic discrepancies.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#152E27]">
                  Output: Data readiness scorecard
                </div>
              </div>

              {/* Step 2 */}
              <div className="card-editorial p-6 space-y-3 relative group hover:border-[#152E27]">
                <div className="w-10 h-10 rounded-lg bg-[#F4F5F0] flex items-center justify-center font-mono font-bold text-sm text-[#152E27]">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#101C18]">Plan</h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Calculate the cost and potential benefit of an improvement using bounded physical formulas with full lifecycle accounting.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#152E27]">
                  Output: Ranked measures &amp; safe payback
                </div>
              </div>

              {/* Step 3 */}
              <div className="card-editorial p-6 space-y-3 relative group hover:border-[#152E27]">
                <div className="w-10 h-10 rounded-lg bg-[#F4F5F0] flex items-center justify-center font-mono font-bold text-sm text-[#152E27]">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#101C18]">Measure</h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Know what information you need to collect before spending money. Choose between isolated submetering and whole-building tracking.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#152E27]">
                  Output: Boundary plan &amp; logging schedule
                </div>
              </div>

              {/* Step 4 */}
              <div className="card-editorial p-6 space-y-3 relative group hover:border-[#152E27]">
                <div className="w-10 h-10 rounded-lg bg-[#152E27] flex items-center justify-center font-mono font-bold text-sm text-[#D9FF91]">
                  04
                </div>
                <h3 className="text-lg font-bold text-[#101C18]">Evaluate</h3>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Understand whether the evidence supports your estimate. Refuse unverified claims; export investment-grade reports.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#152E27]">
                  Output: Deterministic Evidence Gate verdict
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 4: INTERACTIVE ENERGY-SAVING EXAMPLE (CENTRAL HERO WIDGET)  */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#152E27]">
              Interactive Simulation
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Calculate your upgrade in real time.
            </h2>
            <p className="text-base text-[#5D6D63]">
              Test an illustrative student residence corridor lighting upgrade. Adjust fixture counts, runtimes, and local utility rates to see immediate financial and measurement requirements.
            </p>
          </div>

          {/* Interactive Calculator Surface */}
          <div className="card-editorial p-8 bg-white border border-[#DDE3DB] shadow-lg max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#DDE3DB] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#152E27] flex items-center justify-center text-[#D9FF91]">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101C18]">
                    Dormitory Common Area Lighting Retrofit
                  </h3>
                  <p className="text-xs text-[#5D6D63]">
                    Upgrading outdated fluorescent tubes to smart LED fixtures with motion sensors.
                  </p>
                </div>
              </div>
              <span className="lime-pill text-xs">
                Verified Physical Formula
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* Slider Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Fixture Count */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#101C18]">
                    <span>Number of Fixtures:</span>
                    <span className="font-mono text-sm text-[#152E27] font-bold">{fixtureCount} units</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1200"
                    step="25"
                    value={fixtureCount}
                    onChange={(e) => setFixtureCount(parseInt(e.target.value) || 50)}
                    className="w-full accent-[#152E27]"
                  />
                  <div className="flex justify-between text-[11px] text-[#5D6D63] font-mono">
                    <span>50 fixtures</span>
                    <span>1,200 fixtures</span>
                  </div>
                </div>

                {/* 2. Runtime Hours */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#101C18]">
                    <span>Daily Operating Hours:</span>
                    <span className="font-mono text-sm text-[#152E27] font-bold">{hoursPerDay} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="1"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 4)}
                    className="w-full accent-[#152E27]"
                  />
                  <div className="flex justify-between text-[11px] text-[#5D6D63] font-mono">
                    <span>4 hrs (Night-only)</span>
                    <span>24 hrs (Continuous)</span>
                  </div>
                </div>

                {/* 3. Wattages (Existing vs Replacement) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#101C18]">Existing Wattage:</label>
                    <select
                      value={baselineWatts}
                      onChange={(e) => setBaselineWatts(parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-mono font-medium"
                    >
                      <option value={72}>72W (T12 Dual Tube)</option>
                      <option value={64}>64W (T8 Standard Dual)</option>
                      <option value={40}>40W (Single Fluorescent)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#101C18]">Replacement LED:</label>
                    <select
                      value={retrofitWatts}
                      onChange={(e) => setRetrofitWatts(parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-mono font-medium"
                    >
                      <option value={24}>24W (Integrated Sensor)</option>
                      <option value={18}>18W (High Efficiency LED)</option>
                      <option value={14}>14W (Ultra-Low Power)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Tariff and Cost */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#101C18]">Electricity Tariff (AZN/kWh):</label>
                    <input
                      type="number"
                      step="0.005"
                      min="0.05"
                      max="0.40"
                      value={tariff}
                      onChange={(e) => setTariff(parseFloat(e.target.value) || 0.125)}
                      className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-mono font-medium"
                    />
                    <span className="text-[10px] text-[#5D6D63]">Azerbaijan non-residential rate: 0.125 AZN</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#101C18]">Cost per Fixture (AZN):</label>
                    <input
                      type="number"
                      step="1"
                      min="15"
                      max="100"
                      value={costPerFixture}
                      onChange={(e) => setCostPerFixture(parseInt(e.target.value) || 35)}
                      className="w-full p-2 rounded-lg border border-[#DDE3DB] bg-[#F4F5F0] text-xs font-mono font-medium"
                    />
                    <span className="text-[10px] text-[#5D6D63]">Includes installation &amp; hardware</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Results Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#152E27] text-white rounded-xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D9FF91]">
                      Instant Calculations
                    </span>
                    <span className="text-[11px] font-mono text-[#8EA094]">300 Days / Year</span>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div>
                      <div className="text-xs text-[#8EA094]">Annual Electricity Saved</div>
                      <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#D9FF91] mt-0.5 font-mono-num">
                        {calcResult.annualKwhSavings.toLocaleString()} kWh/yr
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      <div>
                        <div className="text-xs text-[#8EA094]">Annual Financial Savings</div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {calcResult.annualNetSavingsAzn.toLocaleString()} AZN/yr
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8EA094]">Capital Investment</div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {calcResult.totalInitialInvestmentAzn.toLocaleString()} AZN
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-[#8EA094]">Simple Payback Period</div>
                        <div className="text-xl font-bold font-mono text-white mt-0.5">
                          {calcResult.simplePaybackYears !== null
                            ? `${calcResult.simplePaybackYears.toFixed(1)} years`
                            : "No positive payback"}
                        </div>
                      </div>
                      <span className="text-xs text-[#D9FF91] bg-[#D9FF91]/15 px-2.5 py-1 rounded-md font-semibold">
                        ROI Approved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Measurement Strategy */}
                <div className="p-3.5 rounded-lg bg-black/20 border border-white/10 text-xs space-y-1">
                  <div className="font-semibold text-[#D9FF91]">
                    Recommended Measurement Strategy:
                  </div>
                  <p className="text-[#8EA094] leading-relaxed text-[11px]">
                    Isolated Circuit Logging (IPMVP Option A). Spot-meter wattage on 10 sample fixtures; log panelboard runtimes for 30 days. No whole-building weather noise.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDE3DB] text-center text-[11px] text-[#5D6D63]">
              * Clearly labeled as an illustrative engineering estimate based on documented physical delta wattages.
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 5: THE EVIDENCE GATE (EXPLAINED IN PLAIN LANGUAGE)          */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#DDE3DB]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#152E27]">
                The Distinctive Mechanism
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
                Know what you can measure before you invest.
              </h2>
              <p className="text-base sm:text-lg text-[#5D6D63] leading-relaxed">
                EnerProof does something traditional dashboards refuse to do: it tells you when the available evidence is not enough to verify a claim. Before you spend money, the Evidence Gate checks whether your savings will be distinguishable from background operational noise.
              </p>
            </div>

            {/* Plain-Language 3 Verdicts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Verdict 1: Supported */}
              <div className="card-editorial p-7 border-t-4 border-t-[#152E27] space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#D9FF91]/20 flex items-center justify-center text-[#152E27]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold uppercase text-[#152E27]">Verdict 1</div>
                  <h3 className="text-lg font-bold text-[#101C18] mt-1">
                    The available evidence supports this estimate.
                  </h3>
                </div>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  Your planned measurement boundary isolates the equipment, or your expected savings comfortably exceed the building&rsquo;s natural weather noise floor.
                </p>
                <div className="text-xs font-semibold text-[#152E27] pt-2">
                  Action: Proceed to implementation with current measurement plan.
                </div>
              </div>

              {/* Verdict 2: Additional Measurement Required */}
              <div className="card-editorial p-7 border-t-4 border-t-[#9B641B] space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#9B641B]">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold uppercase text-[#9B641B]">Verdict 2</div>
                  <h3 className="text-lg font-bold text-[#101C18] mt-1">
                    Collect more measurements before relying on this estimate.
                  </h3>
                </div>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  The intervention makes physical sense, but the monitoring window is too short or whole-building variance is too high. Submetering or longer logging is required.
                </p>
                <div className="text-xs font-semibold text-[#9B641B] pt-2">
                  Action: Install dedicated circuit loggers before claiming savings.
                </div>
              </div>

              {/* Verdict 3: Insufficient Evidence */}
              <div className="card-editorial p-7 border-t-4 border-t-[#B74740] space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#B74740]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold uppercase text-[#B74740]">Verdict 3</div>
                  <h3 className="text-lg font-bold text-[#101C18] mt-1">
                    The current information is not enough.
                  </h3>
                </div>
                <p className="text-xs text-[#5D6D63] leading-relaxed">
                  The underlying data quality failed (e.g. duplicate bills, missing periods), or apparent savings are smaller than normal daily variance. The gate firmly blocks unverified claims.
                </p>
                <div className="text-xs font-semibold text-[#B74740] pt-2">
                  Action: Correct data provenance; do not submit for financing.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 6: RESEARCH CREDIBILITY (RESTRAINED EDITORIAL LAYOUT)       */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#152E27]">
                Scientific Integrity
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
                Tested against real building data, not idealized models.
              </h2>
              <p className="text-base text-[#5D6D63] leading-relaxed">
                EnerProof’s algorithms were audited and calibrated using 152 real buildings (82 lodging, 70 educational) from the global Building Data Genome 2 (BDG2).
              </p>
              <div className="space-y-3 text-xs text-[#5D6D63]">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#152E27] mt-1.5 shrink-0" />
                  <span><strong>152-Building Benchmark:</strong> Tested across 2 complete years of hourly electricity and localized weather records.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#152E27] mt-1.5 shrink-0" />
                  <span><strong>Evaluation Abstentions:</strong> 9 buildings with incomplete post-period data were recorded as abstentions rather than fabricating predictions.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#152E27] mt-1.5 shrink-0" />
                  <span><strong>Local Baku Case Study:</strong> Discovered duplicate records and a 10x emissions arithmetic error in Baku Higher Oil School public disclosures.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/research"
                  className="inline-flex items-center gap-2 btn-outline-dark text-xs font-semibold py-2.5 px-4 rounded-lg"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Explore the complete research dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Research Feature Visual Card */}
            <div className="lg:col-span-6">
              <div className="card-editorial p-7 bg-white space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DB]">
                  <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                    Portfolio Noise Floor
                  </span>
                  <span className="text-xs text-[#5D6D63]">BDG2 Empirical Cohort</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-[#5D6D63] leading-relaxed">
                    Why multi-building portfolios cannot assume pure error cancellation: regional weather deviations create a cross-building residual correlation floor (&rho; &asymp; 0.33).
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#101C18]">Single Building Noise Floor</span>
                      <span className="font-mono font-bold text-[#101C18]">11.8%</span>
                    </div>
                    <div className="w-full bg-[#F4F5F0] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#5D6D63] h-2 rounded-full" style={{ width: "85%" }} />
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="font-medium text-[#101C18]">10-Building Portfolio Noise</span>
                      <span className="font-mono font-bold text-[#101C18]">5.9%</span>
                    </div>
                    <div className="w-full bg-[#F4F5F0] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#152E27] h-2 rounded-full" style={{ width: "45%" }} />
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="font-medium text-[#152E27] font-semibold">Asymptotic Limit (Infinite Portfolio)</span>
                      <span className="font-mono font-bold text-[#152E27]">4.2% Floor</span>
                    </div>
                    <div className="w-full bg-[#F4F5F0] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#D9FF91] h-2 rounded-full border border-[#152E27]" style={{ width: "32%" }} />
                    </div>
                  </div>

                  <div className="p-3 bg-[#F4F5F0] rounded-lg text-[11px] text-[#5D6D63]">
                    Proves that portfolio pooling reduces uncertainty, but never eliminates the need for disciplined measurement.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 7: FINAL CALL TO ACTION                                    */}
        {/* =================================================================== */}
        <section className="bg-[#152E27] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-[#0D1F1A]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Make your next energy project measurable.
            </h2>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#8EA094] leading-relaxed">
              Experience the 3-minute guided walkthrough, run our preloaded Azerbaijani audit case, or launch the complete engineering workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/judge"
                className="w-full sm:w-auto btn-lime text-base py-3.5 px-8 rounded-lg font-semibold shadow-lg shadow-[#D9FF91]/15"
              >
                <Sparkles className="w-4 h-4 text-[#101C18]" />
                <span>Try EnerProof (3 Minutes)</span>
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </Link>

              <Link
                href="/app"
                className="w-full sm:w-auto btn-outline-light text-base py-3.5 px-6 rounded-lg font-medium"
              >
                <span>Launch Engineering Workspace</span>
              </Link>
            </div>

            <div className="pt-4 text-xs text-[#8EA094]">
              Free access for judges and clean energy auditors &bull; No credit card or sign-up required
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
