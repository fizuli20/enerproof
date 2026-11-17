"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EnerProofLogo } from "./EnerProofLogo";
import {
  Sparkles,
  BarChart3,
  Layers,
  BookOpen,
  Info,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/judge", label: "Judge (3 Min)", icon: Sparkles, highlight: true },
    { href: "/demo", label: "Live Demos", icon: Layers },
    { href: "/research", label: "Research", icon: BarChart3 },
    { href: "/methodology", label: "Methodology", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F4F5F0]/90 backdrop-blur-md border-b border-[#DDE3DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <EnerProofLogo variant="dark" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#152E27] text-[#D9FF91] shadow-sm"
                      : "bg-[#152E27]/5 hover:bg-[#152E27]/10 text-[#152E27] border border-[#152E27]/10"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#152E27]" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#152E27]/10 text-[#101C18] font-semibold"
                    : "text-[#5D6D63] hover:text-[#101C18] hover:bg-black/5"
                }`}
              >
                <Icon className="w-4 h-4 text-[#5D6D63]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden sm:inline-flex items-center gap-1.5 btn-forest text-xs py-2 px-3.5 rounded-lg font-medium shadow-sm transition-all"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#101C18] hover:bg-black/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DDE3DB] bg-[#F4F5F0] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-[#152E27] text-white"
                    : "text-[#101C18] hover:bg-black/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#DDE3DB]">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full btn-forest text-sm py-2.5 rounded-lg"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
