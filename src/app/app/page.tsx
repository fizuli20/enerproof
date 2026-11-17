"use client";

import React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { useProject } from "@/lib/store/project-context";
import {
  Building2,
  FileSearch,
  Sliders,
  Ruler,
  CheckCircle2,
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { BuildingCutaway } from "@/components/visuals/BuildingCutaway";

export default function AppDashboard() {
  const { project } = useProject();

  // Summary Metrics from project state
  const totalKwhSaved = project.interventions.reduce((acc, i) => acc + i.annualKwhSavings, 0);
  const totalCostAzn = project.interventions.reduce((acc, i) => acc + (i.implementationCostAzn || 0), 0);
  const totalNetAzn = project.interventions.reduce((acc, i) => acc + (i.annualNetSavingsAzn || 0), 0);

  // Completed steps checklist
  const auditPassed = project.auditSummary?.passed ?? true;
  const baselineFitted = !!project.baselineResult;
  const interventionsPlanned = project.interventions.length > 0;
  const measurementConfigured = !!project.measurementPlan;
  const evidenceEvaluated = !!project.evidenceAssessment;

  const steps = [
    {
      num: "01",
      title: "Data Audit",
      subtitle: "Screen for duplicates & math errors",
      href: "/app/audit",
      status: auditPassed ? "Audited" : "Needs Review",
      done: true,
    },
    {
      num: "02",
      title: "Opportunities",
      subtitle: `${project.interventions.length} physics-based ECMs`,
      href: "/app/interventions",
      status: `${project.interventions.length} Measures`,
      done: interventionsPlanned,
    },
    {
      num: "03",
      title: "M&V Plan",
      subtitle: project.measurementPlan?.recommendedOption || "Option A/C strategy",
      href: "/app/measurement",
      status: "Configured",
      done: measurementConfigured,
    },
    {
      num: "04",
      title: "Evidence Gate",
      subtitle: "Deterministic noise floor check",
      href: "/app/verify",
      status: evidenceEvaluated ? "Evaluated" : "Evaluate",
      done: evidenceEvaluated,
    },
    {
      num: "05",
      title: "Reports & Export",
      subtitle: "Investment-grade PDF & JSON",
      href: "/app/reports",
      status: "Ready",
      done: true,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="Project Overview & Execution Roadmap"
        subtitle="Manage your building profile, energy data, identified opportunities, and verification status."
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full space-y-8">
        {/* =================================================================== */}
        {/* VISUAL PROJECT TIMELINE                                              */}
        {/* =================================================================== */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDE3DB] gap-2">
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27] tracking-wider">
                End-to-End Verification Pipeline
              </span>
              <h3 className="text-sm font-bold text-[#101C18]">
                Audit-to-Action Workflow Progress
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5D6D63]">
              Active Building: <strong className="text-[#101C18]">{project.metadata.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {steps.map((st, i) => (
              <Link
                key={st.num}
                href={st.href}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between group ${
                  st.done
                    ? "bg-[#152E27]/5 border-[#152E27]/20 hover:border-[#152E27]"
                    : "bg-[#F4F5F0]/60 border-[#DDE3DB] hover:border-[#101C18]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    st.done ? "bg-[#152E27] text-[#D9FF91]" : "bg-[#DDE3DB] text-[#5D6D63]"
                  }`}>
                    {st.num}
                  </span>
                  <span className="text-[10px] font-semibold text-[#152E27] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {st.status}
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#101C18] group-hover:text-[#152E27]">
                    {st.title}
                  </div>
                  <div className="text-[10px] text-[#5D6D63] line-clamp-1 mt-0.5">
                    {st.subtitle}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 1. FACILITY CONTEXT & INTERACTIVE CUTAWAY                           */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Facility Details & Key Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-editorial p-6 sm:p-7 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DB]">
                <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                  Active Facility Profile
                </span>
                <span className="lime-pill text-xs">
                  {project.metadata.facilityType}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-[#101C18]">
                  {project.metadata.name}
                </h2>
                <p className="text-xs text-[#5D6D63] mt-1">
                  {project.metadata.location} &bull; Lead Auditor: {project.metadata.leadAuditor}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#DDE3DB] text-xs">
                <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
                  <span className="text-[#5D6D63] text-[11px] block">Electricity Tariff</span>
                  <span className="font-mono font-bold text-sm text-[#152E27]">
                    {project.tariffs.electricityTariffAznPerKwh} AZN/kWh
                  </span>
                </div>
                <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DDE3DB]">
                  <span className="text-[#5D6D63] text-[11px] block">Grid Emissions</span>
                  <span className="font-mono font-bold text-sm text-[#101C18]">
                    {project.tariffs.gridEmissionsFactorKgPerKwh} kg/kWh
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/app/audit"
                  className="w-full btn-forest text-xs py-2 px-3.5 rounded-lg inline-flex items-center justify-center gap-1.5"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>Inspect Pre-Intervention Energy Data</span>
                </Link>
              </div>
            </div>

            {/* Opportunities Impact Summary Card */}
            <div className="bg-[#152E27] text-white rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="text-xs font-mono font-semibold uppercase text-[#D9FF91]">
                  Identified Package Impact
                </span>
                <span className="text-[11px] font-mono text-[#8EA094]">{project.interventions.length} Measures</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#8EA094]">Annual Energy Reduction</div>
                  <div className="text-2xl font-bold font-mono text-[#D9FF91] mt-0.5">
                    {totalKwhSaved.toLocaleString()} kWh/yr
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-[#8EA094]">Annual Net Savings</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {totalNetAzn.toLocaleString()} AZN/yr
                    </div>
                  </div>
                  <div>
                    <div className="text-[#8EA094]">Package CapEx</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {totalCostAzn.toLocaleString()} AZN
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/app/interventions"
                  className="w-full btn-lime text-xs py-2 px-3.5 rounded-lg font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>Explore 5 Engineering Measures</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Next Step Card */}
            <div className="card-editorial p-6 bg-white space-y-3">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Recommended Next Step
              </span>
              <h4 className="text-base font-bold text-[#101C18]">
                Export Official Audit Package
              </h4>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Compile verified engineering measures, measurement boundaries, and Evidence Gate statistical determinations into a competition-ready PDF.
              </p>
              <div className="pt-1">
                <Link
                  href="/app/reports"
                  className="btn-forest text-xs py-2 px-3.5 rounded-lg font-medium inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Facility Architectural Schematic (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card-editorial p-6 bg-white space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DB]">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase text-[#152E27] tracking-wider">
                    Interactive Facility Architectural Cutaway
                  </span>
                  <h3 className="text-sm font-bold text-[#101C18]">
                    Cross-Section & Subsystem Isolation Visualizer
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F5F0] text-[#5D6D63]">
                  4-Story Residence Model
                </span>
              </div>
              <BuildingCutaway />
              <p className="text-[11px] text-[#5D6D63] pt-1">
                Toggle subsystems above to highlight physical conduits, occupancy sensors, chiller setbacks, and dedicated split-core submetering boundaries across the facility.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
