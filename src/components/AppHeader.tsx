"use client";

import React from "react";
import Link from "next/link";
import { Download, Sparkles } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  return (
    <div className="h-16 px-6 sm:px-8 border-b border-[#DDE3DB] bg-white flex items-center justify-between sticky top-0 z-30">
      <div className="space-y-0.5">
        <h1 className="text-base sm:text-lg font-display font-bold text-[#101C18] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#5D6D63] hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        {action}
        <Link
          href="/judge"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D9FF91]/20 border border-[#D9FF91] text-xs font-semibold text-[#152E27] hover:bg-[#D9FF91]/35 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#152E27]" />
          <span>Judge Walkthrough</span>
        </Link>
        <Link
          href="/app/reports"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDE3DB] bg-white text-xs font-semibold text-[#101C18] hover:bg-[#F4F5F0] transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#5D6D63]" />
          <span>Export Report</span>
        </Link>
      </div>
    </div>
  );
}
