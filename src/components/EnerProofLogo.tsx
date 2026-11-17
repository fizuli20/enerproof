import React from "react";

interface EnerProofLogoProps {
  variant?: "light" | "dark" | "mark-only" | "mark-dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

export function EnerProofLogo({
  variant = "dark",
  size = "md",
  className = "",
  showTagline = false,
}: EnerProofLogoProps) {
  // Dimensions
  const markDimensions = {
    sm: { width: 22, height: 22 },
    md: { width: 28, height: 28 },
    lg: { width: 36, height: 36 },
    xl: { width: 48, height: 48 },
  }[size];

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight",
  }[size];

  const isDarkBg = variant === "light" || variant === "mark-dark";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Symbol: Precision Verification Gauge & Energy Vector */}
      <svg
        width={markDimensions.width}
        height={markDimensions.height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        {/* Background container tile */}
        <rect
          width="32"
          height="32"
          rx="7"
          fill={isDarkBg ? "#152E27" : "#101C18"}
        />
        {/* Subtle interior calibration ring */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="6"
          stroke={isDarkBg ? "#D9FF91" : "#DDE3DB"}
          strokeWidth="0.75"
          strokeOpacity={isDarkBg ? "0.3" : "0.2"}
        />
        {/* Baseline Measurement Bar (Muted Left) */}
        <rect
          x="6.5"
          y="16"
          width="3.5"
          height="10"
          rx="1"
          fill={isDarkBg ? "#5D6D63" : "#5D6D63"}
        />
        {/* Calibration / Counterfactual Stepping Bar (Mid) */}
        <rect
          x="12"
          y="11"
          width="3.5"
          height="15"
          rx="1"
          fill={isDarkBg ? "#8EA094" : "#8EA094"}
        />
        {/* Verified Intervention Bar (Energy Lime Anchor) */}
        <rect
          x="17.5"
          y="6.5"
          width="3.5"
          height="19.5"
          rx="1"
          fill="#D9FF91"
        />
        {/* Precision Verification Point / Delta Horizon Tick */}
        <circle
          cx="24.5"
          cy="7.5"
          r="2"
          fill={isDarkBg ? "#FFFFFF" : "#D9FF91"}
        />
        {/* Dynamic diagonal connection connecting baseline to proof point */}
        <path
          d="M8.25 16L19.25 6.5"
          stroke="#D9FF91"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="1.5 2"
        />
      </svg>

      {/* Wordmark */}
      {variant !== "mark-only" && variant !== "mark-dark" && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span
              className={`font-display font-extrabold ${textSizes} ${
                variant === "light" ? "text-white" : "text-[#101C18]"
              }`}
            >
              Ener<span className={variant === "light" ? "text-[#D9FF91]" : "text-[#152E27]"}>Proof</span>
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[10px] tracking-widest uppercase font-mono font-medium -mt-1 ${
                variant === "light" ? "text-[#D9FF91]/80" : "text-[#5D6D63]"
              }`}
            >
              Energy &bull; Evidence &bull; Proof
            </span>
          )}
        </div>
      )}
    </div>
  );
}
