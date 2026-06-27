"use client";

import { useState, useEffect } from "react";
import { ProcessedCountryData } from "@/data/parser";
import OceanScene from "@/three/OceanScene";
import AudioToggle from "@/components/AudioToggle";
import HeroSection from "@/sections/HeroSection";
import LitiaSection from "@/sections/LitiaSection";
import OceanHistorySection from "@/sections/OceanHistorySection";
import TimelineSection from "@/sections/TimelineSection";
import RankingSection from "@/sections/RankingSection";
import GrowingUpSection from "@/sections/GrowingUpSection";
import PacificMapSection from "@/sections/PacificMapSection";
import AnalyticsSection from "@/sections/AnalyticsSection";
import ReflectionSection from "@/sections/ReflectionSection";

interface InteractiveAppProps {
  raw: ProcessedCountryData[];
  derived: {
    highestRise: ProcessedCountryData;
    lowestRise: ProcessedCountryData;
    top5Affected: ProcessedCountryData[];
    top5LeastAffected: ProcessedCountryData[];
    regionalAverage: { year: number; value: number }[];
  };
}

interface Chapter {
  id: string;
  label: string;
}

export default function InteractiveApp({ raw, derived }: InteractiveAppProps) {
  // Shared interactive states
  const [selectedCountryA, setSelectedCountryA] = useState<string>("Fiji");
  const [selectedCountryB, setSelectedCountryB] = useState<string>("Tuvalu");
  const [projectionYear, setProjectionYear] = useState<number>(2024);
  const [projectionScenario, setProjectionScenario] = useState<"low" | "high">("low");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sliderTimeout, setSliderTimeout] = useState<NodeJS.Timeout | null>(null);

  // Scrollytelling active chapter tracking state
  const [activeSection, setActiveSection] = useState<string>("hero");

  const chapters: Chapter[] = [
    { id: "hero", label: "01. Introduction" },
    { id: "litia", label: "02. Litia's Shoreline" },
    { id: "history", label: "03. The Baseline" },
    { id: "chronology", label: "04. Three Decades" },
    { id: "ranking", label: "05. Divergent Tides" },
    { id: "generational", label: "06. Shoreline Shift" },
    { id: "frontline", label: "07. Simulation Map" },
    { id: "analysis", label: "08. Data Ledger" },
    { id: "reflection", label: "09. The Decision" }
  ];

  // Simulation playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProjectionYear((prev) => {
          if (prev >= 2100) {
            return 1993; // loop back to baseline
          }
          return prev + 1;
        });
      }, 120);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const handleSliderChange = (year: number) => {
    setIsPlaying(false);
    setProjectionYear(year);
    if (sliderTimeout) clearTimeout(sliderTimeout);
    
    const timeout = setTimeout(() => {
      setIsPlaying(true);
    }, 1500);
    setSliderTimeout(timeout);
  };

  // Scroll listener to update active chapter indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (const chapter of chapters) {
        const el = document.getElementById(chapter.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(chapter.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial trigger
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative w-full text-sea-foam overflow-hidden">
      {/* Global 3D Ocean Background Canvas */}
      <OceanScene />

      {/* Immersive Client-side Ocean Wave Sound Synthesizer */}
      <AudioToggle />

      {/* FIXED SIDEBAR: Premium Scrollytelling Chapter Navigator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-5 bg-[#030d14]/40 border border-white/5 p-4 rounded-full backdrop-blur-md shadow-2xl">
        {chapters.map((chapter) => {
          const isActive = activeSection === chapter.id;
          return (
            <button
              key={chapter.id}
              onClick={() => scrollToSection(chapter.id)}
              className="group relative flex items-center justify-center w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-300"
              title={chapter.label}
            >
              {/* Tooltip Label */}
              <span className="absolute right-7 py-1.5 px-3 rounded-lg bg-[#030d14]/90 border border-white/10 text-[9px] text-sea-foam uppercase tracking-widest font-bold opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl">
                {chapter.label}
              </span>
              
              {/* Pulsing glow indicator dot */}
              <span 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "w-2.5 h-2.5 bg-soft-cyan shadow-[0_0_8px_#4cc9f0] scale-125" 
                    : "bg-sea-foam/30 group-hover:bg-sea-foam/60 group-hover:scale-110"
                }`}
              />
            </button>
          );
        })}
      </div>
      
      <div id="hero">
        <HeroSection />
      </div>
      
      <div id="litia">
        <LitiaSection />
      </div>
      
      <div id="history">
        <OceanHistorySection />
      </div>
      
      <div id="chronology">
        <TimelineSection data={raw} />
      </div>
      
      <div id="ranking">
        <RankingSection 
          top5={derived.top5Affected} 
          bottom5={derived.top5LeastAffected} 
        />
      </div>
      
      <div id="generational">
        <GrowingUpSection />
      </div>
      
      <div id="frontline">
        <PacificMapSection 
          data={raw}
          selectedCountryA={selectedCountryA}
          setSelectedCountryA={setSelectedCountryA}
          selectedCountryB={selectedCountryB}
          setSelectedCountryB={setSelectedCountryB}
          projectionYear={projectionYear}
          setProjectionYear={handleSliderChange}
          projectionScenario={projectionScenario}
          setProjectionScenario={setProjectionScenario}
        />
      </div>
      
      <div id="analysis">
        <AnalyticsSection 
          data={raw} 
          regionalAverage={derived.regionalAverage}
          selectedCountryA={selectedCountryA}
          setSelectedCountryA={setSelectedCountryA}
          selectedCountryB={selectedCountryB}
          setSelectedCountryB={setSelectedCountryB}
          projectionYear={projectionYear}
          projectionScenario={projectionScenario}
        />
      </div>
      
      <div id="reflection">
        <ReflectionSection />
      </div>
    </main>
  );
}
