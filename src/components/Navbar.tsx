"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, ArrowRight, BarChart3, BookOpen, Layers, Info, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/judge", label: "Judge (3 Min)", icon: Sparkles },
    { href: "/demo", label: "Live Demos", icon: Layers },
    { href: "/research", label: "Research", icon: BarChart3 },
    { href: "/methodology", label: "Methodology", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#DFE5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#245C43] flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-[#18211C] tracking-tight">EnerProof</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#E7F1EA] text-[#153C2D]">
              CECECO 2027
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E7F1EA] text-[#153C2D]"
                    : "text-[#68736C] hover:text-[#18211C] hover:bg-black/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1b4733] text-white text-sm font-medium shadow-sm transition-all"
          >
            Launch Platform
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
