"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-between items-center text-center px-6 overflow-hidden bg-transparent">
      {/* Floating Island Silhouette Accent */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-deep-ocean to-transparent pointer-events-none z-0" />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-4xl z-10 select-none px-4">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-sea-foam tracking-tight leading-tight uppercase animate-fade-in drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          Born Below the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-cyan to-soft-cyan">
            Future Sea
          </span>
        </h1>
        <p className="font-sans text-sm md:text-lg lg:text-xl font-light text-sea-foam/85 tracking-widest uppercase mt-6 max-w-2xl leading-relaxed">
          A child born in the Pacific today will inherit a different ocean tomorrow.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="pb-12 z-10 flex flex-col items-center gap-2">
        <span className="font-sans text-[10px] text-sea-foam/40 tracking-widest uppercase">
          Scroll to Begin
        </span>
        <div className="w-5 h-8 border border-sea-foam/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-soft-cyan rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
