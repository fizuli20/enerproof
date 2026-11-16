"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FileSearch,
  LineChart,
  Sliders,
  Ruler,
  CheckCircle2,
  Building2,
  FileText,
  Home,
  ExternalLink,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/app", icon: Home },
    { name: "1. Data Audit & Gates", href: "/app/audit", icon: FileSearch },
    { name: "2. Baseline Regression", href: "/app/baseline", icon: LineChart },
    { name: "3. Interventions (ECMs)", href: "/app/interventions", icon: Sliders },
    { name: "4. M&V Plan (IPMVP)", href: "/app/measurement", icon: Ruler },
    { name: "5. Evidence Gate", href: "/app/verify", icon: CheckCircle2 },
    { name: "6. Portfolio Pooling", href: "/app/portfolio", icon: Building2 },
    { name: "7. Reports & Export", href: "/app/reports", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#DFE5E0] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-[#DFE5E0] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#245C43] flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-[#18211C] tracking-tight">EnerProof</span>
            <span className="block text-[10px] text-[#68736C]">M&V Decision Engine</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-1">
        <div className="text-[11px] font-semibold text-[#68736C] uppercase px-3 py-2 tracking-wider">
          Audit & Verification Workflow
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#E7F1EA] text-[#153C2D] font-semibold"
                  : "text-[#68736C] hover:text-[#18211C] hover:bg-black/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#245C43]" : "text-[#68736C]"}`} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6">
          <div className="text-[11px] font-semibold text-[#68736C] uppercase px-3 py-2 tracking-wider">
            Quick Demos
          </div>
          <Link
            href="/demo"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#245C43] bg-[#E7F1EA]/50 hover:bg-[#E7F1EA]"
          >
            <span>Launch Preloaded Demos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* User / Context Info */}
      <div className="p-4 border-t border-[#DFE5E0] bg-[#F8F9F7]">
        <div className="text-xs font-medium text-[#18211C]">Active Tariff: 0.125 AZN/kWh</div>
        <div className="text-[11px] text-[#68736C]">Azerbaijan Non-Residential</div>
        <div className="mt-2 text-[10px] text-[#68736C]">
          CECECO 2027 • Fizuli Hasanov
        </div>
      </div>
    </aside>
  );
}
