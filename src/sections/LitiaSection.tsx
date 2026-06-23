"use client";

export default function LitiaSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-deep-ocean px-6 py-24 select-none">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Narrative text */}
        <div className="flex flex-col gap-6 order-2 md:order-1">
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
        </div>

        {/* Minimalist Illustration representing Litia & Ocean */}
        <div className="flex justify-center order-1 md:order-2">
          <div className="relative w-full max-w-[320px] aspect-square rounded-full border border-white/5 bg-[#030d14]/40 p-8 flex items-center justify-center shadow-inner">
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-full border border-soft-cyan/10 animate-ping opacity-25" />

            <svg viewBox="0 0 200 200" className="w-full h-full text-soft-cyan">
              {/* Starry background */}
              <circle cx="50" cy="40" r="1.5" fill="#F5F7FA" opacity="0.4" />
              <circle cx="160" cy="50" r="1" fill="#F5F7FA" opacity="0.3" />
              <circle cx="120" cy="30" r="1.2" fill="#F5F7FA" opacity="0.5" />

              {/* Minimal Wave Silhouettes */}
              <path
                d="M 10 140 Q 50 120, 100 140 T 190 140"
                fill="none"
                stroke="#00B4D8"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 10 150 Q 50 135, 100 150 T 190 150"
                fill="none"
                stroke="#4CC9F0"
                strokeWidth="2.5"
                opacity="0.6"
              />
              <path
                d="M 10 160 Q 50 148, 100 160 T 190 160"
                fill="none"
                stroke="#F5F7FA"
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* Simple island silhouette */}
              <path
                d="M 20 142 Q 60 110, 100 142"
                fill="#0B3D5C"
                opacity="0.9"
              />

              {/* Litia Silhouette Symbol (Tiny boat/child icon) */}
              <circle cx="100" cy="115" r="4" fill="#F5F7FA" />
              <path d="M 97 122 L 103 122 L 100 119 Z" fill="#F5F7FA" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
