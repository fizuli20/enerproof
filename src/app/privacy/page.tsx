import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F1EA] text-xs font-semibold text-[#153C2D]">
            <Lock className="w-3.5 h-3.5 text-[#245C43]" />
            Data Protection & Client-Side Execution
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211C] tracking-tight">
            Client-Side Privacy Commitment
          </h1>
          <p className="text-base text-[#68736C] leading-relaxed">
            EnerProof is architected with a zero-telemetry, zero-cloud-storage philosophy. Your utility records, interval readings, and building specifications never leave your device.
          </p>
        </div>

        <div className="card-base p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="w-8 h-8 rounded bg-[#E7F1EA] flex items-center justify-center text-[#245C43]">
                <ServerOff className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#18211C]">Zero Server Storage</h3>
              <p className="text-xs text-[#68736C]">
                All CSV files you upload or drag-and-drop are parsed directly inside your browser memory using Web APIs. No data is transmitted to remote backend servers.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="w-8 h-8 rounded bg-[#EBF8FF] flex items-center justify-center text-[#2B6CB0]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#18211C]">Local Calculations</h3>
              <p className="text-xs text-[#68736C]">
                Degree-day regressions, ASHRAE Guideline 14 uncertainty bounds, and PDF reports are generated client-side with WebAssembly and local JavaScript engines.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8F9F7] border border-[#DFE5E0] space-y-2">
              <div className="w-8 h-8 rounded bg-[#FEF3C7] flex items-center justify-center text-[#A66A16]">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#18211C]">No Trackers or Cookies</h3>
              <p className="text-xs text-[#68736C]">
                EnerProof does not use third-party analytics trackers, behavioral pixels, or advertising cookies. The application requires zero authentication to audit public records.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#68736C] pt-4 border-t border-[#DFE5E0] leading-relaxed">
            <h4 className="text-sm font-bold text-[#18211C]">Data Processing Details</h4>
            <p>
              When using the demonstration datasets (such as the Baku Higher Oil School public monthly filings or the Student Residence daily series), the data is served as static read-only fixtures from the browser cache. Any modifications, custom tariff inputs, or newly uploaded interval meters exist solely in the ephemeral state of your browser tab.
            </p>
            <p>
              When exporting an audit report as PDF or CSV, the file is compiled locally in browser memory and triggered as a direct client-side blob download.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
