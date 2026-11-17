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
} from "lucide-react";

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

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F0]">
      <AppHeader
        title="Project Overview & Execution Roadmap"
        subtitle="Manage your building profile, energy data, identified opportunities, and verification status."
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full space-y-8">
        {/* =================================================================== */}
        {/* 1. WHICH BUILDING AM I WORKING ON?                                  */}
        {/* =================================================================== */}
        <div className="card-editorial p-6 sm:p-8 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDE3DB] gap-3">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Active Facility Context
              </span>
              <h2 className="text-2xl font-display font-bold text-[#101C18]">
                {project.metadata.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="lime-pill text-xs">
                {project.metadata.facilityType}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="space-y-0.5">
              <span className="text-[#5D6D63]">Location:</span>
              <div className="font-semibold text-[#101C18]">{project.metadata.location}</div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#5D6D63]">Lead Auditor:</span>
              <div className="font-semibold text-[#101C18]">{project.metadata.leadAuditor}</div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#5D6D63]">Active Tariff:</span>
              <div className="font-mono font-bold text-[#152E27]">
                {project.tariffs.electricityTariffAznPerKwh} AZN/kWh
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#5D6D63]">Grid Emissions Factor:</span>
              <div className="font-mono text-[#101C18]">
                {project.tariffs.gridEmissionsFactorKgPerKwh} kg CO₂/kWh
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2 & 3: WHAT INFORMATION IS AVAILABLE & WHAT HAVE I COMPLETED?       */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Progress Roadmap (7 cols) */}
          <div className="lg:col-span-7 card-editorial p-6 sm:p-8 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DB]">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Workflow Completion Status
              </span>
              <span className="text-xs text-[#5D6D63]">Step-by-step audit progress</span>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <Link
                href="/app/audit"
                className="p-3.5 rounded-xl border border-[#DDE3DB] hover:border-[#152E27] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    auditPassed ? "bg-[#152E27] text-[#D9FF91]" : "bg-[#F4F5F0] text-[#101C18]"
                  }`}>
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101C18] group-hover:text-[#152E27]">
                      Energy Data &amp; Pre-Intervention Audit
                    </h4>
                    <p className="text-[11px] text-[#5D6D63]">
                      Screen interval data for continuity, duplicates, and math errors.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#152E27] flex items-center gap-1">
                  {auditPassed ? "Audited" : "Action Req."}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              {/* Step 2 */}
              <Link
                href="/app/interventions"
                className="p-3.5 rounded-xl border border-[#DDE3DB] hover:border-[#152E27] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    interventionsPlanned ? "bg-[#152E27] text-[#D9FF91]" : "bg-[#F4F5F0] text-[#101C18]"
                  }`}>
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101C18] group-hover:text-[#152E27]">
                      Energy Conservation Opportunities
                    </h4>
                    <p className="text-[11px] text-[#5D6D63]">
                      {project.interventions.length} measures modeled with full lifecycle accounting.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#152E27] flex items-center gap-1">
                  {project.interventions.length} ECMs
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              {/* Step 3 */}
              <Link
                href="/app/measurement"
                className="p-3.5 rounded-xl border border-[#DDE3DB] hover:border-[#152E27] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    measurementConfigured ? "bg-[#152E27] text-[#D9FF91]" : "bg-[#F4F5F0] text-[#101C18]"
                  }`}>
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101C18] group-hover:text-[#152E27]">
                      Measurement Boundary &amp; IPMVP Strategy
                    </h4>
                    <p className="text-[11px] text-[#5D6D63]">
                      Isolated circuit logging (Option A) vs whole-building regression (Option C).
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#152E27] flex items-center gap-1">
                  {project.measurementPlan?.recommendedOption || "Configured"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              {/* Step 4 */}
              <Link
                href="/app/verify"
                className="p-3.5 rounded-xl border border-[#DDE3DB] hover:border-[#152E27] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    evidenceEvaluated ? "bg-[#152E27] text-[#D9FF91]" : "bg-[#F4F5F0] text-[#101C18]"
                  }`}>
                    04
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101C18] group-hover:text-[#152E27]">
                      Evidence Gate Determination
                    </h4>
                    <p className="text-[11px] text-[#5D6D63]">
                      Deterministic evaluation against building-specific noise floor.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#152E27] flex items-center gap-1">
                  {project.evidenceAssessment?.classification ? "Evaluated" : "Evaluate"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* 4 & 5: WHAT OPPORTUNITIES IDENTIFIED & WHAT SHOULD I DO NEXT? (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Identified Opportunities Card */}
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
                    <div className="text-[#8EA094]">Annual Savings</div>
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
                  <span>Inspect Energy Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* What should I do next? */}
            <div className="card-editorial p-6 bg-white space-y-3">
              <span className="text-xs font-mono font-semibold uppercase text-[#152E27]">
                Recommended Next Action
              </span>
              <h4 className="text-base font-bold text-[#101C18]">
                Export Investment-Grade PDF Audit Report
              </h4>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Compile all verified energy measures, measurement schedules, and Evidence Gate determinations into an official PDF document ready for submission.
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
        </div>
      </main>
    </div>
  );
}
