"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { ProcessedCountryData } from "@/data/parser";

interface TimelineChartProps {
  data: ProcessedCountryData[];
  currentYear: number;
  selectedCountries: string[];
}

export default function TimelineChart({
  data,
  currentYear,
  selectedCountries,
}: TimelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const filteredData = useMemo(() => {
    return data.filter((c) => selectedCountries.includes(c.country));
  }, [data, selectedCountries]);

  const colors: { [key: string]: string } = {
    Fiji: "#00B4D8",
    Samoa: "#4CC9F0",
    Tonga: "#F5F7FA",
    Tuvalu: "#E63946",
    Kiribati: "#F4A261",
    "Cook Islands": "#2A9D8F",
    "American Samoa": "#9B5DE5",
  };

  const activeStats = useMemo(() => {
    return filteredData.map((c) => {
      const yearData = c.data.find((d) => d.year === currentYear);
      return {
        country: c.country,
        value: yearData ? yearData.value : 0,
        color: colors[c.country] || "#00B4D8",
      };
    }).sort((a, b) => b.value - a.value);
  }, [filteredData, currentYear]);

  // Dimensions
  const width = 800;
  const height = 360;
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };

  // 1. Initialize static chart elements (Runs once on mount)
  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // initial clear

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    // Combine all points to find min/max values
    const allPoints = filteredData.flatMap((c) => c.data);
    const minVal = d3.min(allPoints, (d) => d.value) || -0.22;
    const maxVal = d3.max(allPoints, (d) => d.value) || 0.22;

    const xScale = d3.scaleLinear().domain([1993, 2024]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([minVal - 0.02, maxVal + 0.02]).range([height - margin.bottom, margin.top]);

    // Filters definition
    const defs = svg.append("defs");
    filteredData.forEach((c) => {
      const filter = defs
        .append("filter")
        .attr("id", `glow-${c.country.replace(/\s+/g, "-")}`)
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");

      filter.append("feGaussianBlur").attr("stdDeviation", 3).attr("result", "blur");
      filter.append("feMerge").call((merge) => {
        merge.append("feMergeNode").attr("in", "blur");
        merge.append("feMergeNode").attr("in", "SourceGraphic");
      });
    });

    // Subtly colored horizontal/vertical grids
    svg
      .append("g")
      .attr("class", "grid opacity-[0.03]")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSize(-height + margin.top + margin.bottom).tickFormat(() => ""));

    svg
      .append("g")
      .attr("class", "grid opacity-[0.03]")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickSize(-width + margin.left + margin.right).tickFormat(() => ""));

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${(Number(d) * 1000).toFixed(0)}mm`);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .attr("class", "text-sea-foam/30 font-sans text-[10px]")
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "rgba(245,247,250,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(245,247,250,0.1)"));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .attr("class", "text-sea-foam/30 font-sans text-[10px]")
      .call(yAxis)
      .call((g) => g.select(".domain").attr("stroke", "rgba(245,247,250,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(245,247,250,0.1)"));

    // Zero baseline
    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", yScale(0))
      .attr("x2", width - margin.right)
      .attr("y2", yScale(0))
      .attr("stroke", "rgba(245,247,250,0.15)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2 2");

    // Dynamic elements container
    const chartContainer = svg.append("g").attr("class", "chart-lines-container");
    filteredData.forEach((c) => {
      chartContainer
        .append("path")
        .attr("class", `line-path-${c.country.replace(/\s+/g, "-")}`)
        .attr("fill", "none")
        .attr("stroke", colors[c.country] || "#00B4D8")
        .attr("stroke-width", 2)
        .attr("filter", `url(#glow-${c.country.replace(/\s+/g, "-")})`)
        .attr("opacity", 0.85);
    });

    // Vertical Year Indicator
    svg
      .append("line")
      .attr("class", "timeline-indicator-line")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#4CC9F0")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3 3")
      .attr("opacity", 0.4);

  }, [filteredData]);

  // 2. Perform Dynamic Updates (Smooth X coordinate updates without rebuilding DOM tree!)
  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    const allPoints = filteredData.flatMap((c) => c.data);
    const minVal = d3.min(allPoints, (d) => d.value) || -0.22;
    const maxVal = d3.max(allPoints, (d) => d.value) || 0.22;

    const xScale = d3.scaleLinear().domain([1993, 2024]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([minVal - 0.02, maxVal + 0.02]).range([height - margin.bottom, margin.top]);

    const lineGen = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Update lines paths dynamically (buttery smooth coordinates interpolation!)
    filteredData.forEach((c) => {
      const activeData = c.data.filter((d) => d.year <= currentYear);
      svg
        .select(`.line-path-${c.country.replace(/\s+/g, "-")}`)
        .datum(activeData)
        .attr("d", lineGen);
    });

    // Update vertical indicator position
    svg.select(".timeline-indicator-line")
      .attr("x1", xScale(currentYear))
      .attr("x2", xScale(currentYear));

  }, [filteredData, currentYear]);

  return (
    <div className="relative w-full flex flex-col gap-4 bg-[#030d14]/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl">
      <div className="w-full h-[360px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Grid Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-4 border-t border-white/5">
        {activeStats.map((stat) => (
          <div key={stat.country} className="flex flex-col gap-1 border-l border-white/10 pl-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
              <span className="font-sans text-[10px] text-sea-foam/50 truncate max-w-[90px]">{stat.country}</span>
            </div>
            <span className="font-serif text-sm font-bold text-sea-foam tracking-tight">
              {stat.value >= 0 ? "+" : ""}
              {(stat.value * 1000).toFixed(0)}mm
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
