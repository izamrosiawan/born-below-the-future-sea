"use client";

import AnimatedSection from "@/components/AnimatedSection";

export default function OceanHistorySection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Data Context Visual */}
        <AnimatedSection className="flex justify-center">
          <div className="relative w-full max-w-[320px] aspect-square rounded-lg border border-white/5 bg-[#030d14]/40 p-6 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] text-sea-foam/40 tracking-widest uppercase">
                Satellite Altimetry
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-soft-cyan animate-pulse" />
            </div>
            
            <div className="my-auto flex flex-col gap-2 items-center text-center">
              <span className="font-serif text-6xl font-black text-soft-cyan tracking-tight">
                1993
              </span>
              <span className="font-sans text-xs text-sea-foam/60 tracking-wider uppercase">
                The Global Baseline Year
              </span>
            </div>

            <div className="border-t border-white/10 pt-4 text-center">
              <p className="font-sans text-[10px] text-sea-foam/40 leading-normal">
                Standard reference point zero for all modern sea-level rise observations.
              </p>
            </div>
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
