"use client";

import { useState } from "react";
import { ProcessedCountryData } from "@/data/parser";
import RankingChart from "@/visualizations/RankingChart";
import AnimatedSection from "@/components/AnimatedSection";

interface RankingSectionProps {
  top5: ProcessedCountryData[];
  bottom5: ProcessedCountryData[];
}

export default function RankingSection({ top5, bottom5 }: RankingSectionProps) {
  const [view, setView] = useState<"fastest" | "slowest">("fastest");

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Narrative */}
        <AnimatedSection className="flex flex-col gap-6">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Chapter 5 — Unequal Waters
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            Not All Islands Change Equally
          </h2>
          <p className="font-sans text-sm md:text-base text-sea-foam/80 leading-relaxed">
            The ocean is not a flat bathtub. Due to earth's rotation, gravitational pull, ocean currents, and wind patterns, water accumulates unevenly. 
          </p>
          <p className="font-sans text-sm md:text-base text-sea-foam/80 leading-relaxed">
            Some island groups are experiencing sea level rise at double or triple the global average. Islands like the **Solomon Islands** and **Niue** are at the absolute frontline, while others like the **Northern Mariana Islands** face slower changes.
          </p>
          <p className="font-sans text-sm md:text-base text-sea-foam/70 italic leading-relaxed border-l-2 border-soft-cyan/30 pl-4">
            Understanding this disparity is crucial. It means resource allocation, migration planning, and climate adaptation must be tailored, island by island.
          </p>
        </AnimatedSection>

        {/* Dynamic D3 Ranking Chart container */}
        <AnimatedSection delay={200} className="w-full flex flex-col items-center gap-6 bg-deep-ocean/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl">
          {/* Toggle button */}
          <div className="flex bg-[#030d14] p-1 rounded-full border border-white/10">
            <button
              onClick={() => setView("fastest")}
              className={`px-6 py-2 rounded-full font-serif text-sm transition-all duration-300 cursor-pointer ${
                view === "fastest" ? "bg-ocean-blue text-sea-foam shadow-md" : "text-sea-foam/50 hover:text-sea-foam"
              }`}
            >
              Fastest Rise
            </button>
            <button
              onClick={() => setView("slowest")}
              className={`px-6 py-2 rounded-full font-serif text-sm transition-all duration-300 cursor-pointer ${
                view === "slowest" ? "bg-ocean-blue text-sea-foam shadow-md" : "text-sea-foam/50 hover:text-sea-foam"
              }`}
            >
              Slowest Rise
            </button>
          </div>

          {/* Optimized Chart */}
          <RankingChart top5={top5} bottom5={bottom5} view={view} />
        </AnimatedSection>
      </div>
    </section>
  );
}
