"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { ProcessedCountryData } from "@/data/parser";

interface CountryComparisonChartProps {
  data: ProcessedCountryData[];
  selectedCountryA: string;
  setSelectedCountryA: (c: string) => void;
  selectedCountryB: string;
  setSelectedCountryB: (c: string) => void;
  projectionYear: number;
  projectionScenario: "low" | "high";
}

function getProjectedDataset(countryData: ProcessedCountryData, scenario: "low" | "high") {
  const dataset = countryData.data.map(d => ({ ...d })); // copy historical
  
  // Future projection
  const val2024 = countryData.data.find((d) => d.year === 2024)?.value || countryData.totalRise;
  const rate = countryData.averageRate; // m/year
  const acceleration = 0.0001; 

  for (let year = 2025; year <= 2100; year++) {
    const t = year - 2024;
    let projectedVal = 0;
    if (scenario === "low") {
      projectedVal = val2024 + rate * t;
    } else {
      projectedVal = val2024 + rate * t + 0.5 * acceleration * t * t;
    }
    dataset.push({ year, value: projectedVal });
  }
  
  return dataset;
}

export default function CountryComparisonChart({
  data,
  selectedCountryA,
  setSelectedCountryA,
  selectedCountryB,
  setSelectedCountryB,
  projectionYear,
  projectionScenario,
}: CountryComparisonChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const recordA = useMemo(() => data.find((c) => c.country === selectedCountryA), [data, selectedCountryA]);
  const recordB = useMemo(() => data.find((c) => c.country === selectedCountryB), [data, selectedCountryB]);

  const datasetA = useMemo(() => {
    if (!recordA) return [];
    return getProjectedDataset(recordA, projectionScenario);
  }, [recordA, projectionScenario]);

  const datasetB = useMemo(() => {
    if (!recordB) return [];
    return getProjectedDataset(recordB, projectionScenario);
  }, [recordB, projectionScenario]);

  // Layout metrics
  const width = 1000;
  const height = 450;
  const margin = { top: 50, right: 240, bottom: 60, left: 60 };

  useEffect(() => {
    if (!svgRef.current || !recordA || !recordB || datasetA.length === 0 || datasetB.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    // Scale X up to 2100 for projections
    const xScale = d3
      .scaleLinear()
      .domain([1993, 2100])
      .range([margin.left, width - margin.right]);

    // Compute max/min from full projected datasets
    const maxVal = d3.max([...datasetA, ...datasetB], (d) => d.value) || 0.6;
    const minVal = d3.min([...datasetA, ...datasetB], (d) => d.value) || -0.22;

    const yScale = d3
      .scaleLinear()
      .domain([minVal - 0.03, maxVal + 0.03])
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
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${(Number(d) * 1000).toFixed(0)} mm`);

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

    // Split historical vs projected
    const histA = datasetA.filter(d => d.year <= 2024);
    const projA = datasetA.filter(d => d.year >= 2024);

    const histB = datasetB.filter(d => d.year <= 2024);
    const projB = datasetB.filter(d => d.year >= 2024);

    // 1. Draw Country A Lines (Cyan)
    // Historical (Solid)
    svg
      .append("path")
      .datum(histA)
      .attr("fill", "none")
      .attr("stroke", "#00B4D8")
      .attr("stroke-width", 3)
      .attr("filter", "url(#glow-A)")
      .attr("opacity", 0.95)
      .attr("d", lineGen);
    
    // Projected (Dashed)
    svg
      .append("path")
      .datum(projA)
      .attr("fill", "none")
      .attr("stroke", "#00B4D8")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4 4")
      .attr("filter", "url(#glow-A)")
      .attr("opacity", 0.7)
      .attr("d", lineGen);

    // 2. Draw Country B Lines (Red)
    // Historical (Solid)
    svg
      .append("path")
      .datum(histB)
      .attr("fill", "none")
      .attr("stroke", "#E63946")
      .attr("stroke-width", 3)
      .attr("filter", "url(#glow-B)")
      .attr("opacity", 0.95)
      .attr("d", lineGen);
    
    // Projected (Dashed)
    svg
      .append("path")
      .datum(projB)
      .attr("fill", "none")
      .attr("stroke", "#E63946")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4 4")
      .attr("filter", "url(#glow-B)")
      .attr("opacity", 0.7)
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

    // Divider for 2024 projection start
    svg
      .append("line")
      .attr("x1", xScale(2024))
      .attr("y1", margin.top)
      .attr("x2", xScale(2024))
      .attr("y2", height - margin.bottom)
      .attr("stroke", "rgba(245,247,250,0.2)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "1 4");

    svg
      .append("text")
      .attr("x", xScale(2024) - 8)
      .attr("y", margin.top - 8)
      .attr("fill", "rgba(245,247,250,0.3)")
      .attr("text-anchor", "end")
      .attr("class", "font-sans text-[8px] uppercase tracking-widest font-bold")
      .text("Historical");

    svg
      .append("text")
      .attr("x", xScale(2024) + 8)
      .attr("y", margin.top - 8)
      .attr("fill", "rgba(76,201,240,0.4)")
      .attr("text-anchor", "start")
      .attr("class", "font-sans text-[8px] uppercase tracking-widest font-bold")
      .text("Projections");

    // Dynamic vertical timeline indicator reflecting projectionYear
    svg
      .append("line")
      .attr("class", "projection-indicator-line")
      .attr("x1", xScale(projectionYear))
      .attr("y1", margin.top)
      .attr("x2", xScale(projectionYear))
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#4CC9F0")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "2 2")
      .attr("opacity", 0.55);

    // Sidebar text explanation
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
      .text("One island may show frequent spikes,");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "98")
      .attr("class", "font-sans text-xs opacity-70")
      .text("while another follows a more");

    sidebar.append("text")
      .attr("fill", "#00B4D8")
      .attr("dy", "114")
      .attr("class", "font-sans text-xs font-bold")
      .text("gradual and persistent curve.");

    // -------------------------------------------------------------
    // INTERACTIVE CROSSHAIR & CURSOR TRACKING (Tooltip)
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
        const index = bisect(datasetA, yearX);
        
        const ptA = datasetA[index];
        const ptB = datasetB[index];

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
          
          tooltipYear.text(ptA.year > 2024 ? `Projected Year ${ptA.year}` : `Year ${ptA.year}`);
          tooltipValA.text(`${recordA.country}: +${(ptA.value * 1000).toFixed(0)} mm`);
          tooltipValB.text(`${recordB.country}: +${(ptB.value * 1000).toFixed(0)} mm`);
        }
      });

  }, [recordA, recordB, datasetA, datasetB, projectionYear, projectionScenario]);

  // Read year values directly for comparison values
  const activeValA = useMemo(() => {
    if (!recordA) return 0;
    const pt = datasetA.find(d => d.year === projectionYear);
    return pt ? pt.value : 0;
  }, [recordA, datasetA, projectionYear]);

  const activeValB = useMemo(() => {
    if (!recordB) return 0;
    const pt = datasetB.find(d => d.year === projectionYear);
    return pt ? pt.value : 0;
  }, [recordB, datasetB, projectionYear]);

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
              value={selectedCountryA}
              onChange={(e) => setSelectedCountryA(e.target.value)}
              className="bg-[#030d14]/80 text-sea-foam text-xs border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-soft-cyan/50 focus:ring-1 focus:ring-soft-cyan/30 cursor-pointer"
            >
              {data.map((c) => (
                <option key={c.country} value={c.country} disabled={c.country === selectedCountryB}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] text-[#E63946] uppercase tracking-wider font-bold">Country B</span>
            <select
              value={selectedCountryB}
              onChange={(e) => setSelectedCountryB(e.target.value)}
              className="bg-[#030d14]/80 text-sea-foam text-xs border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-soft-cyan/50 focus:ring-1 focus:ring-soft-cyan/30 cursor-pointer"
            >
              {data.map((c) => (
                <option key={c.country} value={c.country} disabled={c.country === selectedCountryA}>
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
            <span className="font-sans text-[10px] text-sea-foam/50 uppercase tracking-widest font-semibold">
              {recordA.country} {projectionYear > 2024 ? `Projected Rise (${projectionYear})` : "Net Rise"}
            </span>
            <span className="font-serif text-3xl font-black text-sea-foam mt-1">
              +{Math.max(0, activeValA * 1000).toFixed(0)} mm
            </span>
            <span className="font-sans text-xs text-sea-foam/60 mt-1">
              Average rate: {(recordA.averageRate * 1000).toFixed(2)} mm / year
            </span>
          </div>
        )}
        {recordB && (
          <div className="flex flex-col border-l-2 border-[#E63946] pl-4">
            <span className="font-sans text-[10px] text-sea-foam/50 uppercase tracking-widest font-semibold">
              {recordB.country} {projectionYear > 2024 ? `Projected Rise (${projectionYear})` : "Net Rise"}
            </span>
            <span className="font-serif text-3xl font-black text-sea-foam mt-1">
              +{Math.max(0, activeValB * 1000).toFixed(0)} mm
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
