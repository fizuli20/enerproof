"use client";

import React, { useState } from "react";

interface TimeSeriesPoint {
  date: string;
  actual?: number;
  predicted?: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  height?: number;
  actualLabel?: string;
  predictedLabel?: string;
  unit?: string;
}

export function TimeSeriesChart({
  data,
  height = 240,
  actualLabel = "Measured Consumption",
  predictedLabel = "Counterfactual Baseline",
  unit = "kWh",
}: TimeSeriesChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-lg border border-[#DFE5E0] bg-[#FFFFFF] flex items-center justify-center text-xs text-[#68736C]"
      >
        No time-series data available to plot
      </div>
    );
  }

  // Filter or sample data if too large for clean SVG rendering
  const step = Math.max(1, Math.floor(data.length / 150));
  const sampledData = data.filter((_, i) => i % step === 0);

  const values: number[] = [];
  sampledData.forEach((d) => {
    if (d.actual !== undefined && !isNaN(d.actual)) values.push(d.actual);
    if (d.predicted !== undefined && !isNaN(d.predicted)) values.push(d.predicted);
  });

  const minVal = values.length > 0 ? Math.max(0, Math.min(...values) * 0.9) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) * 1.1 : 1000;
  const range = maxVal - minVal || 1;

  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const width = 800; // coordinate space

  const scaleX = (index: number) => {
    return paddingLeft + (index / (sampledData.length - 1 || 1)) * (width - paddingLeft - paddingRight);
  };

  const scaleY = (val: number) => {
    return height - paddingBottom - ((val - minVal) / range) * (height - paddingTop - paddingBottom);
  };

  // Generate SVG path for actual
  const actualPoints = sampledData
    .map((d, i) => (d.actual !== undefined ? `${scaleX(i)},${scaleY(d.actual)}` : null))
    .filter(Boolean);
  const actualPath = actualPoints.length > 0 ? `M ${actualPoints.join(" L ")}` : "";

  // Generate SVG path for predicted
  const predPoints = sampledData
    .map((d, i) => (d.predicted !== undefined ? `${scaleX(i)},${scaleY(d.predicted)}` : null))
    .filter(Boolean);
  const predPath = predPoints.length > 0 ? `M ${predPoints.join(" L ")}` : "";

  const activePoint = hoverIndex !== null ? sampledData[hoverIndex] : null;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#DFE5E0] rounded-lg p-4 shadow-sm">
      {/* Legend & Active Point Header */}
      <div className="flex flex-wrap items-center justify-between text-xs mb-3 pb-2 border-b border-[#DFE5E0]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#18211C] inline-block rounded"></span>
            <span className="font-medium text-[#18211C]">{actualLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#245C43] border-t-2 border-dashed border-[#245C43] inline-block"></span>
            <span className="font-medium text-[#245C43]">{predictedLabel}</span>
          </div>
        </div>

        {activePoint && (
          <div className="text-[11px] font-mono text-[#68736C]">
            <span className="font-semibold text-[#18211C]">{activePoint.date}</span>:{" "}
            {activePoint.actual !== undefined && (
              <span className="text-[#18211C]">
                Measured: {Math.round(activePoint.actual).toLocaleString()} {unit}
              </span>
            )}
            {activePoint.predicted !== undefined && (
              <span className="ml-2 text-[#245C43]">
                Baseline: {Math.round(activePoint.predicted).toLocaleString()} {unit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const yVal = minVal + pct * range;
            const yPos = scaleY(yVal);
            return (
              <g key={pct}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={width - paddingRight}
                  y2={yPos}
                  stroke="#DFE5E0"
                  strokeDasharray="3 3"
                  strokeWidth="0.75"
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#68736C"
                  fontFamily="monospace"
                >
                  {Math.round(yVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Actual Line */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="#18211C"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          )}

          {/* Predicted Line */}
          {predPath && (
            <path
              d={predPath}
              fill="none"
              stroke="#245C43"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinejoin="round"
            />
          )}

          {/* Transparent Hover Columns */}
          {sampledData.map((_, i) => {
            const colWidth = (width - paddingLeft - paddingRight) / sampledData.length;
            const xPos = scaleX(i) - colWidth / 2;
            return (
              <rect
                key={i}
                x={xPos}
                y={paddingTop}
                width={colWidth}
                height={height - paddingTop - paddingBottom}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}

          {/* Vertical Hover Indicator */}
          {hoverIndex !== null && (
            <line
              x1={scaleX(hoverIndex)}
              y1={paddingTop}
              x2={scaleX(hoverIndex)}
              y2={height - paddingBottom}
              stroke="#245C43"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* X Axis Labels */}
          {sampledData.length > 0 && (
            <>
              <text
                x={paddingLeft}
                y={height - 8}
                fontSize="9"
                fill="#68736C"
                fontFamily="monospace"
              >
                {sampledData[0].date}
              </text>
              <text
                x={width - paddingRight}
                y={height - 8}
                textAnchor="end"
                fontSize="9"
                fill="#68736C"
                fontFamily="monospace"
              >
                {sampledData[sampledData.length - 1].date}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
