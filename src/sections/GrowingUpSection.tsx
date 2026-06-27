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
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full flex flex-col gap-12">
        
        {/* Intro Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            05 / GENERATIONAL SHIFT
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            Growing Up With a Different Ocean
          </h2>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
            Use the slider to compare the Fijian shoreline at the start of the satellite record (1993) with the conditions Litia faces today (2024).
          </p>
        </div>

        {/* Visual Slider Container */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-ew-resize bg-[#030d14]"
        >
          {/* Base Layer: 1993 Parents Environment (Left Side) */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-start p-8 md:p-12">
            {/* Background artwork representation for 1993 */}
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 1000 400" preserveAspectRatio="none">
              {/* Healthy green island */}
              <path d="M 0 400 L 0 250 Q 200 230, 450 300 T 1000 260 L 1000 400 Z" fill="#0B3D5C" />
              {/* Wide sandy beach */}
              <path d="M 0 400 L 0 320 Q 300 290, 600 350 T 1000 330 L 1000 400 Z" fill="#E9C46A" opacity="0.6" />
              {/* Calm low sea */}
              <path d="M 0 400 L 0 360 Q 400 340, 800 375 T 1000 365 L 1000 400 Z" fill="#00B4D8" opacity="0.5" />
            </svg>
            
            <div className="z-10 max-w-sm flex flex-col gap-4 select-none">
              <span className="font-serif text-sm font-semibold text-sea-foam/50 uppercase tracking-widest">1993 (Baseline)</span>
              <h3 className="font-serif text-3xl font-bold text-sea-foam">Stable Shorelines</h3>
              <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
                Coastal villages enjoyed wide, sandy beaches. Healthy coastal vegetation stabilized the soil, and groundwater wells remained clean and free from saltwater.
              </p>
              <div className="mt-4">
                <span className="font-sans text-[9px] text-sea-foam/40 uppercase block">Baseline Level</span>
                <span className="font-serif text-2xl font-black text-sea-foam/60">0.0 mm</span>
              </div>
            </div>
          </div>

          {/* Masked Layer: 2024 Litia Environment (Right Side) */}
          <div 
            style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
            className="absolute inset-0 w-full h-full flex items-center justify-end p-8 md:p-12 bg-[#020b12]"
          >
            {/* Background artwork representation for 2024 */}
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 1000 400" preserveAspectRatio="none">
              {/* Eroded island */}
              <path d="M 0 400 L 0 270 Q 200 250, 450 320 T 1000 280 L 1000 400 Z" fill="#061826" />
              {/* Submerged sand line */}
              <path d="M 0 400 L 0 350 Q 300 330, 600 380 T 1000 360 L 1000 400 Z" fill="#D8B153" opacity="0.3" />
              {/* High rising sea */}
              <path d="M 0 400 L 0 330 Q 300 310, 700 345 T 1000 325 L 1000 400 Z" fill="#4CC9F0" opacity="0.6" />
            </svg>

            <div className="z-10 max-w-sm text-right flex flex-col gap-4 items-end select-none">
              <span className="font-serif text-sm font-semibold text-soft-cyan uppercase tracking-widest">2024 (Today)</span>
              <h3 className="font-serif text-3xl font-bold text-soft-cyan">Encroaching Tides</h3>
              <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
                Rising seas have steadily eaten away at the sandy shores. Coastal trees are dying from saltwater intrusion, which turns the soil brackish and ruins local food crops.
              </p>
              <div className="mt-4">
                <span className="font-sans text-[9px] text-soft-cyan/40 uppercase block">Sea Rise At Birth</span>
                <span className="font-serif text-2xl font-black text-soft-cyan">+111.6 mm</span>
              </div>
            </div>
          </div>

          {/* Interactive Divider Line */}
          <div 
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-soft-cyan/80 z-20 pointer-events-none"
          >
            {/* Handle Drag Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-soft-cyan text-deep-ocean border-2 border-white/20 shadow-lg flex items-center justify-center font-serif text-xs font-black select-none">
              ↔
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
