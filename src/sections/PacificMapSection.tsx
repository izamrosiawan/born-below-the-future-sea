"use client";

import { ProcessedCountryData } from "@/data/parser";
import PacificMap from "@/components/Map/PacificMap";
import AnimatedSection from "@/components/AnimatedSection";

interface PacificMapSectionProps {
  data: ProcessedCountryData[];
  selectedCountryA: string;
  setSelectedCountryA: (c: string) => void;
  selectedCountryB: string;
  setSelectedCountryB: (c: string) => void;
  projectionYear: number;
  setProjectionYear: (y: number) => void;
  projectionScenario: "low" | "high";
  setProjectionScenario: (s: "low" | "high") => void;
}

interface RiskAssessment {
  status: string;
  threat: string;
  color: string;
  bg: string;
  border: string;
}

function getRiskAssessment(year: number, scenario: "low" | "high"): RiskAssessment {
  if (year === 1993) {
    return {
      status: "Baseline Level (0.0 mm)",
      threat: "Stable coastlines, normal seasonal tide ranges. Groundwater wells are fresh and soil is fertile.",
      color: "text-sea-foam/60",
      bg: "bg-white/5",
      border: "border-white/10"
    };
  } else if (year <= 2024) {
    return {
      status: "Elevated High Tides (~ +110 mm)",
      threat: "Active shoreline erosion, palm trees dying near shores. Saltwater starts intruding shallow soil layers.",
      color: "text-amber-400",
      bg: "bg-amber-400/5",
      border: "border-amber-400/25"
    };
  } else if (year <= 2050) {
    return {
      status: "Critical Inundation Danger (~ +220 mm)",
      threat: "Frequent flooding of roads during high tides. Soil becomes brackish, damaging food crops like taro and yam.",
      color: "text-rose-400 animate-pulse",
      bg: "bg-rose-400/5",
      border: "border-rose-400/20"
    };
  } else {
    // 2051 to 2100
    const riseVal = scenario === "low" ? "380" : "750";
    const threatMsg = scenario === "low" 
      ? "Severe coastal retreat. Extensive adaptation is required, including building seawalls and relocating inland houses."
      : "Catastrophic submergence of low-lying atolls. Forced community displacement and loss of sovereign territories.";
    return {
      status: `Extreme Submergence Risk (~ +${riseVal} mm)`,
      threat: threatMsg,
      color: "text-red-500 font-bold",
      bg: "bg-red-500/5",
      border: "border-red-500/20"
    };
  }
}

export default function PacificMapSection({
  data,
  selectedCountryA,
  setSelectedCountryA,
  selectedCountryB,
  setSelectedCountryB,
  projectionYear,
  setProjectionYear,
  projectionScenario,
  setProjectionScenario,
}: PacificMapSectionProps) {
  const risk = getRiskAssessment(projectionYear, projectionScenario);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full flex flex-col gap-8">
        
        {/* Header and Scenario Selector */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 flex flex-col gap-2">
            <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
              06 / GEOGRAPHIC FOOTPRINT & PROJECTIONS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
              The Pacific Frontline
            </h2>
            <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
              The nations of Oceania share a collective vulnerability to rising seas. Adjust the year and emission scenario to project the future of these islands. Click on any island circle on the map to select it for comparison.
            </p>
          </div>
          
          {/* Scenario Selector Panel */}
          <div className="md:col-span-4 flex flex-col gap-2 bg-[#030d14]/75 border border-white/10 p-4 rounded-xl backdrop-blur-md">
            <span className="font-sans text-[9px] text-soft-cyan uppercase tracking-widest font-bold">Emissions Scenario</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => setProjectionScenario("low")}
                className={`px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  projectionScenario === "low"
                    ? "bg-ocean-blue text-sea-foam border border-soft-cyan/30"
                    : "bg-[#020b12] text-sea-foam/50 border border-white/5 hover:text-sea-foam"
                }`}
              >
                SSP1-2.6 (Low)
              </button>
              <button
                onClick={() => setProjectionScenario("high")}
                className={`px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  projectionScenario === "high"
                    ? "bg-ocean-blue text-sea-foam border border-soft-cyan/30"
                    : "bg-[#020b12] text-sea-foam/50 border border-white/5 hover:text-sea-foam"
                }`}
              >
                SSP5-8.5 (High)
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Year Slider Panel */}
        <AnimatedSection delay={100} className="w-full bg-[#030d14]/50 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex flex-col gap-4 shadow-2xl relative overflow-hidden">
          {/* Faint blue linear progress accent at the top */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-soft-cyan via-[#00B4D8] to-transparent opacity-65" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-sans text-[9px] text-[#4CC9F0] uppercase tracking-widest font-bold">Climate Simulation Controller</span>
              <h3 className="font-serif text-lg font-bold text-sea-foam mt-0.5">Interactive Projection Timeline</h3>
            </div>
            
            <div className="flex items-center gap-4 bg-[#020b12] border border-white/5 rounded-xl px-4 py-2">
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest">Year</span>
              <span className="font-serif text-3xl font-black text-soft-cyan tracking-tight leading-none w-[72px] text-center">{projectionYear}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            {/* Interactive Timeline Bar */}
            <div className="flex-1 flex flex-col gap-2 relative">
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min="1993"
                  max="2100"
                  value={projectionYear}
                  onChange={(e) => setProjectionYear(Number(e.target.value))}
                  className="w-full h-2 bg-[#020b12] rounded-lg appearance-none cursor-pointer accent-soft-cyan focus:outline-none border border-white/5"
                />
              </div>
              <div className="flex justify-between text-[8px] text-sea-foam/40 uppercase font-sans tracking-wider mt-1 px-1">
                <button className={`hover:text-soft-cyan transition-colors cursor-pointer ${projectionYear === 1993 ? "text-soft-cyan font-bold" : ""}`} onClick={() => setProjectionYear(1993)}>1993 (Base)</button>
                <button className={`hover:text-soft-cyan transition-colors cursor-pointer ${projectionYear === 2024 ? "text-soft-cyan font-bold" : ""}`} onClick={() => setProjectionYear(2024)}>2024 (Present)</button>
                <button className={`hover:text-soft-cyan transition-colors cursor-pointer ${projectionYear === 2050 ? "text-soft-cyan font-bold" : ""}`} onClick={() => setProjectionYear(2050)}>2050 (Projected)</button>
                <button className={`hover:text-soft-cyan transition-colors cursor-pointer ${projectionYear === 2100 ? "text-soft-cyan font-bold" : ""}`} onClick={() => setProjectionYear(2100)}>2100 (Cent. End)</button>
              </div>
            </div>
          </div>

          {/* Immersive HUD Risk Assessment Readout banner */}
          <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl border ${risk.border} ${risk.bg} transition-all duration-500 mt-2`}>
            <div className="md:col-span-4 flex flex-col gap-1">
              <span className="font-sans text-[8px] text-sea-foam/40 uppercase tracking-widest font-bold">Threat Indicator Level</span>
              <span className={`font-serif text-sm font-bold ${risk.color}`}>{risk.status}</span>
            </div>
            <div className="md:col-span-8 flex flex-col gap-1 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
              <span className="font-sans text-[8px] text-sea-foam/40 uppercase tracking-widest font-bold">Frontline Societal & Ecological Impact</span>
              <span className="font-sans text-xs text-sea-foam/85 leading-relaxed">{risk.threat}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Map visualization component */}
        <AnimatedSection delay={200} className="w-full">
          <PacificMap 
            data={data}
            selectedCountryA={selectedCountryA}
            setSelectedCountryA={setSelectedCountryA}
            selectedCountryB={selectedCountryB}
            setSelectedCountryB={setSelectedCountryB}
            projectionYear={projectionYear}
            projectionScenario={projectionScenario}
          />
        </AnimatedSection>

      </div>
    </section>
  );
}
