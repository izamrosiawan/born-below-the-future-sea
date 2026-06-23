"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function ReflectionSection() {
  const [step, setStep] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.15,
  });

  // Slow text sequencing for a cinematic documentary experience
  useEffect(() => {
    if (!isIntersecting) return;

    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 4000),
      setTimeout(() => setStep(3), 7000),
      setTimeout(() => setStep(4), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isIntersecting]);

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-gradient-to-b from-[#061826] via-[#0b293d] to-[#140b03]">
      {/* Sunset Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(244,162,97,0.08)_0%,transparent_60%)] pointer-events-none" />

      {/* Cinematic Typography Sequence */}
      <div ref={ref} className="max-w-2xl flex flex-col gap-8 z-10 select-none">
        <p
          className={`font-serif text-xl md:text-2xl lg:text-3xl italic text-sea-foam transition-all duration-1000 ${
            step >= 1 ? "opacity-90 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
          }`}
        >
          "The ocean rises a few millimeters every year."
        </p>

        <p
          className={`font-serif text-xl md:text-2xl lg:text-3xl italic text-sea-foam transition-all duration-1000 ${
            step >= 2 ? "opacity-90 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
          }`}
        >
          For a child born today, <br />
          that sounds small.
        </p>

        <p
          className={`font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-soft-cyan transition-all duration-1500 ${
            step >= 3 ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
          }`}
        >
          Until those millimeters <br />
          become a lifetime.
        </p>
      </div>

      {/* Final End Frame Credits Overlay */}
      <div
        className={`absolute bottom-12 font-sans text-[9px] uppercase tracking-widest text-sea-foam/30 transition-opacity duration-1000 ${
          step >= 4 ? "opacity-100" : "opacity-0"
        }`}
      >
        Pacific DataViz Challenge — Built for the Future of Oceania
      </div>
    </section>
  );
}
