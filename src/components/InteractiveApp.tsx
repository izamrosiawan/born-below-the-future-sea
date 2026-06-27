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

export default function InteractiveApp({ raw, derived }: InteractiveAppProps) {
  // Shared interactive states
  const [selectedCountryA, setSelectedCountryA] = useState<string>("Fiji");
  const [selectedCountryB, setSelectedCountryB] = useState<string>("Tuvalu");
  const [projectionYear, setProjectionYear] = useState<number>(2024);
  const [projectionScenario, setProjectionScenario] = useState<"low" | "high">("low");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sliderTimeout, setSliderTimeout] = useState<NodeJS.Timeout | null>(null);

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

  return (
    <main className="relative w-full text-sea-foam overflow-hidden">
      {/* Global 3D Ocean Background Canvas */}
      <OceanScene />

      {/* Immersive Client-side Ocean Wave Sound Synthesizer */}
      <AudioToggle />
      
      <HeroSection />
      <LitiaSection />
      <OceanHistorySection />
      
      <TimelineSection data={raw} />
      
      <RankingSection 
        top5={derived.top5Affected} 
        bottom5={derived.top5LeastAffected} 
      />
      
      <GrowingUpSection />
      
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
      
      <ReflectionSection />
    </main>
  );
}
