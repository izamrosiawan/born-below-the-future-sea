"use client";

import { useState, useMemo } from "react";
import { ProcessedCountryData } from "@/data/parser";

interface PacificMapProps {
  data: ProcessedCountryData[];
  selectedCountryA: string;
  setSelectedCountryA: (c: string) => void;
  selectedCountryB: string;
  setSelectedCountryB: (c: string) => void;
  projectionYear: number;
  projectionScenario: "low" | "high";
}

interface IslandCoords {
  country: string;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
}

function getYearValue(countryData: ProcessedCountryData, year: number, scenario: "low" | "high") {
  if (year <= 2024) {
    const pt = countryData.data.find((d) => d.year == year);
    return pt ? pt.value : 0;
  }
  
  // Future projection
  const val2024 = countryData.data.find((d) => d.year === 2024)?.value || countryData.totalRise;
  const t = year - 2024;
  const rate = countryData.averageRate; // m/year
  
  if (scenario === "low") {
    return val2024 + rate * t;
  } else {
    const acceleration = 0.0001; 
    return val2024 + rate * t + 0.5 * acceleration * t * t;
  }
}

export default function PacificMap({
  data,
  selectedCountryA,
  setSelectedCountryA,
  selectedCountryB,
  setSelectedCountryB,
  projectionYear,
  projectionScenario,
}: PacificMapProps) {
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  const fijiCoords = { cx: 430, cy: 240 };

  const islandCoords: IslandCoords[] = [
    { country: "Palau", cx: 100, cy: 120, dx: -35, dy: -5 },
    { country: "Guam", cx: 150, cy: 80, dx: -25, dy: -12 },
    { country: "Northern Mariana Islands", cx: 155, cy: 50, dx: 45, dy: -8 },
    { country: "Micronesia, Federated State of", cx: 220, cy: 110, dx: 0, dy: -18 },
    { country: "Marshall Islands", cx: 300, cy: 100, dx: 35, dy: -12 },
    { country: "Nauru", cx: 310, cy: 140, dx: 25, dy: 5 },
    { country: "Papua New Guinea", cx: 180, cy: 190, dx: -50, dy: 15 },
    { country: "Solomon Islands", cx: 260, cy: 200, dx: -35, dy: 22 },
    { country: "Vanuatu", cx: 340, cy: 250, dx: -35, dy: 15 },
    { country: "New Caledonia", cx: 310, cy: 290, dx: -45, dy: 20 },
    { country: "Kiribati", cx: 450, cy: 110, dx: 35, dy: -10 },
    { country: "Tuvalu", cx: 390, cy: 170, dx: -30, dy: -15 },
    { country: "Wallis and Futuna", cx: 440, cy: 200, dx: 35, dy: -10 },
    { country: "Tokelau", cx: 470, cy: 170, dx: 30, dy: -10 },
    { country: "Fiji", cx: fijiCoords.cx, cy: fijiCoords.cy, dx: -25, dy: 22 },
    { country: "Samoa", cx: 480, cy: 210, dx: 30, dy: -15 },
    { country: "American Samoa", cx: 500, cy: 212, dx: 45, dy: 15 },
    { country: "Tonga", cx: 475, cy: 270, dx: -30, dy: 22 },
    { country: "Niue", cx: 520, cy: 250, dx: 25, dy: 22 },
    { country: "Cook Islands", cx: 580, cy: 260, dx: 40, dy: 15 },
    { country: "French Polynesia", cx: 680, cy: 240, dx: 45, dy: 0 },
  ];

  const mapData = useMemo(() => {
    return islandCoords.map((coord) => {
      const countryData = data.find((d) => d.country === coord.country);
      if (!countryData) {
        return {
          ...coord,
          totalRise: 0,
          averageRate: 0,
          activeValue: 0,
        };
      }
      const activeValue = getYearValue(countryData, projectionYear, projectionScenario);
      return {
        ...coord,
        totalRise: countryData.totalRise,
        averageRate: countryData.averageRate,
        activeValue: activeValue,
      };
    });
  }, [data, projectionYear, projectionScenario]);

  const activeRecord = useMemo(() => {
    return mapData.find((d) => d.country === hoveredIsland);
  }, [mapData, hoveredIsland]);

  const handleIslandClick = (countryName: string) => {
    if (selectedCountryA === countryName || selectedCountryB === countryName) return;
    
    setSelectedCountryA(selectedCountryB);
    setSelectedCountryB(countryName);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio block bypass
    }
  };

  // Pre-calculate selected values for the Head-to-Head card
  const recordA = useMemo(() => mapData.find(d => d.country === selectedCountryA), [mapData, selectedCountryA]);
  const recordB = useMemo(() => mapData.find(d => d.country === selectedCountryB), [mapData, selectedCountryB]);

  const activeValA = recordA ? recordA.activeValue : 0;
  const activeValB = recordB ? recordB.activeValue : 0;
  
  const rateA = recordA ? recordA.averageRate : 0;
  const rateB = recordB ? recordB.averageRate : 0;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 bg-deep-ocean/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 min-h-[480px] shadow-2xl">
      {/* SVG Map Container */}
      <div className="flex-1 relative w-full h-[380px] bg-[#030d14]/75 rounded-xl border border-white/5 overflow-hidden group/map">
        {/* Ocean Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F5F7FA" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>

        <svg viewBox="0 0 800 400" className="w-full h-full relative z-10">
          <style>{`
            @keyframes radar-sweep {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .radar-line {
              transform-origin: 430px 240px;
              animation: radar-sweep 16s linear infinite;
            }
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.35; }
            }
            .trench-line {
              stroke-dasharray: 4 6;
              animation: pulse-glow 4s ease-in-out infinite;
            }
          `}</style>

          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#061826" stopOpacity="0" />
            </radialGradient>
            
            {/* Soft Translucent Spherical Gradients for Nodes */}
            <radialGradient id="islandGlowGrad" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#00B4D8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="islandGlowSelectedA" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#00B4D8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="islandGlowSelectedB" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#E63946" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#E63946" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#E63946" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Centralized ambient glow */}
          <circle cx={fijiCoords.cx} cy={fijiCoords.cy} r="260" fill="url(#oceanGlow)" />

          {/* Cartographic Grid Lines */}
          <line x1="40" y1="120" x2="760" y2="120" stroke="rgba(76,201,240,0.18)" strokeWidth="0.8" strokeDasharray="6 6" />
          <text x="50" y="112" fill="#4CC9F0" className="font-sans text-[8px] opacity-40 uppercase tracking-widest font-bold">Equator</text>
          
          <line x1="40" y1="240" x2="760" y2="240" stroke="rgba(76,201,240,0.06)" strokeWidth="0.6" strokeDasharray="3 3" />
          <text x="50" y="234" fill="#4CC9F0" className="font-sans text-[7px] opacity-25 uppercase tracking-widest">10° S</text>

          <line x1="40" y1="360" x2="760" y2="360" stroke="rgba(76,201,240,0.06)" strokeWidth="0.6" strokeDasharray="3 3" />
          <text x="50" y="354" fill="#4CC9F0" className="font-sans text-[7px] opacity-25 uppercase tracking-widest">20° S</text>
          
          {/* Longitude meridians */}
          <line x1="260" y1="30" x2="260" y2="370" stroke="rgba(76,201,240,0.04)" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="430" y1="30" x2="430" y2="370" stroke="rgba(76,201,240,0.04)" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="600" y1="30" x2="600" y2="370" stroke="rgba(76,201,240,0.04)" strokeWidth="0.6" strokeDasharray="3 3" />

          {/* Sci-Fi Radar Observer Sweep */}
          <line x1="430" y1="240" x2="430" y2="40" stroke="rgba(76,201,240,0.1)" strokeWidth="1.5" className="radar-line" />

          {/* Deep Ocean Trenches (Stylized Cartography) */}
          {/* 1. Tonga Trench */}
          <path
            d="M 495 150 Q 505 250, 485 350"
            fill="none"
            stroke="rgba(76, 201, 240, 0.25)"
            strokeWidth="1.2"
            className="trench-line"
          />
          <text x="504" y="280" fill="rgba(76,201,240,0.3)" className="font-sans text-[6px] uppercase tracking-widest rotate-6">Tonga Trench (-10.8 km)</text>

          {/* 2. Mariana Trench */}
          <path
            d="M 125 50 Q 155 70, 185 110"
            fill="none"
            stroke="rgba(76, 201, 240, 0.25)"
            strokeWidth="1.2"
            className="trench-line"
          />
          <text x="175" y="80" fill="rgba(76,201,240,0.3)" className="font-sans text-[6px] uppercase tracking-widest rotate-12">Mariana Trench (-11.0 km)</text>

          {/* Dotted connection paths to Fiji */}
          {mapData.map((island) => {
            if (island.country === "Fiji") return null;
            const isHovered = hoveredIsland === island.country;
            const isSelected = selectedCountryA === island.country || selectedCountryB === island.country;

            return (
              <line
                key={`link-${island.country}`}
                x1={island.cx}
                y1={island.cy}
                x2={fijiCoords.cx}
                y2={fijiCoords.cy}
                stroke={isHovered ? "#4CC9F0" : isSelected ? "rgba(76,201,240,0.25)" : "rgba(245,247,250,0.03)"}
                strokeWidth={isHovered ? 1.5 : isSelected ? 1.0 : 0.8}
                strokeDasharray={isHovered ? "none" : "2 5"}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Render Islands */}
          {mapData.map((island) => {
            const isHovered = hoveredIsland === island.country;
            const isSelectedA = selectedCountryA === island.country;
            const isSelectedB = selectedCountryB === island.country;
            const isSelected = isSelectedA || isSelectedB;

            // Radius scaled slightly smaller to prevent massive overlaps, but still highly visible
            const radius = 6 + (island.activeValue * 80);

            return (
              <g
                key={island.country}
                onMouseEnter={() => setHoveredIsland(island.country)}
                onMouseLeave={() => setHoveredIsland(null)}
                onClick={() => handleIslandClick(island.country)}
                className="cursor-pointer"
              >
                {/* Dynamic expanding ripples */}
                {(isHovered || isSelected) && (
                  <>
                    <circle
                      cx={island.cx}
                      cy={island.cy}
                      r={radius + 6}
                      fill="none"
                      stroke={isSelectedA ? "#00B4D8" : isSelectedB ? "#E63946" : "#4CC9F0"}
                      strokeWidth="1.2"
                      className="animate-ping opacity-25"
                    />
                  </>
                )}

                {/* Outer glowing ring */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r={radius + 2}
                  fill="none"
                  stroke={isSelectedA ? "#00B4D8" : isSelectedB ? "#E63946" : isHovered ? "#4CC9F0" : "rgba(0,180,216,0.12)"}
                  strokeWidth={isSelected ? 1.5 : 1}
                  className="transition-all duration-300"
                />

                {/* Translucent Sphere Fill */}
                <circle
                  cx={island.cx}
                  cy={island.cy}
                  r={radius}
                  fill={isSelectedA ? "url(#islandGlowSelectedA)" : isSelectedB ? "url(#islandGlowSelectedB)" : "url(#islandGlowGrad)"}
                  stroke={isSelectedA ? "#00B4D8" : isSelectedB ? "#E63946" : isHovered ? "#4CC9F0" : "rgba(76, 201, 240, 0.25)"}
                  strokeWidth="1.0"
                  className="transition-all duration-300"
                />

                {/* Solid Core Dot */}
                <circle 
                  cx={island.cx} 
                  cy={island.cy} 
                  r="2" 
                  fill={isSelectedA ? "#00B4D8" : isSelectedB ? "#E63946" : "#F5F7FA"} 
                  className="transition-all duration-300"
                />

                {/* Leader Line linking node to label to resolve collisions */}
                {(isHovered || isSelected) && (
                  <line
                    x1={island.cx}
                    y1={island.cy}
                    x2={island.cx + island.dx * 0.8}
                    y2={island.cy + island.dy * 0.8}
                    stroke="rgba(245,247,250,0.18)"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Hover / Selected offsets label */}
                <text
                  x={island.cx + island.dx}
                  y={island.cy + island.dy}
                  textAnchor={island.dx > 0 ? "start" : island.dx < 0 ? "end" : "middle"}
                  fill={isSelectedA ? "#4CC9F0" : isSelectedB ? "#E63946" : "#F5F7FA"}
                  className={`font-sans text-[8px] tracking-wider pointer-events-none transition-all duration-200 ${
                    isHovered || isSelected ? "opacity-100 font-semibold scale-105" : "opacity-30"
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
            Select countries by clicking on them. Currently comparing <span className="text-[#00B4D8] font-bold">{selectedCountryA}</span> (Cyan) and <span className="text-[#E63946] font-bold">{selectedCountryB}</span> (Red).
          </p>
        </div>

        {activeRecord ? (
          <div className="bg-[#030d14]/70 border border-white/10 rounded-xl p-5 flex flex-col gap-4 shadow-xl transition-all duration-300">
            <div>
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">Selected Country</span>
              <h4 className="font-serif text-lg font-bold text-sea-foam mt-0.5">{activeRecord.country}</h4>
            </div>
            <div>
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">
                {projectionYear > 2024 ? `Projected Rise (${projectionYear})` : "Rise Since 1993"}
              </span>
              <p className="font-serif text-3xl font-black text-soft-cyan tracking-tight mt-0.5">
                +{(activeRecord.activeValue * 1000).toFixed(0)} mm
              </p>
              {projectionYear > 2024 && (
                <span className="font-sans text-[8px] text-sea-foam/50 block mt-0.5">
                  Scenario: {projectionScenario === "low" ? "SSP1-2.6 (Low)" : "SSP5-8.5 (High)"}
                </span>
              )}
            </div>
            <div className="border-t border-white/5 pt-3">
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">Annual Growth Rate</span>
              <p className="font-sans text-xs font-semibold text-sea-foam/85 mt-0.5">
                {(activeRecord.averageRate * 1000).toFixed(2)} mm / year
              </p>
            </div>
          </div>
        ) : (
          /* Head-to-Head Selected Comparison Card (Fills empty state beautifully!) */
          <div className="bg-[#030d14]/75 border border-white/10 rounded-xl p-5 flex flex-col gap-4 shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#00B4D8] to-[#E63946] opacity-60" />
            
            <div>
              <span className="font-sans text-[9px] text-soft-cyan uppercase tracking-widest font-bold">Active Comparison ({projectionYear})</span>
              <div className="grid grid-cols-2 gap-4 mt-2.5">
                {/* Country A */}
                <div className="flex flex-col gap-1 border-l-2 border-[#00B4D8] pl-2">
                  <span className="font-sans text-[8px] text-sea-foam/50 uppercase truncate block font-bold">{selectedCountryA}</span>
                  <span className="font-serif text-lg font-black text-soft-cyan tracking-tight">
                    +{Math.max(0, activeValA * 1000).toFixed(0)} mm
                  </span>
                  <span className="font-sans text-[8px] text-sea-foam/40 mt-0.5">{(rateA * 1000).toFixed(2)} mm/y</span>
                </div>
                {/* Country B */}
                <div className="flex flex-col gap-1 border-l-2 border-[#E63946] pl-2">
                  <span className="font-sans text-[8px] text-sea-foam/50 uppercase truncate block font-bold">{selectedCountryB}</span>
                  <span className="font-serif text-lg font-black text-[#E63946] tracking-tight">
                    +{Math.max(0, activeValB * 1000).toFixed(0)} mm
                  </span>
                  <span className="font-sans text-[8px] text-sea-foam/40 mt-0.5">{(rateB * 1000).toFixed(2)} mm/y</span>
                </div>
              </div>
            </div>
            
            {/* Visual Progress Bar Ratio */}
            <div className="border-t border-white/5 pt-3 flex flex-col gap-1.5">
              <span className="font-sans text-[8px] text-sea-foam/40 uppercase tracking-widest block">Proportional Rise Ratio</span>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                <div 
                  className="bg-[#00B4D8] h-full transition-all duration-300"
                  style={{ width: `${(activeValA / (activeValA + activeValB || 1)) * 100}%` }}
                />
                <div 
                  className="bg-[#E63946] h-full transition-all duration-300"
                  style={{ width: `${(activeValB / (activeValA + activeValB || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[7px] text-sea-foam/30 uppercase font-sans tracking-wide">
                <span>{selectedCountryA}</span>
                <span>{selectedCountryB}</span>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-2 text-center">
              <span className="font-sans text-[8px] text-sea-foam/40 italic">
                Hover any island on the map to inspect its individual records.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
