"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { calculateLightingRetrofit } from "@/lib/interventions/calculators";
import { BuildingCutaway, BuildingSystem } from "@/components/visuals/BuildingCutaway";
import { EnergyFlowDiagram } from "@/components/visuals/EnergyFlowDiagram";
import { LightingRetrofitVisual } from "@/components/visuals/LightingRetrofitVisual";
import { SmartMeterDiagram } from "@/components/visuals/SmartMeterDiagram";
import { EvidenceGateVisual } from "@/components/visuals/EvidenceGateVisual";
import { ResearchHeroVisual } from "@/components/visuals/ResearchHeroVisual";
import { ExpectedVsObservedVisual } from "@/components/visuals/ExpectedVsObservedVisual";
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Sliders,
  Ruler,
  ShieldCheck,
  ChevronRight,
  Building,
  Lightbulb,
  Fan,
  Power,
  Activity,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  const [selectedHeroSystem, setSelectedHeroSystem] = useState<BuildingSystem>("lighting");

  // Flagship Lighting Calculator State
  const [fixtures, setFixtures] = useState<number>(500);
  const [hours, setHours] = useState<number>(12);
  const [tariff, setTariff] = useState<number>(0.125);

  const calcResult = calculateLightingRetrofit({
    fixtureCount: fixtures,
    baselineWattsPerFixture: 64,
    retrofitWattsPerFixture: 24,
    operatingHoursPerDay: hours,
    operatingDaysPerYear: 300,
    costPerFixtureAzn: 35,
    tariffPerKwh: tariff,
    emissionsFactorKgPerKwh: 0.5,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F0] text-[#101C18]">
      <Navbar />

      <main className="flex-1">
        {/* =================================================================== */}
        {/* SECTION 1: ASYMMETRIC EDITORIAL HERO                                */}
        {/* =================================================================== */}
        <section className="bg-[#152E27] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#0D1F1A] relative overflow-hidden">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #D9FF91 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Asymmetric Editorial Copy */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9FF91]/10 border border-[#D9FF91]/25 text-xs font-semibold text-[#D9FF91]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9FF91]" />
                  <span>CECECO Clean Energy Hackathon 2027</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.06] text-white">
                    Save energy.<br />
                    <span className="text-[#D9FF91]">Know what works.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-[#A3B8AC] leading-relaxed font-normal">
                    Find smarter ways to reduce building energy costs &mdash; and measure the difference.
                  </p>
                </div>

                {/* Primary & Secondary Action: Two clean choices */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                  <Link
                    href="/judge"
                    className="inline-flex items-center justify-center gap-2 btn-lime text-base py-3.5 px-6 rounded-lg font-semibold shadow-lg shadow-[#D9FF91]/10"
                  >
                    <span>Explore the live demo</span>
                    <ArrowRight className="w-4 h-4 text-[#101C18]" />
                  </Link>

                  <Link
                    href="/research"
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#A3B8AC] hover:text-[#D9FF91] transition-colors px-3 py-2"
                  >
                    <span>Discover the science</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Subtext: Zero login friction & client privacy */}
                <div className="pt-2 flex items-center gap-2 text-xs text-[#8EA094]">
                  <span className="w-2 h-2 rounded-full bg-[#D9FF91]" />
                  <span>No login required &bull; 100% client-side privacy &bull; Zero server data storage</span>
                </div>
              </div>

              {/* Right Column: Interactive Architectural Cutaway */}
              <div className="lg:col-span-7">
                <BuildingCutaway
                  initialSystem={selectedHeroSystem}
                  onSystemSelect={(sys) => setSelectedHeroSystem(sys)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 01: BUILDINGS CONSUME ENERGY EVERYWHERE                     */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
              Chapter 01 &bull; System Distribution
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Buildings consume energy everywhere.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
              In university dormitories and academic facilities, energy doesn&apos;t vanish into a vacuum. It flows through separate circuits with distinct operational schedules.
            </p>
          </div>

          {/* Interactive Energy Flow Diagram Component */}
          <EnergyFlowDiagram />
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 02: FIND THE OPPORTUNITY                                    */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[#DDE3DB]">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
              Chapter 02 &bull; Targeted Upgrades
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Find the opportunity.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
              Replacing inefficient equipment delivers predictable load reductions. Compare continuous 64W dual fluorescent fixtures with sensor-driven 24W directional LEDs.
            </p>
          </div>

          {/* Before-and-After Lighting Retrofit Visual */}
          <LightingRetrofitVisual
            fixtures={fixtures}
            hours={hours}
            tariff={tariff}
            onValuesChange={(vals) => {
              setFixtures(vals.fixtures);
              setHours(vals.hours);
              setTariff(vals.tariff);
            }}
          />
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 03: UNDERSTAND THE IMPACT                                   */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[#DDE3DB]">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
              Chapter 03 &bull; Financial Realism
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Understand the impact.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
              EnerProof incorporates metering hardware and auditor costs directly into simple payback, avoiding the fabricated ROI claims common in speculative proposals.
            </p>
          </div>

          {/* Dynamic Large Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-editorial p-6 bg-white space-y-2">
              <span className="text-xs font-mono text-[#5D6D63]">Annual Electricity Reduction</span>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#152E27] font-mono-num">
                {calcResult.annualKwhSavings.toLocaleString()} <span className="text-sm font-normal text-[#5D6D63]">kWh</span>
              </div>
              <p className="text-xs text-[#5D6D63]">
                ~62.5% reduction on monitored lighting panelboards.
              </p>
            </div>

            <div className="card-editorial p-6 bg-white space-y-2">
              <span className="text-xs font-mono text-[#5D6D63]">Annual Cost Savings</span>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#152E27] font-mono-num">
                {calcResult.annualNetSavingsAzn.toLocaleString()} <span className="text-sm font-normal text-[#5D6D63]">AZN</span>
              </div>
              <p className="text-xs text-[#5D6D63]">
                Net annual utility bill savings @ 0.125 AZN/kWh.
              </p>
            </div>

            <div className="card-editorial p-6 bg-white space-y-2">
              <span className="text-xs font-mono text-[#5D6D63]">Upfront Capital + M&amp;V</span>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] font-mono-num">
                {calcResult.totalInitialInvestmentAzn.toLocaleString()} <span className="text-sm font-normal text-[#5D6D63]">AZN</span>
              </div>
              <p className="text-xs text-[#5D6D63]">
                Includes {calcResult.measurementCostAzn.toLocaleString()} AZN for logging sensors.
              </p>
            </div>

            <div className="card-editorial p-6 bg-white space-y-2">
              <span className="text-xs font-mono text-[#5D6D63]">Estimated Payback</span>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#152E27] font-mono-num">
                {calcResult.simplePaybackYears !== null ? `${calcResult.simplePaybackYears.toFixed(1)} yrs` : "N/A"}
              </div>
              <p className="text-xs text-[#5D6D63]">
                Realistic lifecycle payback acceptable to Energy Fund.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 04: MEASURE WHAT MATTERS                                    */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[#DDE3DB]">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
              Chapter 04 &bull; Measurement Protocols
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Measure what matters.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
              Energy efficiency cannot be metered directly &mdash; only verified through disciplined measurement boundaries. EnerProof automates IPMVP Option A, B, and C protocols.
            </p>
          </div>

          {/* Smart Metering Workflow Diagram */}
          <SmartMeterDiagram />
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 05: KNOW WHETHER IT WORKED                                  */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[#DDE3DB]">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
              Chapter 05 &bull; Deterministic Verification
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Know whether it worked.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
              The signature EnerProof Evidence Gate tests every claim against data reliability, boundary suitability, and statistical uncertainty under ASHRAE Guideline 14.
            </p>
          </div>

          {/* Signature Evidence Gate Visual Component */}
          <EvidenceGateVisual />

          {/* Three Tier Savings Visual */}
          <div className="pt-8">
            <ExpectedVsObservedVisual />
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 06: BUILT ON REAL RESEARCH                                  */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[#DDE3DB]">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#152E27]">
              Chapter 06 &bull; Empirical Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#101C18] tracking-tight">
              Built on real research.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6D63] leading-relaxed">
              Tested across 152 buildings from the Building Data Genome 2 (BDG2) dataset and audited against real public filings from Baku Higher Oil School.
            </p>
          </div>

          <ResearchHeroVisual />

          <div className="text-center pt-2">
            <Link
              href="/research"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#152E27] hover:underline"
            >
              <span>Explore full 10-figure research dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* =================================================================== */}
        {/* FINAL CHAPTER: MAKE YOUR NEXT ENERGY PROJECT MEASURABLE             */}
        {/* =================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#152E27] text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9FF91]/15 border border-[#D9FF91]/30 text-xs font-semibold text-[#D9FF91]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CECECO Clean Energy Hackathon 2027</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
              Make your next energy project measurable.
            </h2>

            <p className="text-base sm:text-lg text-[#A3B8AC] max-w-2xl mx-auto leading-relaxed">
              Whether you are an energy auditor, an ESCO contract manager, or an administrator for the Energy Efficiency Fund, EnerProof gives you the proof you need.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/judge"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-lime text-base py-3.5 px-8 rounded-lg font-semibold shadow-lg"
              >
                <span>Experience the 3-minute judge flow</span>
                <ArrowRight className="w-4 h-4 text-[#101C18]" />
              </Link>

              <Link
                href="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-outline-light text-base py-3.5 px-8 rounded-lg font-semibold"
              >
                <span>Open full engineering workspace</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
