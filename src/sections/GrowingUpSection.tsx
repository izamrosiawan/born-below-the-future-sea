"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";

export default function GrowingUpSection() {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.buttons === 1) { // dragging
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchStart = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none">
      <div className="max-w-5xl w-full flex flex-col gap-12">
        
        {/* Intro Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            GENERATIONAL SHIFT
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            Growing Up With a Different Ocean
          </h2>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
            Drag the glowing scrubber left and right to inspect how the Fijian coastline has changed between Litia's parents' childhood (1993) and the flooded shores she inherits today (2024).
          </p>
        </div>

        {/* Visual Slider Container */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-ew-resize bg-[#030d14] select-none"
        >
          {/* Base Layer: 1993 Parents Environment (Left Side) */}
          <div 
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            className="absolute -top-2 -bottom-2 left-0 right-0"
          >
            <img 
              src="/fiji_beach_1993.png" 
              alt="Fiji Shoreline in 1993"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030d14]/90 via-[#030d14]/40 to-transparent" />
            
            {/* Descriptive Content (1993) */}
            <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-10 max-w-xs md:max-w-sm flex flex-col gap-4 bg-[#030d14]/80 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-xl pointer-events-none">
              <span className="font-serif text-xs font-semibold text-sea-foam/50 uppercase tracking-widest">1993 (Baseline)</span>
              <h3 className="font-serif text-2xl font-bold text-sea-foam">Stable Shorelines</h3>
              <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
                Coastal villages enjoyed wide sandy beach barriers. Strong vegetation stabilized the shoreline, and groundwater wells remained clean, nourishing homes and crops.
              </p>
              <div className="mt-2 border-t border-white/10 pt-3">
                <span className="font-sans text-[8px] text-sea-foam/40 uppercase block font-bold">Relative Sea Level</span>
                <span className="font-serif text-2xl font-black text-sea-foam/60">0.0 mm</span>
              </div>
            </div>
          </div>

          {/* Masked Layer: 2024 Litia Environment (Right Side) */}
          <div 
            style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
            className="absolute -top-2 -bottom-2 left-0 right-0"
          >
            <img 
              src="/fiji_beach_2024.png" 
              alt="Fiji Shoreline in 2024"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#030d14]/90 via-[#030d14]/40 to-transparent" />

            {/* Descriptive Content (2024) */}
            <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-10 max-w-xs md:max-w-sm text-right flex flex-col gap-4 items-end bg-[#020b12]/80 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl pointer-events-none">
              <span className="font-serif text-xs font-semibold text-soft-cyan uppercase tracking-widest">2024 (Today)</span>
              <h3 className="font-serif text-2xl font-bold text-soft-cyan">Encroaching Tides</h3>
              <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
                Rising seas have aggressively swallowed the beaches. Salty groundwater kills coastal palms, ruins crops, and infiltrates drinking wells, threatening the village's very existence.
              </p>
              <div className="mt-2 border-t border-white/5 pt-3">
                <span className="font-sans text-[8px] text-soft-cyan/40 uppercase block font-bold">Sea Rise At Birth</span>
                <span className="font-serif text-2xl font-black text-soft-cyan">+111.6 mm</span>
              </div>
            </div>
          </div>

          {/* Interactive Divider Line (Neon Scantool Look) */}
          <div 
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-soft-cyan z-20 pointer-events-none shadow-[0_0_10px_#4cc9f0,0_0_20px_#00b4d8]"
          >
            {/* Handle Drag Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-soft-cyan text-deep-ocean border-2 border-white/40 shadow-[0_0_12px_rgba(76,201,240,0.6)] flex items-center justify-center font-bold select-none cursor-ew-resize hover:scale-105 active:scale-95 transition-transform duration-200">
              <svg className="w-4 h-4 text-[#030d14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
