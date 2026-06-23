"use client";

import { ProcessedCountryData } from "@/data/parser";
import TrendChart from "@/visualizations/TrendChart";
import CountryComparisonChart from "@/visualizations/CountryComparisonChart";

interface AnalyticsSectionProps {
  data: ProcessedCountryData[];
  regionalAverage: { year: number; value: number }[];
}

export default function AnalyticsSection({
  data,
  regionalAverage,
}: AnalyticsSectionProps) {
  return (
    <section className="relative w-full min-h-screen bg-[#030d14]/30 px-6 py-24 select-none border-b border-white/5">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Chapter 8 — Scientific Ledger
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-sea-foam">
            The Data Behind The Story
          </h2>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 max-w-3xl leading-relaxed">
            Examine the scientific records compiled by satellite altimetry. These detailed graphs show the long-term regional average acceleration of the ocean, followed by a comparison tool that contrasts the histories of different islands.
          </p>
        </div>

        {/* Stacked Layout for Full-Width Immersive Experience */}
        <div className="flex flex-col gap-12 w-full">
          <TrendChart regionalAverage={regionalAverage} />
          <CountryComparisonChart data={data} />
        </div>

      </div>
    </section>
  );
}
