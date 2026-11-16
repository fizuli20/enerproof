import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/lib/store/project-context";

export const metadata: Metadata = {
  title: "EnerProof — Energy Efficiency You Can Prove",
  description:
    "Evidence-aware Measurement & Verification (M&V) decision support platform for energy auditors, ESCOs, and the Azerbaijan Energy Efficiency Fund. CECECO Clean Energy Hackathon 2027.",
  keywords: [
    "Energy Efficiency",
    "Measurement and Verification",
    "M&V",
    "ASHRAE 14",
    "IPMVP",
    "Baku Higher Oil School",
    "ESCO",
    "Energy Audit",
    "Azerbaijan",
    "CECECO",
  ],
  authors: [{ name: "Fizuli Hasanov" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F8F9F7] text-[#18211C]">
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
