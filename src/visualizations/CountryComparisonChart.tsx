"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { ProcessedCountryData } from "@/data/parser";

interface CountryComparisonChartProps {
  data: ProcessedCountryData[];
}

export default function CountryComparisonChart({ data }: CountryComparisonChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [countryA, setCountryA] = useState<string>("Fiji");
  const [countryB, setCountryB] = useState<string>("Tuvalu");

  const recordA = useMemo(() => data.find((c) => c.country === countryA), [data, countryA]);
  const recordB = useMemo(() => data.find((c) => c.country === countryB), [data, countryB]);

  useEffect(() => {
    if (!svgRef.current || !recordA || !recordB) return;

    const width = 1000;
    const height = 450;
    const margin = { top: 50, right: 240, bottom: 60, left: 60 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    const xScale = d3
      .scaleLinear()
      .domain([1993, 2024])
      .range([margin.left, width - margin.right]);

    const maxVal = d3.max([...recordA.data, ...recordB.data], (d) => d.value) || 0.15;
    const minVal = d3.min([...recordA.data, ...recordB.data], (d) => d.value) || -0.22;

    const yScale = d3
      .scaleLinear()
      .domain([minVal - 0.02, maxVal + 0.02])
      .range([height - margin.bottom, margin.top]);

    // Glow filters
    const defs = svg.append("defs");
    ["A", "B"].forEach((id) => {
      const filter = defs
        .append("filter")
        .attr("id", `glow-${id}`)
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");

      filter.append("feGaussianBlur").attr("stdDeviation", 4).attr("result", "blur");
      filter.append("feMerge").call((merge) => {
        merge.append("feMergeNode").attr("in", "blur");
        merge.append("feMergeNode").attr("in", "SourceGraphic");
      });
    });

    // Subtly colored horizontal gridlines
    svg
      .append("g")
      .attr("class", "grid opacity-[0.02]")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(() => "")
      );

    svg
      .append("g")
      .attr("class", "grid opacity-[0.02]")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => "")
      );

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${(Number(d) * 1000).toFixed(0)}mm`);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .attr("class", "text-sea-foam/40 font-sans text-[11px]")
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "rgba(245,247,250,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(245,247,250,0.1)"));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .attr("class", "text-sea-foam/40 font-sans text-[11px]")
      .call(yAxis)
      .call((g) => g.select(".domain").attr("stroke", "rgba(245,247,250,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(245,247,250,0.1)"));

    // Line generator
    const lineGen = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw Country A Line (Cyan)
    svg
      .append("path")
      .datum(recordA.data)
      .attr("fill", "none")
      .attr("stroke", "#00B4D8")
      .attr("stroke-width", 3)
      .attr("filter", "url(#glow-A)")
      .attr("opacity", 0.95)
      .attr("d", lineGen);

    // Draw Country B Line (Red/Coral)
    svg
      .append("path")
      .datum(recordB.data)
      .attr("fill", "none")
      .attr("stroke", "#E63946")
      .attr("stroke-width", 3)
      .attr("filter", "url(#glow-B)")
      .attr("opacity", 0.95)
      .attr("d", lineGen);

    // Baseline indicator
    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", yScale(0))
      .attr("x2", width - margin.right)
      .attr("y2", yScale(0))
      .attr("stroke", "rgba(245,247,250,0.15)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3 3");

    // Dynamic Annotation detailing El Nino spike if Tuvalu is active
    if (countryA === "Tuvalu" || countryB === "Tuvalu") {
      const targetColor = countryA === "Tuvalu" ? "#00B4D8" : "#E63946";
      
      svg
        .append("circle")
        .attr("cx", xScale(1998))
        .attr("cy", yScale(-0.2))
        .attr("r", 5)
        .attr("fill", targetColor);

      svg
        .append("line")
        .attr("x1", xScale(1998))
        .attr("y1", yScale(-0.2))
        .attr("x2", xScale(1998) + 60)
        .attr("y2", yScale(-0.2) + 60)
        .attr("stroke", targetColor)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "2 2");

      const label = svg.append("g").attr("transform", `translate(${xScale(1998) + 70}, ${yScale(-0.2) + 50})`);
      label.append("text")
        .attr("fill", targetColor)
        .attr("class", "font-sans text-[11px] font-bold uppercase tracking-wider")
        .text("Tuvalu Extreme Low");
      label.append("text")
        .attr("fill", "#F5F7FA")
        .attr("dy", "12")
        .attr("class", "font-sans text-[10px] opacity-70")
        .text("Temporary -200mm dip caused by trade winds");
      label.append("text")
        .attr("fill", "#F5F7FA")
        .attr("dy", "24")
        .attr("class", "font-sans text-[10px] opacity-70")
        .text("shifting hot water away from the island.");
    }

    // Right-side comparison sidebar
    const sidebar = svg.append("g").attr("transform", `translate(${width - margin.right + 30}, ${margin.top + 30})`);
    
    sidebar.append("text")
      .attr("fill", "#E63946")
      .attr("class", "font-serif text-sm font-bold")
      .text("Historical Contrast");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "22")
      .attr("class", "font-sans text-xs opacity-75")
      .text(`Comparing ${recordA.country} and ${recordB.country}.`);

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "44")
      .attr("class", "font-sans text-xs opacity-70")
      .text("Notice how geographic distance");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "60")
      .attr("class", "font-sans text-xs opacity-70")
      .text("creates divergent histories.");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "82")
      .attr("class", "font-sans text-xs opacity-70")
      .text("Tuvalu has frequent spike events,");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "98")
      .attr("class", "font-sans text-xs opacity-70")
      .text(`while ${recordA.country} follows a more`);

    sidebar.append("text")
      .attr("fill", "#00B4D8")
      .attr("dy", "114")
      .attr("class", "font-sans text-xs font-bold")
      .text("gradual but persistent curve.");

    // -------------------------------------------------------------
    // INTERACTIVE CROSSHAIR & CURSOR TRACKING (Extremely Premium!)
    // -------------------------------------------------------------
    const hoverGroup = svg.append("g").attr("class", "hover-group").style("display", "none");
    
    const hoverLine = hoverGroup
      .append("line")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "rgba(245,247,250,0.2)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 4");

    const hoverDotA = hoverGroup
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#00B4D8")
      .attr("stroke", "#030d14")
      .attr("stroke-width", 2);

    const hoverDotB = hoverGroup
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#E63946")
      .attr("stroke", "#030d14")
      .attr("stroke-width", 2);

    // Multi-country floating tooltip card
    const tooltip = hoverGroup
      .append("g")
      .attr("transform", "translate(0,0)");

    tooltip
      .append("rect")
      .attr("width", 140)
      .attr("height", 68)
      .attr("rx", 6)
      .attr("fill", "#030d14")
      .attr("stroke", "rgba(245,247,250,0.15)")
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0 4px 12px rgba(0,0,0,0.6))");

    const tooltipYear = tooltip
      .append("text")
      .attr("x", 12)
      .attr("y", 16)
      .attr("fill", "rgba(245,247,250,0.4)")
      .attr("class", "font-sans text-[9px] font-bold uppercase tracking-wider");

    const tooltipValA = tooltip
      .append("text")
      .attr("x", 12)
      .attr("y", 36)
      .attr("fill", "#00B4D8")
      .attr("class", "font-sans text-xs font-semibold");

    const tooltipValB = tooltip
      .append("text")
      .attr("x", 12)
      .attr("y", 54)
      .attr("fill", "#E63946")
      .attr("class", "font-sans text-xs font-semibold");

    const bisect = d3.bisector<{ year: number; value: number }, number>((d) => d.year).center;

    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => hoverGroup.style("display", null))
      .on("mouseout", () => hoverGroup.style("display", "none"))
      .on("mousemove", (event) => {
        const mouseX = d3.pointer(event)[0];
        const yearX = xScale.invert(mouseX);
        const index = bisect(recordA.data, yearX);
        
        const ptA = recordA.data[index];
        const ptB = recordB.data[index];

        if (ptA && ptB) {
          const cx = xScale(ptA.year);
          const cyA = yScale(ptA.value);
          const cyB = yScale(ptB.value);

          hoverLine.attr("x1", cx).attr("x2", cx);
          hoverDotA.attr("cx", cx).attr("cy", cyA);
          hoverDotB.attr("cx", cx).attr("cy", cyB);

          const tooltipX = cx > width / 2 ? cx - 155 : cx + 15;
          const tooltipY = Math.max(margin.top, Math.min(cyA, cyB) - 15);
          tooltip.attr("transform", `translate(${tooltipX}, ${tooltipY})`);
          
          tooltipYear.text(`Year ${ptA.year}`);
          tooltipValA.text(`${recordA.country}: +${(ptA.value * 1000).toFixed(0)}mm`);
          tooltipValB.text(`${recordB.country}: +${(ptB.value * 1000).toFixed(0)}mm`);
        }
      });

  }, [recordA, recordB, countryA, countryB]);

  return (
    <div className="w-full bg-[#030d14]/40 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-2xl flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Scientific Ledger — Dual Country Comparison
          </span>
          <h3 className="font-serif text-2xl font-bold text-sea-foam mt-0.5">
            Island Nation Comparison
          </h3>
          <p className="font-sans text-sm text-sea-foam/60 mt-2 max-w-2xl leading-relaxed">
            Select two Pacific island territories below to inspect and compare their specific historical trends.
          </p>
        </div>
        <div className="flex gap-4 self-start sm:self-center">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] text-[#00B4D8] uppercase tracking-wider font-bold">Country A</span>
            <select
              value={countryA}
              onChange={(e) => setCountryA(e.target.value)}
              className="bg-[#030d14]/80 text-sea-foam text-xs border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-soft-cyan/50 focus:ring-1 focus:ring-soft-cyan/30 cursor-pointer"
            >
              {data.map((c) => (
                <option key={c.country} value={c.country} disabled={c.country === countryB}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] text-[#E63946] uppercase tracking-wider font-bold">Country B</span>
            <select
              value={countryB}
              onChange={(e) => setCountryB(e.target.value)}
              className="bg-[#030d14]/80 text-sea-foam text-xs border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-soft-cyan/50 focus:ring-1 focus:ring-soft-cyan/30 cursor-pointer"
            >
              {data.map((c) => (
                <option key={c.country} value={c.country} disabled={c.country === countryA}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full h-[450px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Numerical Stats Panel */}
      <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-4">
        {recordA && (
          <div className="flex flex-col border-l-2 border-[#00B4D8] pl-4">
            <span className="font-sans text-[10px] text-sea-foam/50 uppercase tracking-widest font-semibold">{recordA.country} Net Rise</span>
            <span className="font-serif text-3xl font-black text-sea-foam mt-1">
              +{(recordA.totalRise * 1000).toFixed(0)}mm
            </span>
            <span className="font-sans text-xs text-sea-foam/60 mt-1">
              Average rate: {(recordA.averageRate * 1000).toFixed(2)} mm / year
            </span>
          </div>
        )}
        {recordB && (
          <div className="flex flex-col border-l-2 border-[#E63946] pl-4">
            <span className="font-sans text-[10px] text-sea-foam/50 uppercase tracking-widest font-semibold">{recordB.country} Net Rise</span>
            <span className="font-serif text-3xl font-black text-sea-foam mt-1">
              +{(recordB.totalRise * 1000).toFixed(0)}mm
            </span>
            <span className="font-sans text-xs text-sea-foam/60 mt-1">
              Average rate: {(recordB.averageRate * 1000).toFixed(2)} mm / year
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
