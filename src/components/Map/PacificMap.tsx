"use client";

import { useState, useMemo } from "react";
import { ProcessedCountryData } from "@/data/parser";

interface PacificMapProps {
  data: ProcessedCountryData[];
}

interface IslandCoords {
  country: string;
  cx: number; // custom SVG X center offset mapping (scaled roughly to ocean grid)
  cy: number; // custom SVG Y center offset mapping
}

export default function PacificMap({ data }: PacificMapProps) {
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  // Approximate relative mapping for Pacific Islands in our SVG box
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
    { country: "Fiji", cx: 430, cy: 240 },
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
    <div className="w-full flex flex-col md:flex-row gap-6 bg-deep-ocean/50 backdrop-blur-md rounded-xl border border-white/5 p-6 min-h-[450px]">
      {/* SVG Map Container */}
      <div className="flex-1 relative w-full h-[350px] bg-[#030d14]/75 rounded-lg border border-white/5 overflow-hidden">
        {/* Ocean Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F5F7FA" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Custom D3 SVG Projection Fallback */}
        <svg viewBox="0 0 800 400" className="w-full h-full relative z-10">
          {/* Equator Indicator */}
          <line x1="50" y1="120" x2="750" y2="120" stroke="#4CC9F0" strokeWidth="0.5" strokeDasharray="5 5" className="opacity-30" />
          <text x="60" y="115" fill="#4CC9F0" className="font-sans text-[8px] opacity-45 uppercase tracking-widest">Equator</text>

          {/* Render Islands */}
          {mapData.map((island) => {
            const isHovered = hoveredIsland === island.country;
            // Radius scale based on rise amount
            const radius = 8 + (island.totalRise * 100);

            return (
              <g
                key={island.country}
                onMouseEnter={() => setHoveredIsland(island.country)}
                onMouseLeave={() => setHoveredIsland(null)}
                className="cursor-pointer group"
              >
                {/* Pulsing Outer Ring */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r={radius + 6}
                  fill="none"
                  stroke={isHovered ? "#4CC9F0" : "transparent"}
                  strokeWidth="1.5"
                  className="transition-all duration-300 animate-ping opacity-35"
                />

                {/* Main Node */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r={radius}
                  fill={isHovered ? "#4CC9F0" : "#00B4D8"}
                  opacity={isHovered ? 0.95 : 0.65}
                  className="transition-all duration-300 shadow-lg"
                />

                {/* Central Dot */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r="2"
                  fill="#F5F7FA"
                />

                {/* Country Name Annotation */}
                <text
                  x={island.cx}
                  y={island.cy - radius - 4}
                  textAnchor="middle"
                  fill="#F5F7FA"
                  className={`font-sans text-[8px] tracking-wider pointer-events-none transition-all duration-200 ${
                    isHovered ? "opacity-100 font-semibold" : "opacity-40"
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
      <div className="w-full md:w-[280px] flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
        <div>
          <h3 className="font-serif text-lg font-bold tracking-wider text-soft-cyan mb-1">
            Pacific Frontline
          </h3>
          <p className="font-sans text-xs text-sea-foam/60 leading-relaxed mb-6">
            Hover over any island nation on the map to see its relative sea level change and yearly average rise.
          </p>
        </div>

        {activeRecord ? (
          <div className="bg-[#030d14]/50 border border-white/5 rounded-lg p-4 flex flex-col gap-3 transition-all duration-300">
            <div>
              <span className="font-sans text-[10px] text-sea-foam/40 uppercase tracking-widest">Selected Territory</span>
              <h4 className="font-serif text-md font-bold text-sea-foam">{activeRecord.country}</h4>
            </div>
            <div>
              <span className="font-sans text-[10px] text-sea-foam/40 uppercase tracking-widest">Total Rise Since 1993</span>
              <p className="font-serif text-2xl font-black text-soft-cyan">
                +{(activeRecord.totalRise * 1000).toFixed(0)} mm
              </p>
            </div>
            <div>
              <span className="font-sans text-[10px] text-sea-foam/40 uppercase tracking-widest">Average Annual Rate</span>
              <p className="font-sans text-xs font-semibold text-sea-foam/85">
                {(activeRecord.averageRate * 1000).toFixed(2)} mm / yr
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-lg p-6 flex items-center justify-center text-center">
            <p className="font-sans text-xs text-sea-foam/30 italic">
              Hover an island to reveal local data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
