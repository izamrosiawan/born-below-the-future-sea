"use client";

export default function GrowingUpSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#030d14]/30 px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full flex flex-col gap-16">
        
        {/* Intro Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Chapter 6 — Generational Shift
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            Growing Up With a Different Ocean
          </h2>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
            The change is measured in millimeters, but over a lifetime, those millimeters redraw maps, submerge ancestral graves, and shift families inland.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Parent (1993) Card */}
          <div className="relative overflow-hidden bg-deep-ocean/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between min-h-[380px] shadow-lg group hover:border-white/10 transition-all duration-300">
            {/* Soft Ocean Wave Indicator (Lower Level) */}
            <div className="absolute bottom-0 inset-x-0 h-1/4 bg-ocean-blue/20 border-t border-ocean-blue/40 pointer-events-none transition-all duration-300" />
            
            <div className="flex flex-col gap-4">
              <span className="font-serif text-3xl font-extrabold text-sea-foam/50">Parents (Born 1993)</span>
              <p className="font-sans text-sm text-sea-foam/75 leading-relaxed">
                When the parents of today were born in 1993, the tides behaved predictably. The sandy beaches they ran on as toddlers remained in place. Fresh groundwater wells in the village were clean, sweet, and unaffected by saltwater intrusion.
              </p>
            </div>
            
            <div className="z-10 mt-8">
              <span className="font-sans text-[10px] text-sea-foam/40 uppercase tracking-widest">Baseline Sea Level</span>
              <p className="font-serif text-4xl font-black text-sea-foam/70">0.0 mm</p>
            </div>
          </div>

          {/* Child (2024) Card */}
          <div className="relative overflow-hidden bg-deep-ocean/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-between min-h-[380px] shadow-lg hover:border-soft-cyan/20 transition-all duration-300">
            {/* High Ocean Wave Indicator (Higher Level) */}
            <div className="absolute bottom-0 inset-x-0 h-2/5 bg-deep-cyan/15 border-t border-soft-cyan/40 pointer-events-none transition-all duration-300" />
            
            <div className="flex flex-col gap-4">
              <span className="font-serif text-3xl font-extrabold text-soft-cyan">Litia (Born 2024)</span>
              <p className="font-sans text-sm text-sea-foam/75 leading-relaxed">
                Born in 2024, Litia inherits an ocean that has encroached over 11 centimeters further inland. Village wells are brackish, crops are failing from soil salinity, and high tide cycles bring water bubbling up through the floorboards of the lowest homes.
              </p>
            </div>
            
            <div className="z-10 mt-8">
              <span className="font-sans text-[10px] text-soft-cyan/60 uppercase tracking-widest">Ocean Level At Birth</span>
              <p className="font-serif text-4xl font-black text-soft-cyan">
                +111.6 mm
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
