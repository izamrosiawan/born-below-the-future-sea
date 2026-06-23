"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { ProcessedCountryData } from "@/data/parser";

interface RankingChartProps {
  top5: ProcessedCountryData[];
  bottom5: ProcessedCountryData[];
  view: "fastest" | "slowest";
}

export default function RankingChart({ top5, bottom5, view }: RankingChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Layout metrics
  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 80, bottom: 20, left: 160 };

  // Mount background gradients and setup static elements
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    const defs = svg.append("defs");
    
    // Gradient definitions
    const fastestGrad = defs
      .append("linearGradient")
      .attr("id", "fastestGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    fastestGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0B3D5C");
    fastestGrad.append("stop").attr("offset", "100%").attr("stop-color", "#4CC9F0");

    const slowestGrad = defs
      .append("linearGradient")
      .attr("id", "slowestGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    slowestGrad.append("stop").attr("offset", "0%").attr("stop-color", "#061826");
    slowestGrad.append("stop").attr("offset", "100%").attr("stop-color", "#00B4D8");

    // Pre-create container nodes
    svg.append("g").attr("class", "bars-container");
    svg.append("g").attr("class", "labels-container");
    svg.append("g").attr("class", "values-container");

  }, []);

  // Update elements on view state change with smooth D3 transitions (resolves lag/flicker)
  useEffect(() => {
    if (!svgRef.current) return;

    const data = view === "fastest" ? top5 : bottom5;
    const svg = d3.select(svgRef.current);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(top5, (d) => d.totalRise) || 0.15])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.country))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // 1. D3 Data Join for BARS
    const bars = svg.select(".bars-container").selectAll("rect").data(data, (d: any) => d.country);

    // EXIT old bars smoothly
    bars.exit()
      .transition()
      .duration(400)
      .attr("width", 0)
      .remove();

    // ENTER new bars
    const barsEnter = bars.enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", (d) => yScale(d.country) || 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", view === "fastest" ? "url(#fastestGradient)" : "url(#slowestGradient)")
      .attr("rx", 4)
      .attr("width", 0);

    // UPDATE + ENTER transition
    barsEnter.merge(bars as any)
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => yScale(d.country) || 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", view === "fastest" ? "url(#fastestGradient)" : "url(#slowestGradient)")
      .attr("width", (d) => xScale(d.totalRise) - margin.left);

    // 2. D3 Data Join for COUNTRY LABELS
    const labels = svg.select(".labels-container").selectAll("text").data(data, (d: any) => d.country);

    labels.exit().transition().duration(400).style("opacity", 0).remove();

    const labelsEnter = labels.enter()
      .append("text")
      .attr("x", margin.left - 15)
      .attr("y", (d) => (yScale(d.country) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("fill", "#F5F7FA")
      .attr("class", "font-sans text-xs font-medium")
      .style("opacity", 0);

    labelsEnter.merge(labels as any)
      .transition()
      .duration(500)
      .style("opacity", 0.8)
      .attr("y", (d) => (yScale(d.country) || 0) + yScale.bandwidth() / 2 + 4);

    // 3. D3 Data Join for VALUES TEXT
    const valuesText = svg.select(".values-container").selectAll("text").data(data, (d: any) => d.country);

    valuesText.exit().transition().duration(400).style("opacity", 0).remove();

    const valuesEnter = valuesText.enter()
      .append("text")
      .attr("x", margin.left)
      .attr("y", (d) => (yScale(d.country) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("fill", "#4CC9F0")
      .attr("class", "font-sans text-xs font-semibold")
      .style("opacity", 0);

    valuesEnter.merge(valuesText as any)
      .text((d) => `+${(d.totalRise * 1000).toFixed(0)} mm`)
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr("x", (d) => xScale(d.totalRise) + 10)
      .attr("y", (d) => (yScale(d.country) || 0) + yScale.bandwidth() / 2 + 4)
      .style("opacity", 1);

  }, [view, top5, bottom5]);

  return (
    <div className="w-full h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
