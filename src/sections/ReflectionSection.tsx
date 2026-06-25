"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function ReflectionSection() {
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<"none" | "relocate" | "stay">("none");
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
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
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 py-24 overflow-hidden bg-gradient-to-b from-[#061826] via-[#0b293d] to-[#140b03]">
      {/* Sunset Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(244,162,97,0.06)_0%,transparent_65%)] pointer-events-none" />

      {/* Spacer to push content down if needed, keeping layout balanced */}
      <div className="h-4" />

      {/* Cinematic Typography Sequence */}
      <div ref={ref} className="max-w-2xl flex flex-col gap-8 z-10 select-none my-auto">
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

      {/* Interactive Dilemma Section */}
      <div
        className={`w-full max-w-4xl mt-16 flex flex-col items-center gap-8 z-10 transition-all duration-1000 ${
          step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <div className="text-center max-w-xl flex flex-col gap-2">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            08 / THE DECISION
          </span>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-soft-cyan">
            Litia's Dilemma: An Unavoidable Future (2050)
          </h3>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
            By 2050, when Litia turns 26, local sea levels in Fiji are projected to rise by more than 200 mm. Her coastal community faces a stark, painful decision. Select a path below to explore the consequences.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
          {/* Relocate Option */}
          <button
            onClick={() => setSelectedChoice("relocate")}
            className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md select-none outline-none ${
              selectedChoice === "relocate"
                ? "border-soft-cyan bg-soft-cyan/10 shadow-[0_0_30px_rgba(0,180,216,0.15)]"
                : "border-white/15 bg-[#030d14]/40 hover:border-white/25 hover:bg-[#030d14]/60"
            }`}
          >
            <span className="font-serif text-[10px] font-semibold text-soft-cyan uppercase tracking-widest mb-2">Option A</span>
            <h4 className="font-serif text-base font-bold text-sea-foam mb-2">Relocation</h4>
            <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
              Displacing from Fiji to seek residency in New Zealand or Australia as climate migrants, securing physical safety.
            </p>
          </button>

          {/* Stay Option */}
          <button
            onClick={() => setSelectedChoice("stay")}
            className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md select-none outline-none ${
              selectedChoice === "stay"
                ? "border-soft-cyan bg-soft-cyan/10 shadow-[0_0_30px_rgba(0,180,216,0.15)]"
                : "border-white/15 bg-[#030d14]/40 hover:border-white/25 hover:bg-[#030d14]/60"
            }`}
          >
            <span className="font-serif text-[10px] font-semibold text-soft-cyan uppercase tracking-widest mb-2">Option B</span>
            <h4 className="font-serif text-base font-bold text-sea-foam mb-2">Adaptation</h4>
            <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
              Remaining on ancestral land, building sea walls, planting mangrove buffers, and adapting to a volatile shoreline.
            </p>
          </button>
        </div>

        {/* Detailed Narrative Reveal */}
        <div className="relative w-full max-w-3xl min-h-[140px] mt-2 transition-all duration-500">
          {selectedChoice === "relocate" && (
            <div className="p-6 rounded-2xl border border-white/5 bg-[#030d14]/60 backdrop-blur-md flex flex-col gap-2 text-left transition-all duration-500">
              <span className="font-serif text-xs font-semibold text-soft-cyan uppercase tracking-wider">
                "Losing the Land, Securing Survival"
              </span>
              <p className="font-sans text-xs md:text-sm text-sea-foam/80 leading-relaxed">
                Litia and her family pack their lives into suitcases and migrate to a foreign nation. While they are physically safe on higher ground, their spiritual connection to the *Vanua* (ancestral land) is severed. The graves of their ancestors are permanently submerged, and their cultural traditions slowly fade as they assimilate into a new society.
              </p>
            </div>
          )}

          {selectedChoice === "stay" && (
            <div className="p-6 rounded-2xl border border-white/5 bg-[#030d14]/60 backdrop-blur-md flex flex-col gap-2 text-left transition-all duration-500">
              <span className="font-serif text-xs font-semibold text-soft-cyan uppercase tracking-wider">
                "Rooted in the Rising Tide"
              </span>
              <p className="font-sans text-xs md:text-sm text-sea-foam/80 leading-relaxed">
                Litia chooses to stay. Alongside her village, she helps raise homes on wooden stilts, plant mangrove buffers to slow erosion, and fortify the shoreline. Their language, customs, and community bonds remain intact. However, they remain highly vulnerable to intense cyclonic storms, and their freshwater wells grow increasingly brackish.
              </p>
            </div>
          )}

          {selectedChoice === "none" && (
            <div className="flex items-center justify-center p-8 border border-white/10 border-dashed rounded-2xl bg-[#030d14]/25 h-[120px]">
              <p className="font-sans text-xs md:text-sm text-sea-foam/40 italic">
                Select a path above to explore the consequences of Litia's future...
              </p>
            </div>
          )}
        </div>

        {/* Final Resolution (fades in once a choice is clicked) */}
        <div
          className={`w-full max-w-2xl text-center flex flex-col items-center gap-4 border-t border-white/10 pt-8 mt-4 transition-all duration-700 ${
            selectedChoice !== "none" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden"
          }`}
        >
          <h4 className="font-serif text-base md:text-lg font-bold text-soft-cyan">
            Conclusion: The Choice to Fight
          </h4>
          <p className="font-sans text-xs md:text-sm text-sea-foam/80 leading-relaxed">
            For indigenous Pacific Islanders, separating from their land is a form of cultural erasure. Consequently, many coastal communities choose to stay, adapt, and defend their homes. They do not view themselves as passive victims of a changing climate; they are active guardians on the front lines of resilience.
          </p>
          <div className="font-sans text-xs text-soft-cyan/90 italic leading-relaxed max-w-lg border-l-2 border-soft-cyan/30 pl-4 text-left mt-2 bg-[#030d14]/30 py-2 pr-2 rounded-r-lg">
            "We are not drowning, we are fighting. But our resilience must not be used as an excuse for global inaction."
          </div>
        </div>
      </div>

      {/* Premium Credits & Source Footer */}
      <footer
        className={`w-full max-w-5xl mt-24 border-t border-white/10 pt-12 pb-2 flex flex-col md:flex-row gap-8 justify-between items-center z-10 transition-all duration-1000 ${
          step >= 4 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-sans text-[9px] text-soft-cyan uppercase tracking-widest font-semibold">
            Project Credits
          </span>
          <p className="font-serif text-sm text-sea-foam font-bold">
            Pacific DataViz Challenge: Built for the Future of Oceania
          </p>
          <p className="font-sans text-[11px] text-sea-foam/60 leading-relaxed max-w-md">
            Developed by <strong className="text-soft-cyan font-semibold">Team Pacific Guardians</strong> as an interactive data visualization platform for global climate advocacy.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
          <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-wider">
            Official Data Source
          </span>
          <a
            href="https://pacificdata.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-soft-cyan/20 bg-soft-cyan/5 hover:bg-soft-cyan/15 hover:border-soft-cyan/40 text-soft-cyan hover:text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,180,216,0.03)] hover:shadow-[0_0_20px_rgba(0,180,216,0.15)] backdrop-blur-sm"
          >
            <span>Open Pacific Data Hub</span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
      </footer>
    </section>
  );
}
