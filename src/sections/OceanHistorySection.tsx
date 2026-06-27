"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface Milestone {
  year: number;
  title: string;
  desc: string;
  badge: string;
  detail: string;
}

export default function OceanHistorySection() {
  const milestones: Milestone[] = [
    {
      year: 1993,
      title: "The Global Baseline Year",
      desc: "Standard reference point zero for all modern sea-level rise observations.",
      badge: "Satellite Altimetry",
      detail: "Precision satellites begin continuous measurements, establishing a reference point zero to track changes across the globe."
    },
    {
      year: 2005,
      title: "Thermal Expansion Surge",
      desc: "Ocean heat content spikes, driving accelerated thermal expansion of seawater.",
      badge: "Thermodynamics",
      detail: "The upper oceans absorb the majority of trapped heat energy, expanding water volume and accelerating localized shore erosion."
    },
    {
      year: 2015,
      title: "Cryosphere Meltdown",
      desc: "Glacier and ice sheet meltwater surpasses expansion as the main driver of rise.",
      badge: "Ice Sheets",
      detail: "Mass loss from Greenland and Antarctic ice sheets triples compared to the 1990s, dumping billions of tons of water into the seas."
    },
    {
      year: 2024,
      title: "The Modern Reality",
      desc: "Pacific sea levels reach historic heights, threatening low-lying archipelagos.",
      badge: "Present Frontline",
      detail: "Fiji registers a net rise of +111.6 mm. High-tide flooding becomes a frequent hazard rather than a rare seasonal event."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const active = milestones[activeIndex];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Interactive Milestone Ledgers Card */}
        <AnimatedSection className="flex flex-col items-center gap-6 w-full">
          <div className="relative w-full max-w-[360px] min-h-[340px] rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a1e2f]/80 to-[#030d14]/90 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(0,180,216,0.05)] backdrop-blur-md transition-all duration-500 hover:border-soft-cyan/30">
            {/* Top border glowing highlight */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-soft-cyan via-[#00B4D8] to-transparent opacity-50" />
            
            <div className="flex items-center justify-between">
              <span className="font-sans text-[9px] text-[#4CC9F0] tracking-widest uppercase font-bold">
                {active.badge}
              </span>
              <div className="w-2 h-2 rounded-full bg-soft-cyan animate-pulse shadow-[0_0_8px_#4cc9f0]" />
            </div>
            
            <div className="my-6 flex flex-col gap-2 items-center text-center transition-all duration-300">
              <span className="font-serif text-6xl font-black text-soft-cyan tracking-tight drop-shadow-[0_4px_12px_rgba(0,180,216,0.2)]">
                {active.year}
              </span>
              <span className="font-serif text-sm font-bold text-sea-foam tracking-wide mt-1">
                {active.title}
              </span>
              <p className="font-sans text-xs text-sea-foam/70 leading-relaxed mt-2 px-2">
                {active.detail}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 text-center">
              <p className="font-sans text-[9px] text-sea-foam/40 leading-normal">
                {active.desc}
              </p>
            </div>
          </div>

          {/* Interactive Milestone Scrubber Selector */}
          <div className="flex items-center gap-2 bg-[#030d14]/60 border border-white/5 p-1.5 rounded-xl shadow-xl">
            {milestones.map((milestone, idx) => (
              <button
                key={milestone.year}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 rounded-lg font-serif text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "bg-soft-cyan/15 text-soft-cyan border border-soft-cyan/35 shadow-[0_0_10px_rgba(76,201,240,0.1)]"
                    : "text-sea-foam/50 hover:text-sea-foam hover:bg-white/5 border border-transparent"
                }`}
              >
                {milestone.year}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Right Column: Historical Narrative */}
        <AnimatedSection delay={200} className="flex flex-col gap-6">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            02 / THE BASELINE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            The 1993 Baseline
          </h2>
          <p className="font-sans text-sm md:text-base text-sea-foam/80 leading-relaxed">
            In 1993, high-precision satellite altimetry began recording global sea levels, establishing a baseline of zero deviation.
          </p>
          <p className="font-sans text-sm md:text-base text-sea-foam/80 leading-relaxed">
            For generations, the shorelines of Fiji, Samoa, and Tuvalu had remained relatively stable, with seasonal tides gently sculpting the shores.
          </p>
          <p className="font-sans text-sm md:text-base text-sea-foam/70 italic leading-relaxed border-l-2 border-soft-cyan/30 pl-4">
            But beneath the surface, a thermodynamic shift was already underway. The oceans were absorbing over 90% of the excess heat trapped by greenhouse gas emissions, triggering a steady, irreversible thermal expansion.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
