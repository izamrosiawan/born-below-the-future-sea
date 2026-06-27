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
                03 / CHRONOLOGY
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-sea-foam mt-1">
                Three Decades of Change
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
                {year === 1993 && "Precision satellite altimetry begins, establishing a 0.0 mm reference baseline to launch a continuous global record of sea-level change."}
                {year > 1993 && year < 2000 && "Natural climate cycles show their influence. The severe 1997-1998 El Niño causes a temporary drop in Western Pacific sea levels, followed by a rapid rebound."}
                {year >= 2000 && year < 2010 && "Rising temperatures drive ocean thermal expansion. By the end of the decade, sea levels around Samoa and Tonga rise more than 40 mm above the baseline."}
                {year >= 2010 && year < 2020 && "The pace of sea-level rise quickens. High-tide flooding begins to regularly submerge coastal farmland and threaten vital freshwater lenses."}
                {year >= 2020 && "By 2024, Fiji registers a localized rise of 111.6 mm. The surrounding ocean is now visibly higher, warmer, and more volatile than the sea known by previous generations."}
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
