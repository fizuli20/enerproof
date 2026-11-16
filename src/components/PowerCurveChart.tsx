"use client";

import React from "react";

interface PowerCurveProps {
  mode?: "resolution" | "portfolio";
}

export function PowerCurveChart({ mode = "resolution" }: PowerCurveProps) {
  const savingsLevels = [0, 1, 2, 3, 5, 8, 10, 15];

  // Research benchmark data points from outputs/metrics/detection_power_curves_summary.csv
  const resolutionSeries = [
    {
      name: "Daily (Ridge Weather)",
      color: "#245C43",
      data: [0.042, 0.084, 0.162, 0.285, 0.469, 0.724, 0.835, 0.942],
    },
    {
      name: "Hourly (Ridge Weather)",
      color: "#2B6CB0",
      data: [0.069, 0.112, 0.198, 0.312, 0.427, 0.684, 0.795, 0.918],
    },
    {
      name: "Monthly (Ridge Weather)",
      color: "#A66A16",
      data: [0.068, 0.091, 0.125, 0.174, 0.364, 0.542, 0.681, 0.812],
    },
  ];

  const portfolioSeries = [
    {
      name: "Portfolio K=50 Buildings",
      color: "#153C2D",
      data: [0.048, 0.195, 0.412, 0.684, 0.912, 0.985, 0.999, 1.0],
    },
    {
      name: "Portfolio K=20 Buildings",
      color: "#245C43",
      data: [0.045, 0.142, 0.298, 0.495, 0.742, 0.892, 0.965, 0.995],
    },
    {
      name: "Portfolio K=5 Buildings",
      color: "#2B6CB0",
      data: [0.043, 0.095, 0.185, 0.312, 0.512, 0.764, 0.865, 0.952],
    },
    {
      name: "Single Building (K=1)",
      color: "#B74740",
      data: [0.042, 0.084, 0.162, 0.285, 0.469, 0.724, 0.835, 0.942],
    },
  ];

  const activeSeries = mode === "resolution" ? resolutionSeries : portfolioSeries;

  const width = 600;
  const height = 260;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const scaleX = (val: number) => {
    return padLeft + (val / 15) * (width - padLeft - padRight);
  };

  const scaleY = (power: number) => {
    return height - padBottom - power * (height - padTop - padBottom);
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#DFE5E0] rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between text-xs mb-3 pb-2 border-b border-[#DFE5E0]">
        <div className="font-semibold text-[#18211C]">
          {mode === "resolution"
            ? "Empirical Detection Power vs Savings Level (152-Building Cohort)"
            : "Portfolio Aggregation Detection Power (K=1 to K=50 Buildings)"}
        </div>
        <div className="text-[11px] text-[#68736C]">
          Target: 80% Power (ASHRAE Guideline 14)
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Y Grid lines (0% to 100%) */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((p) => {
            const yPos = scaleY(p);
            const is80 = Math.abs(p - 0.8) < 0.01;
            return (
              <g key={p}>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={width - padRight}
                  y2={yPos}
                  stroke={is80 ? "#245C43" : "#DFE5E0"}
                  strokeDasharray={is80 ? "4 2" : "2 2"}
                  strokeWidth={is80 ? "1.5" : "0.75"}
                />
                <text
                  x={padLeft - 6}
                  y={yPos + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill={is80 ? "#245C43" : "#68736C"}
                  fontWeight={is80 ? "bold" : "normal"}
                  fontFamily="monospace"
                >
                  {Math.round(p * 100)}%
                </text>
              </g>
            );
          })}

          {/* 80% Target power annotation */}
          <text
            x={width - padRight - 4}
            y={scaleY(0.8) - 4}
            textAnchor="end"
            fontSize="8"
            fill="#245C43"
            fontWeight="bold"
          >
            Target 80% Power Threshold
          </text>

          {/* X Axis Ticks */}
          {savingsLevels.map((lvl) => {
            const xPos = scaleX(lvl);
            return (
              <g key={lvl}>
                <line x1={xPos} y1={height - padBottom} x2={xPos} y2={height - padBottom + 4} stroke="#68736C" />
                <text
                  x={xPos}
                  y={height - padBottom + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#68736C"
                  fontFamily="monospace"
                >
                  {lvl}%
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 4}
            textAnchor="middle"
            fontSize="9"
            fill="#68736C"
            fontWeight="500"
          >
            Simulated Energy Reduction Percentage
          </text>

          {/* Curves */}
          {activeSeries.map((s) => {
            const points = s.data.map((p, idx) => `${scaleX(savingsLevels[idx])},${scaleY(p)}`);
            const pathData = `M ${points.join(" L ")}`;
            return (
              <g key={s.name}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.data.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={scaleX(savingsLevels[idx])}
                    cy={scaleY(p)}
                    r="3.5"
                    fill={s.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-3 pt-2 border-t border-[#DFE5E0] text-xs">
        {activeSeries.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
            <span className="text-[#18211C] font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
