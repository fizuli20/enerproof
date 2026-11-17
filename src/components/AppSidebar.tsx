"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EnerProofLogo } from "./EnerProofLogo";
import {
  Home,
  FileSearch,
  Sliders,
  Ruler,
  CheckCircle2,
  FileText,
  LineChart,
  Building2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Recommended Primary Workflow Sections
  const primaryNav = [
    { name: "Overview", href: "/app", icon: Home },
    { name: "Energy Data", href: "/app/audit", icon: FileSearch, note: "Check bills & data" },
    { name: "Opportunities", href: "/app/interventions", icon: Sliders, note: "Calculate upgrades", highlight: true },
    { name: "Measurement", href: "/app/measurement", icon: Ruler, note: "IPMVP boundary" },
    { name: "Results", href: "/app/verify", icon: CheckCircle2, note: "Evidence Gate" },
    { name: "Reports", href: "/app/reports", icon: FileText, note: "PDF export" },
  ];

  // Advanced Tools (Progressive disclosure)
  const advancedNav = [
    { name: "Baseline Models", href: "/app/baseline", icon: LineChart },
    { name: "Portfolio Analysis", href: "/app/portfolio", icon: Building2 },
    { name: "Research Methodology", href: "/methodology", icon: BookOpen },
  ];

  const isAdvancedActive = advancedNav.some((item) => pathname === item.href);

  return (
    <aside className="w-64 bg-white border-r border-[#DDE3DB] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#DDE3DB] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <EnerProofLogo variant="dark" size="sm" />
        </Link>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#152E27]/5 text-[#152E27]">
          v3.0
        </span>
      </div>

      {/* Navigation Links */}
      <div className="p-3 flex-1 space-y-4 overflow-y-auto">
        {/* Primary Workflow */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-semibold text-[#5D6D63] uppercase px-3 py-1.5 tracking-wider">
            Primary Workflow
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#152E27] text-white shadow-sm font-semibold"
                    : "text-[#5D6D63] hover:text-[#101C18] hover:bg-[#F4F5F0]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#D9FF91]" : "text-[#5D6D63]"}`} />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#152E27]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Advanced Tools Section (Progressive Disclosure) */}
        <div className="pt-2 border-t border-[#DDE3DB] space-y-1">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen || isAdvancedActive)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-mono font-semibold text-[#5D6D63] uppercase tracking-wider hover:text-[#101C18]"
          >
            <span>Advanced Tools</span>
            {advancedOpen || isAdvancedActive ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#5D6D63]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#5D6D63]" />
            )}
          </button>

          {(advancedOpen || isAdvancedActive) && (
            <div className="space-y-0.5 pt-1 pl-1">
              {advancedNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#152E27]/10 text-[#152E27] font-semibold"
                        : "text-[#5D6D63] hover:text-[#101C18] hover:bg-[#F4F5F0]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Judge Shortcut Pill */}
        <div className="pt-2">
          <Link
            href="/judge"
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#D9FF91]/25 border border-[#D9FF91] text-[#152E27] text-xs font-semibold hover:bg-[#D9FF91]/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#152E27]" />
              <span>Judge Flow (3 Min)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#152E27]" />
          </Link>
        </div>
      </div>

      {/* User / Context Footer */}
      <div className="p-3.5 border-t border-[#DDE3DB] bg-[#F4F5F0] text-xs space-y-1">
        <div className="flex items-center justify-between text-[#101C18] font-medium">
          <span>Tariff:</span>
          <span className="font-mono font-bold text-[#152E27]">0.125 AZN/kWh</span>
        </div>
        <div className="text-[11px] text-[#5D6D63]">
          Azerbaijan Non-Residential &bull; CECECO
        </div>
      </div>
    </aside>
  );
}
