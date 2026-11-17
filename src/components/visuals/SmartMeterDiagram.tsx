"use client";

import React from "react";
import { Activity, ShieldCheck, Cpu, HardDrive, ArrowRight } from "lucide-react";

export function SmartMeterDiagram() {
  const steps = [
    {
      num: "01",
      title: "Physical Circuit Isolation",
      desc: "Split-core current transducers (CTs) clamp around target lighting or HVAC circuit breakers.",
      detail: "Zero physical downtime",
    },
    {
      num: "02",
      title: "15-Minute Pulse Logging",
      desc: "Local data loggers record true RMS wattage, current, and runtime intervals for 14–30 continuous days.",
      detail: "Meets ASHRAE 14 Annex B",
    },
    {
      num: "03",
      title: "Zero-Cloud Client Ingestion",
      desc: "Raw CSV interval time-series is parsed client-side in browser memory without sending private building data to remote servers.",
      detail: "100% data privacy",
    },
    {
      num: "04",
      title: "Evidence Gate Evaluation",
      desc: "Tests fractional savings uncertainty (FSU ≤ 50%) and noise floor clearance to output deterministic proof.",
      detail: "Investment-grade verdict",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Visual Workflow Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className="p-5 rounded-2xl bg-white border border-[#DDE3DB] shadow-sm flex flex-col justify-between space-y-3 relative group hover:border-[#152E27] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#152E27] text-[#D9FF91]">
                  STEP {s.num}
                </span>
                <span className="text-[10px] font-mono text-[#5D6D63]">{s.detail}</span>
              </div>
              <h4 className="font-display font-bold text-sm text-[#101C18]">{s.title}</h4>
              <p className="text-xs text-[#5D6D63] leading-relaxed">{s.desc}</p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#5D6D63]">
                <ArrowRight className="w-4 h-4 bg-white rounded-full p-0.5 shadow-sm" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hardware Schematic Graphic */}
      <div className="p-6 rounded-2xl bg-[#101C18] border border-white/10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-mono font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            Recommended Field Hardware
          </div>
          <h4 className="font-display font-bold text-lg text-white">
            Split-Core CT Transducers &amp; Pulse Loggers
          </h4>
          <p className="text-xs text-[#A3B8AC] leading-relaxed">
            Eliminates high-voltage line interruptions. Non-invasive split-core CTs clamp around isolated panelboard feeder conduits in under 15 minutes.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-4 bg-[#152E27] p-4 rounded-xl border border-white/10 font-mono text-xs">
          <div className="text-center">
            <div className="text-xs text-[#A3B8AC]">Sampling Interval</div>
            <div className="text-base font-bold text-[#D9FF91] mt-0.5">15 Minutes</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xs text-[#A3B8AC]">Target Uncertainty</div>
            <div className="text-base font-bold text-[#D9FF91] mt-0.5">&le; 20% FSU</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xs text-[#A3B8AC]">IPMVP Alignment</div>
            <div className="text-base font-bold text-[#FFFFFF] mt-0.5">Option A / B</div>
          </div>
        </div>
      </div>
    </div>
  );
}
