import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Lock, EyeOff, ServerOff, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F0]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#152E27] text-[#D9FF91] text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            Data Protection & Client-Side Execution
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#101C18] tracking-tight">
            Client-Side Privacy Commitment
          </h1>
          <p className="text-base text-[#5D6D63] leading-relaxed">
            EnerProof is architected with a zero-telemetry, zero-cloud-storage philosophy. Your utility records, interval readings, and building specifications never leave your device.
          </p>
        </div>

        <div className="card-editorial p-6 sm:p-8 bg-white space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#152E27] flex items-center justify-center text-[#D9FF91]">
                <ServerOff className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#101C18]">Zero Server Storage</h3>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                All CSV files you upload or drag-and-drop are parsed directly inside your browser memory using Web APIs. No data is transmitted to remote backend servers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#152E27] flex items-center justify-center text-[#D9FF91]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#101C18]">Local Calculations</h3>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                Degree-day regressions, ASHRAE Guideline 14 uncertainty bounds, and PDF reports are generated client-side with WebAssembly and local JavaScript engines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F0] border border-[#DDE3DB] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#152E27] flex items-center justify-center text-[#D9FF91]">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#101C18]">No Trackers or Cookies</h3>
              <p className="text-xs text-[#5D6D63] leading-relaxed">
                EnerProof does not use third-party analytics trackers, behavioral pixels, or advertising cookies. The application requires zero authentication to audit public records.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#5D6D63] pt-4 border-t border-[#DDE3DB] leading-relaxed">
            <h4 className="text-sm font-bold font-display text-[#101C18]">Data Processing Details</h4>
            <p>
              When using the demonstration datasets (such as the Baku Higher Oil School public monthly filings or the Student Residence daily series), the data is served as static read-only fixtures from the browser cache. Any modifications, custom tariff inputs, or newly uploaded interval meters exist solely in the ephemeral state of your browser tab.
            </p>
            <p>
              When you export PDF documentation or JSON project state, the files are synthesized in-memory via client-side libraries and downloaded through local browser blob URLs. No copy is persisted on our servers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
