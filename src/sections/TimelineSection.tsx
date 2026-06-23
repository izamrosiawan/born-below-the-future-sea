"use client";

import { useState, useEffect, useRef } from "react";
import { ProcessedCountryData } from "@/data/parser";
import TimelineChart from "@/visualizations/TimelineChart";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

interface TimelineSectionProps {
  data: ProcessedCountryData[];
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const [year, setYear] = useState<number>(1993);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const countries = [
    "Fiji",
    "Samoa",
    "Tonga",
    "Tuvalu",
    "Kiribati",
    "Cook Islands",
    "American Samoa",
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    // Create a scroll trigger to scrub the year from 1993 to 2024
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // Scroll length
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const calculatedYear = Math.round(1993 + progress * (2024 - 1993));
          setYear(calculatedYear);
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-deep-ocean flex flex-col justify-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(0,180,216,0.15),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
        {/* Left Side: Pinned Chart & Live Counter */}
        <div ref={chartContainerRef} className="lg:col-span-8 flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
                Chapter 4 — The Great Accelerant
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-sea-foam mt-1">
                31 Years of Change
              </h2>
            </div>
            {/* Massive modern counter */}
            <div className="text-right">
              <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-widest block">Year</span>
              <span className="font-serif text-5xl font-black text-soft-cyan tracking-tight transition-all duration-300">
                {year}
              </span>
            </div>
          </div>

          <TimelineChart
            data={data}
            currentYear={year}
            selectedCountries={countries}
          />
        </div>

        {/* Right Side: Scroll-linked Narrative Cards */}
        <div className="lg:col-span-4 flex flex-col justify-center h-full relative pl-4 border-l border-white/5">
          <div className="flex flex-col gap-6 bg-[#030d14]/65 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl relative z-10 transition-all duration-500 hover:border-soft-cyan/20">
            <span className="font-sans text-[9px] text-soft-cyan uppercase tracking-widest font-semibold">
              Interactive Chronicle
            </span>
            <div className="min-h-[160px] flex flex-col justify-between">
              <p className="font-sans text-sm text-sea-foam/90 leading-relaxed transition-all duration-300">
                {year === 1993 && "Precision satellite altimetry begins. The Pacific waters sit calm at the 0.0mm reference baseline. A quiet before the shift."}
                {year > 1993 && year < 2000 && `Anomalies appear. The massive 1997-1998 El Niño triggers a temporary sea level depression in the West Pacific (like Tuvalu plunging to -200mm) before surging back.`}
                {year >= 2000 && year < 2010 && `Entering the 2000s, global warming accelerates thermal expansion. The rising lines of Samoa and Tonga creep past the 40mm mark.`}
                {year >= 2010 && year < 2020 && `The trend steepens. Mid-decade, rising sea levels are no longer a future threat—tides regularly inundate low-lying agricultural zones.`}
                {year >= 2020 && `Fiji reaches a staggering 111.6mm rise. The ocean Litia was born into in 2024 is physically taller, warmer, and more volatile.`}
              </p>

              <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                <span className="font-sans text-[10px] text-sea-foam/40 uppercase">Scroll to scrub timeline</span>
                <div className="flex gap-1.5">
                  <div className={`w-2 h-2 rounded-full transition-all ${year < 2000 ? "bg-soft-cyan scale-125" : "bg-white/10"}`} />
                  <div className={`w-2 h-2 rounded-full transition-all ${(year >= 2000 && year < 2010) ? "bg-soft-cyan scale-125" : "bg-white/10"}`} />
                  <div className={`w-2 h-2 rounded-full transition-all ${(year >= 2010 && year < 2020) ? "bg-soft-cyan scale-125" : "bg-white/10"}`} />
                  <div className={`w-2 h-2 rounded-full transition-all ${year >= 2020 ? "bg-soft-cyan scale-125" : "bg-white/10"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
