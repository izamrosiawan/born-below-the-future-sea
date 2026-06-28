"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ProcessedCountryData } from "@/data/parser";

const OceanScene = dynamic(() => import("@/three/OceanScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-full h-full -z-20 bg-gradient-to-b from-[#030d14] via-[#061826] to-[#030d14]" />
  ),
});

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
    { id: "hero", label: "Introduction" },
    { id: "litia", label: "Litia's Shoreline" },
    { id: "history", label: "The Baseline" },
    { id: "chronology", label: "Three Decades of Change" },
    { id: "ranking", label: "Divergent Tides" },
    { id: "generational", label: "Shoreline Shift" },
    { id: "frontline", label: "Simulation Map" },
    { id: "analysis", label: "Data Ledger" },
    { id: "reflection", label: "The Decision" }
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

  // Memoize static scrollytelling sections to prevent unnecessary React re-renders during simulation ticks
  const memoizedHero = useMemo(() => <HeroSection />, []);
  const memoizedLitia = useMemo(() => <LitiaSection />, []);
  const memoizedHistory = useMemo(() => <OceanHistorySection />, []);
  const memoizedTimeline = useMemo(() => <TimelineSection data={raw} />, [raw]);
  const memoizedRanking = useMemo(() => (
    <RankingSection 
      top5={derived.top5Affected} 
      bottom5={derived.top5LeastAffected} 
    />
  ), [derived.top5Affected, derived.top5LeastAffected]);
  const memoizedGenerational = useMemo(() => <GrowingUpSection />, []);
  const memoizedReflection = useMemo(() => <ReflectionSection />, []);

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
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-5 bg-[#030d14]/45 border border-white/5 p-4 rounded-full backdrop-blur-md shadow-2xl">
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
                    ? "w-2.5 h-2.5 bg-[#E63946] shadow-[0_0_8px_#E63946] scale-125" 
                    : "bg-sea-foam/30 group-hover:bg-sea-foam/60 group-hover:scale-110"
                }`}
              />
            </button>
          );
        })}
      </div>
      
      <div id="hero">
        {memoizedHero}
      </div>
      
      <div id="litia">
        {memoizedLitia}
      </div>
      
      <div id="history">
        {memoizedHistory}
      </div>
      
      <div id="chronology">
        {memoizedTimeline}
      </div>
      
      <div id="ranking">
        {memoizedRanking}
      </div>
      
      <div id="generational">
        {memoizedGenerational}
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
        {memoizedReflection}
      </div>
    </main>
  );
}
