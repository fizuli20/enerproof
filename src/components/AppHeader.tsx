"use client";

import Link from "next/link";
import { Download, Building2, RefreshCw } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  return (
    <div className="h-16 px-8 border-b border-[#DFE5E0] bg-[#FFFFFF] flex items-center justify-between">
      <div>
        <h1 className="text-base font-bold text-[#18211C] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#68736C]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {action}
        <Link
          href="/app/reports"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#DFE5E0] bg-white text-xs font-medium text-[#18211C] hover:bg-black/5"
        >
          <Download className="w-3.5 h-3.5 text-[#68736C]" />
          Export Report
        </Link>
      </div>
    </div>
  );
}
