"use client";

import AnimatedSection from "@/components/AnimatedSection";

export default function LitiaSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Narrative text */}
        <AnimatedSection className="flex flex-col gap-6 order-2 md:order-1">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Chapter 2 — The First Wave
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            Meet Litia
          </h2>
          <p className="font-sans text-sm md:text-base text-sea-foam/80 leading-relaxed">
            In 2024, a baby girl named **Litia** was born in a small coastal village in Fiji. She does not understand climate change. She does not know about global temperature rises, thermal expansion, or polar ice caps melting.
          </p>
          <p className="font-sans text-sm md:text-base text-sea-foam/80 leading-relaxed">
            To Litia, the ocean is simply a giant, comforting presence just yards from her home. It is where her parents gather food, where her elders tell stories, and where the sound of crashing waves lulls her to sleep every night.
          </p>
          <p className="font-sans text-sm md:text-base text-sea-foam/70 italic leading-relaxed border-l-2 border-soft-cyan/30 pl-4">
            But the ocean Litia was born into is not the same ocean her parents took their first steps in. By the time she grows up, it will be different still.
          </p>
        </AnimatedSection>

        {/* Proper Illustration representing Litia & Ocean */}
        <AnimatedSection delay={200} className="flex justify-center order-1 md:order-2">
          <div className="group relative w-full max-w-[340px] aspect-[4/5] rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a1e2f]/80 to-[#030d14]/90 p-4 flex flex-col justify-between shadow-[0_0_40px_rgba(0,180,216,0.1)] hover:shadow-[0_0_50px_rgba(0,180,216,0.2)] transition-all duration-700 overflow-hidden backdrop-blur-md">
            {/* Soft Ambient Radial Glow behind the card */}
            <div className="absolute -inset-px bg-gradient-to-b from-soft-cyan/20 to-transparent rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
            
            {/* Image Container */}
            <div className="relative w-full h-[85%] rounded-xl overflow-hidden border border-white/5 bg-[#030d14]">
              {/* Ken Burns zoom animation on hover */}
              <img 
                src="/litia_illustration.png" 
                alt="Litia standing on the shores of Fiji" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[5000ms] ease-out"
              />
              {/* Deep ocean blue gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030d14] via-transparent to-transparent opacity-65" />
            </div>

            {/* Subtle Title and Caption */}
            <div className="z-10 flex flex-col gap-0.5 px-1 mt-2">
              <span className="font-serif text-xs font-semibold text-soft-cyan uppercase tracking-widest">
                Litia
              </span>
              <span className="font-sans text-[9px] text-sea-foam/50 uppercase tracking-wider">
                Fiji Islands, 2024
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
