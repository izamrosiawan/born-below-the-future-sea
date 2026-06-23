"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { ProcessedCountryData } from "@/data/parser";

interface RankingChartProps {
  top5: ProcessedCountryData[];
  bottom5: ProcessedCountryData[];
}

export default function RankingChart({ top5, bottom5 }: RankingChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<"fastest" | "slowest">("fastest");

  useEffect(() => {
    if (!svgRef.current) return;

    const data = view === "fastest" ? top5 : bottom5;

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 80, bottom: 20, left: 160 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(top5, (d) => d.totalRise) || 0.15]) // fix domain based on top5 max so scales match
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.country))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // Bars drawing
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d) => yScale(d.country) || 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", view === "fastest" ? "url(#fastestGradient)" : "url(#slowestGradient)")
      .attr("rx", 4)
      .attr("width", 0) // animate start width
      .transition()
      .duration(800)
      .attr("width", (d) => xScale(d.totalRise) - margin.left);

    // Country labels
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", margin.left - 15)
      .attr("y", (d) => (yScale(d.country) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("fill", "#F5F7FA")
      .attr("class", "font-sans text-xs font-medium opacity-80")
      .text((d) => d.country);

    // Value labels
    svg
      .selectAll(".val-label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", margin.left)
      .attr("y", (d) => (yScale(d.country) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("fill", "#4CC9F0")
      .attr("class", "font-sans text-xs font-semibold")
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .attr("x", (d) => xScale(d.totalRise) + 10)
      .attr("opacity", 1)
      .text((d) => `+${(d.totalRise * 1000).toFixed(0)} mm`);

    // Add Gradients
    const defs = svg.append("defs");

    const fastestGrad = defs
      .append("linearGradient")
      .attr("id", "fastestGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    fastestGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0B3D5C");
    fastestGrad.append("stop").attr("offset", "100%").attr("stop-color", "#4CC9F0");

    const slowestGrad = defs
      .append("linearGradient")
      .attr("id", "slowestGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    slowestGrad.append("stop").attr("offset", "0%").attr("stop-color", "#061826");
    slowestGrad.append("stop").attr("offset", "100%").attr("stop-color", "#00B4D8");

  }, [view, top5, bottom5]);

  return (
    <div className="w-full flex flex-col items-center gap-6 bg-deep-ocean/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
      <div className="flex bg-[#030d14] p-1 rounded-full border border-white/5">
        <button
          onClick={() => setView("fastest")}
          className={`px-6 py-2 rounded-full font-serif text-sm transition-all duration-300 ${
            view === "fastest" ? "bg-ocean-blue text-sea-foam shadow-md" : "text-sea-foam/50 hover:text-sea-foam"
          }`}
        >
          Fastest Rise
        </button>
        <button
          onClick={() => setView("slowest")}
          className={`px-6 py-2 rounded-full font-serif text-sm transition-all duration-300 ${
            view === "slowest" ? "bg-ocean-blue text-sea-foam shadow-md" : "text-sea-foam/50 hover:text-sea-foam"
          }`}
        >
          Slowest Rise
        </button>
      </div>

      <div className="w-full h-[300px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
}
