"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import {
  FileSearch,
  LineChart,
  Sliders,
  Ruler,
  CheckCircle2,
  FileText,
  Building2,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Leaf,
  Clock,
} from "lucide-react";

export default function AppDashboard() {
  const steps = [
    {
      num: "1",
      title: "Data Audit & Gates",
      desc: "Check interval continuity, duplicate profiles, and emissions arithmetic.",
      href: "/app/audit",
      icon: FileSearch,
      status: "Active",
    },
    {
      num: "2",
      title: "Baseline Regression",
      desc: "Degree-day weather normalization with CV(RMSE) and NMBE checks.",
      href: "/app/baseline",
      icon: LineChart,
      status: "Ready",
    },
    {
      num: "3",
      title: "Interventions (ECMs)",
      desc: "Interactive calculators for lighting, HVAC, plug load, thermal & boiler.",
      href: "/app/interventions",
      icon: Sliders,
      status: "5 ECMs",
    },
    {
      num: "4",
      title: "M&V Protocol Plan",
      desc: "IPMVP Option A/B/C mapping, metering boundaries, and duration.",
      href: "/app/measurement",
      icon: Ruler,
      status: "Ready",
    },
    {
      num: "5",
      title: "Evidence Gate",
      desc: "Deterministic refusal & ASHRAE 14 FSU uncertainty bounds evaluation.",
      href: "/app/verify",
      icon: CheckCircle2,
      status: "Calibrated",
    },
    {
      num: "6",
      title: "Reports & Export",
      desc: "Generate audit-grade PDF reports with transparent disclaimers.",
      href: "/app/reports",
      icon: FileText,
      status: "1-Click PDF",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Active Project: Baku Higher Oil School & Residence Campus"
        subtitle="M&V Decision Support Workspace • Azerbaijan Non-Residential Tariff: 0.125 AZN/kWh"
      />

      <main className="p-8 max-w-7xl w-full space-y-8">
        {/* Project Metrics Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-base p-5">
            <div className="flex items-center justify-between text-xs text-[#68736C]">
              <span>Annual Consumption</span>
              <Building2 className="w-4 h-4 text-[#245C43]" />
            </div>
            <div className="text-2xl font-bold text-[#18211C] mt-2">995,575 kWh</div>
            <div className="text-xs text-[#68736C] mt-1">+ 602,889 m³ Boiler Gas</div>
          </div>

          <div className="card-base p-5">
            <div className="flex items-center justify-between text-xs text-[#68736C]">
              <span>Total ECM CapEx</span>
              <DollarSign className="w-4 h-4 text-[#245C43]" />
            </div>
            <div className="text-2xl font-bold text-[#18211C] mt-2">90,000 AZN</div>
            <div className="text-xs text-[#68736C] mt-1">Across 5 Recommended Measures</div>
          </div>

          <div className="card-base p-5">
            <div className="flex items-center justify-between text-xs text-[#68736C]">
              <span>Annual Cost Savings</span>
              <TrendingDown className="w-4 h-4 text-[#245C43]" />
            </div>
            <div className="text-2xl font-bold text-[#245C43] mt-2">35,937 AZN/yr</div>
            <div className="text-xs text-[#68736C] mt-1">Simple Payback: 2.5 yrs</div>
          </div>

          <div className="card-base p-5">
            <div className="flex items-center justify-between text-xs text-[#68736C]">
              <span>Avoided CO₂</span>
              <Leaf className="w-4 h-4 text-[#245C43]" />
            </div>
            <div className="text-2xl font-bold text-[#18211C] mt-2">187.4 t/yr</div>
            <div className="text-xs text-[#68736C] mt-1">Grid Electricity & Gas Combined</div>
          </div>
        </div>

        {/* Guided Workflow Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#18211C]">
              Audit & Verification Workflow Steps
            </h2>
            <span className="text-xs text-[#68736C]">
              Follow sequentially or jump directly to any module
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <Link
                  key={st.num}
                  href={st.href}
                  className="card-base p-5 flex flex-col justify-between card-hover group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-[#E7F1EA] text-[#153C2D] font-bold text-xs flex items-center justify-center">
                        {st.num}
                      </span>
                      <span className="badge-green text-[10px] font-semibold px-2 py-0.5 rounded">
                        {st.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#245C43]" />
                      <h3 className="font-bold text-sm text-[#18211C] group-hover:text-[#245C43] transition-colors">
                        {st.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#68736C] leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#DFE5E0] flex items-center justify-between text-xs font-semibold text-[#245C43]">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Audit Case Callout */}
        <div className="card-base p-6 bg-gradient-to-r from-[#FFFFFF] to-[#F8F9F7] border-l-4 border-l-[#245C43] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#245C43]">
              Pre-Loaded Demonstration Cases
            </div>
            <h3 className="text-sm font-bold text-[#18211C]">
              Want to see automated error detection on real public filings?
            </h3>
            <p className="text-xs text-[#68736C]">
              Load the Baku Higher Oil School 3-year public dataset to trigger the automated 10x GHG discrepancy detection and 100% data duplication flag.
            </p>
          </div>
          <Link
            href="/app/audit?demo=bhos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-xs font-semibold shadow-sm shrink-0"
          >
            Launch BHOS Audit Case
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
