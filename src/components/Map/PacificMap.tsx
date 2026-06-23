"use client";

import { useState, useMemo } from "react";
import { ProcessedCountryData } from "@/data/parser";

interface PacificMapProps {
  data: ProcessedCountryData[];
}

interface IslandCoords {
  country: string;
  cx: number;
  cy: number;
}

export default function PacificMap({ data }: PacificMapProps) {
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  // Fiji is our center reference
  const fijiCoords = { cx: 430, cy: 240 };

  const islandCoords: IslandCoords[] = [
    { country: "Palau", cx: 100, cy: 120 },
    { country: "Guam", cx: 150, cy: 80 },
    { country: "Northern Mariana Islands", cx: 155, cy: 50 },
    { country: "Micronesia, Federated State of", cx: 220, cy: 110 },
    { country: "Marshall Islands", cx: 300, cy: 100 },
    { country: "Nauru", cx: 310, cy: 140 },
    { country: "Papua New Guinea", cx: 180, cy: 190 },
    { country: "Solomon Islands", cx: 260, cy: 200 },
    { country: "Vanuatu", cx: 340, cy: 250 },
    { country: "New Caledonia", cx: 310, cy: 290 },
    { country: "Kiribati", cx: 450, cy: 110 },
    { country: "Tuvalu", cx: 390, cy: 170 },
    { country: "Wallis and Futuna", cx: 440, cy: 200 },
    { country: "Tokelau", cx: 470, cy: 170 },
    { country: "Fiji", cx: fijiCoords.cx, cy: fijiCoords.cy },
    { country: "Samoa", cx: 480, cy: 210 },
    { country: "American Samoa", cx: 500, cy: 212 },
    { country: "Tonga", cx: 475, cy: 270 },
    { country: "Niue", cx: 520, cy: 250 },
    { country: "Cook Islands", cx: 580, cy: 260 },
    { country: "French Polynesia", cx: 680, cy: 240 },
  ];

  const mapData = useMemo(() => {
    return islandCoords.map((coord) => {
      const countryData = data.find((d) => d.country === coord.country);
      return {
        ...coord,
        totalRise: countryData ? countryData.totalRise : 0,
        averageRate: countryData ? countryData.averageRate : 0,
      };
    });
  }, [data]);

  const activeRecord = useMemo(() => {
    return mapData.find((d) => d.country === hoveredIsland);
  }, [mapData, hoveredIsland]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 bg-deep-ocean/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 min-h-[480px] shadow-2xl">
      {/* SVG Map Container */}
      <div className="flex-1 relative w-full h-[380px] bg-[#030d14]/75 rounded-xl border border-white/5 overflow-hidden group/map">
        {/* Ocean Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F5F7FA" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>

        <svg viewBox="0 0 800 400" className="w-full h-full relative z-10">
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#061826" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Centralized ambient glow */}
          <circle cx={fijiCoords.cx} cy={fijiCoords.cy} r="250" fill="url(#oceanGlow)" />

          {/* Equator Indicator */}
          <line x1="40" y1="120" x2="760" y2="120" stroke="rgba(76,201,240,0.2)" strokeWidth="0.8" strokeDasharray="6 6" />
          <text x="50" y="112" fill="#4CC9F0" className="font-sans text-[8px] opacity-40 uppercase tracking-widest font-bold">Equator</text>

          {/* Dotted connection paths to Fiji (Visualizes Pacific connectivity) */}
          {mapData.map((island) => {
            if (island.country === "Fiji") return null;
            const isHovered = hoveredIsland === island.country;

            return (
              <line
                key={`link-${island.country}`}
                x1={island.cx}
                y1={island.cy}
                x2={fijiCoords.cx}
                y2={fijiCoords.cy}
                stroke={isHovered ? "#4CC9F0" : "rgba(245,247,250,0.04)"}
                strokeWidth={isHovered ? 1.5 : 0.8}
                strokeDasharray={isHovered ? "none" : "3 6"}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Render Islands */}
          {mapData.map((island) => {
            const isHovered = hoveredIsland === island.country;
            // Radius proportional to physical rise
            const radius = 8 + (island.totalRise * 105);

            return (
              <g
                key={island.country}
                onMouseEnter={() => setHoveredIsland(island.country)}
                onMouseLeave={() => setHoveredIsland(null)}
                className="cursor-pointer"
              >
                {/* Concentric expanding ripples on hover */}
                {isHovered && (
                  <>
                    <circle
                      cx={island.cx}
                      cy={island.cy}
                      r={radius + 8}
                      fill="none"
                      stroke="#4CC9F0"
                      strokeWidth="1.5"
                      className="animate-ping opacity-25"
                    />
                    <circle
                      cx={island.cx}
                      cy={island.cy}
                      r={radius + 16}
                      fill="none"
                      stroke="#00B4D8"
                      strokeWidth="1"
                      className="animate-ping opacity-15"
                    />
                  </>
                )}

                {/* Outer pulsing ring */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r={radius + 4}
                  fill="none"
                  stroke={isHovered ? "#4CC9F0" : "rgba(0,180,216,0.15)"}
                  strokeWidth="1"
                  className="transition-all duration-300"
                />

                {/* Main Node */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r={radius}
                  fill={isHovered ? "#4CC9F0" : "#00B4D8"}
                  opacity={isHovered ? 0.95 : 0.6}
                  className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,180,216,0.4)]"
                />

                {/* Core reference point */}
                <circle cx={island.cx} cy={island.cy} r="1.5" fill="#F5F7FA" />

                {/* Hover label */}
                <text
                  x={island.cx}
                  y={island.cy - radius - 5}
                  textAnchor="middle"
                  fill="#F5F7FA"
                  className={`font-sans text-[8px] tracking-wider pointer-events-none transition-all duration-200 ${
                    isHovered ? "opacity-100 font-semibold" : "opacity-35"
                  }`}
                >
                  {island.country}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Narrative Stats Card */}
      <div className="w-full md:w-[300px] flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
        <div>
          <span className="font-sans text-[9px] text-soft-cyan uppercase tracking-widest font-semibold">
            Interactive Georeference
          </span>
          <h3 className="font-serif text-xl font-bold text-sea-foam mt-1 mb-2">
            Pacific Frontline
          </h3>
          <p className="font-sans text-xs text-sea-foam/65 leading-relaxed">
            Every dotted line connects back to **Fiji**, visualizing how these scattered territories share a unified climate threat. Hover over any node to inspect local records.
          </p>
        </div>

        {activeRecord ? (
          <div className="bg-[#030d14]/70 border border-white/10 rounded-xl p-5 flex flex-col gap-4 shadow-xl transition-all duration-300">
            <div>
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">Selected Country</span>
              <h4 className="font-serif text-lg font-bold text-sea-foam mt-0.5">{activeRecord.country}</h4>
            </div>
            <div>
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">Total Rise Since 1993</span>
              <p className="font-serif text-3xl font-black text-soft-cyan tracking-tight mt-0.5">
                +{(activeRecord.totalRise * 1000).toFixed(0)} mm
              </p>
            </div>
            <div className="border-t border-white/5 pt-3">
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">Annual Growth Rate</span>
              <p className="font-sans text-xs font-semibold text-sea-foam/85 mt-0.5">
                {(activeRecord.averageRate * 1000).toFixed(2)} mm / year
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-xl p-8 flex items-center justify-center text-center bg-[#030d14]/20 min-h-[160px]">
            <p className="font-sans text-xs text-sea-foam/30 italic">
              Hover an island circle on the map to reveal localized stats
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
