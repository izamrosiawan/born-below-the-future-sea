import { getSeaLevelData } from "@/data/parser";
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

export default function Home() {
  const { raw, derived } = getSeaLevelData();

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
      <RankingSection top5={derived.top5Affected} bottom5={derived.top5LeastAffected} />
      <GrowingUpSection />
      <PacificMapSection data={raw} />
      <AnalyticsSection data={raw} regionalAverage={derived.regionalAverage} />
      <ReflectionSection />
    </main>
  );
}
