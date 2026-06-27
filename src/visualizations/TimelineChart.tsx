"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { ProcessedCountryData } from "@/data/parser";

interface TimelineChartProps {
  data: ProcessedCountryData[];
  currentYear: number;
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
}

export default function TimelineChart({
  data,
  currentYear,
  selectedCountries,
  onToggleCountry,
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
      const yearData = c.data.find((d) => d.year == currentYear);
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
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // initial clear

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    // Combine all points of all potential countries to lock Y axis domain and prevent jumping
    const allPotentialData = data.filter((c) => Object.keys(colors).includes(c.country));
    const allPoints = allPotentialData.flatMap((c) => c.data);
    const minVal = d3.min(allPoints, (d) => d.value) || -0.22;
    const maxVal = d3.max(allPoints, (d) => d.value) || 0.22;

    const xScale = d3.scaleLinear().domain([1993, 2024]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([minVal - 0.02, maxVal + 0.02]).range([height - margin.bottom, margin.top]);

    // Filters definition for glows
    const defs = svg.append("defs");
    Object.keys(colors).forEach((countryName) => {
      const filter = defs
        .append("filter")
        .attr("id", `glow-${countryName.replace(/\s+/g, "-")}`)
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
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${(Number(d) * 1000).toFixed(0)} mm`);

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
    svg.append("g").attr("class", "chart-lines-container");

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

  }, [data]);

  // 2. Perform Dynamic Updates (Smooth X coordinate updates without rebuilding DOM tree!)
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    // Lock X & Y domains to maintain scale consistency when lines toggle
    const allPotentialData = data.filter((c) => Object.keys(colors).includes(c.country));
    const allPoints = allPotentialData.flatMap((c) => c.data);
    const minVal = d3.min(allPoints, (d) => d.value) || -0.22;
    const maxVal = d3.max(allPoints, (d) => d.value) || 0.22;

    const xScale = d3.scaleLinear().domain([1993, 2024]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([minVal - 0.02, maxVal + 0.02]).range([height - margin.bottom, margin.top]);

    const lineGen = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Data join for line paths
    const lines = svg
      .select(".chart-lines-container")
      .selectAll<SVGPathElement, ProcessedCountryData>("path")
      .data(filteredData, (d) => d.country);

    // EXIT old lines
    lines.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();

    // ENTER new lines
    const linesEnter = lines.enter()
      .append("path")
      .attr("class", (d) => `line-path-${d.country.replace(/\s+/g, "-")}`)
      .attr("fill", "none")
      .attr("stroke", (d) => colors[d.country] || "#00B4D8")
      .attr("stroke-width", 2.5)
      .attr("filter", (d) => `url(#glow-${d.country.replace(/\s+/g, "-")})`)
      .style("opacity", 0);

    // UPDATE + ENTER
    linesEnter.merge(lines as any)
      .style("opacity", 0.85)
      .attr("stroke", (d) => colors[d.country] || "#00B4D8")
      .transition()
      .duration(350)
      .attr("d", (d) => {
        const activeData = d.data.filter((pt) => pt.year <= currentYear);
        return lineGen(activeData) || "";
      });

    // Update vertical indicator position
    svg.select(".timeline-indicator-line")
      .attr("x1", xScale(currentYear))
      .attr("x2", xScale(currentYear));

  }, [filteredData, currentYear, data]);

  const potentialCountries = Object.keys(colors);

  return (
    <div className="relative w-full flex flex-col gap-4 bg-[#030d14]/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl">
      <div className="w-full h-[360px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Interactive Grid Legend (Toggles visible lines) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 border-t border-white/5">
        {potentialCountries.map((countryName) => {
          const color = colors[countryName] || "#00B4D8";
          const isActive = selectedCountries.includes(countryName);
          const cData = data.find((c) => c.country === countryName);
          const val = cData?.data.find((d) => d.year === currentYear)?.value || 0;

          return (
            <button
              key={countryName}
              onClick={() => onToggleCountry(countryName)}
              className={`flex flex-col gap-1 border-l-2 pl-3 py-1.5 text-left transition-all duration-300 hover:bg-white/5 rounded-r-lg cursor-pointer ${
                isActive ? "opacity-100 border-solid" : "opacity-35 border-transparent"
              }`}
              style={{ borderLeftColor: isActive ? color : "rgba(245,247,250,0.1)" }}
              title={isActive ? `Hide ${countryName}` : `Show ${countryName}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-sans text-[10px] text-sea-foam/75 truncate max-w-[90px] font-semibold">{countryName}</span>
              </div>
              <span className="font-serif text-sm font-black text-sea-foam tracking-tight">
                {isActive ? `${val >= 0 ? "+" : ""}${(val * 1000).toFixed(0)} mm` : "OFF"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
