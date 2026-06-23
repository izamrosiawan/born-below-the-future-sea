"use client";

import { ProcessedCountryData } from "@/data/parser";
import PacificMap from "@/components/Map/PacificMap";
import AnimatedSection from "@/components/AnimatedSection";

interface PacificMapSectionProps {
  data: ProcessedCountryData[];
}

export default function PacificMapSection({ data }: PacificMapSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full flex flex-col gap-10">
        
        {/* Header */}
        <AnimatedSection className="flex flex-col gap-2 max-w-2xl">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Chapter 7 — Geographic Footprint
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            The Pacific Frontline
          </h2>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
            The Pacific Ocean is home to thousands of islands, separated by vast distances but united by the rising water. Hover over any nation below to inspect the localized trends.
          </p>
        </AnimatedSection>

        {/* Map visualization component */}
        <AnimatedSection delay={200} className="w-full">
          <PacificMap data={data} />
        </AnimatedSection>

      </div>
    </section>
  );
}
