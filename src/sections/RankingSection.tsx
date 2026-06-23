"use client";

import { ProcessedCountryData } from "@/data/parser";
import RankingChart from "@/visualizations/RankingChart";

interface RankingSectionProps {
  top5: ProcessedCountryData[];
  bottom5: ProcessedCountryData[];
}

export default function RankingSection({ top5, bottom5 }: RankingSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-deep-ocean px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Narrative */}
        <div className="flex flex-col gap-6">
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
        </div>

        {/* Dynamic D3 Ranking Chart */}
        <div className="w-full">
          <RankingChart top5={top5} bottom5={bottom5} />
        </div>
      </div>
    </section>
  );
}
