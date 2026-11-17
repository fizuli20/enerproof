import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/lib/store/project-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EnerProof — Energy Efficiency You Can Prove",
  description:
    "EnerProof helps buildings waste less energy, plan smarter efficiency improvements, and understand whether their investments make a measurable difference. CECECO Clean Energy Hackathon 2027.",
  keywords: [
    "Energy Efficiency",
    "Measurement and Verification",
    "Energy Audits",
    "Building Energy",
    "ESCO",
    "Azerbaijan",
    "CECECO 2027",
  ],
  authors: [{ name: "Fizuli Hasanov" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "EnerProof — Energy Efficiency You Can Prove",
    description: "Save energy. Know what works. Deterministic M&V decision support platform for buildings.",
    url: "https://enerproof.vercel.app",
    siteName: "EnerProof",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4F5F0] text-[#101C18] font-sans selection:bg-[#D9FF91] selection:text-[#101C18]">
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
