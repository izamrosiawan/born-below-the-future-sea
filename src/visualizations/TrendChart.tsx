"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface TrendChartProps {
  regionalAverage: { year: number; value: number }[];
}

export default function TrendChart({ regionalAverage }: TrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || regionalAverage.length === 0) return;

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

    const maxVal = d3.max(regionalAverage, (d) => d.value) || 0.12;
    const minVal = d3.min(regionalAverage, (d) => d.value) || -0.05;

    const yScale = d3
      .scaleLinear()
      .domain([minVal - 0.02, maxVal + 0.02])
      .range([height - margin.bottom, margin.top]);

    // Gradient definitions
    const defs = svg.append("defs");
    const areaGrad = defs
      .append("linearGradient")
      .attr("id", "trendAreaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGrad.append("stop").attr("offset", "0%").attr("stop-color", "#4CC9F0").attr("stop-opacity", 0.2);
    areaGrad.append("stop").attr("offset", "100%").attr("stop-color", "#061826").attr("stop-opacity", 0.0);

    const glowFilter = defs
      .append("filter")
      .attr("id", "trendGlow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    glowFilter.append("feGaussianBlur").attr("stdDeviation", 5).attr("result", "blur");
    glowFilter.append("feMerge").call((merge) => {
      merge.append("feMergeNode").attr("in", "blur");
      merge.append("feMergeNode").attr("in", "SourceGraphic");
    });

    // Subtly colored horizontal gridlines
    svg
      .append("g")
      .attr("class", "grid opacity-[0.03]")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(() => "")
      );

    svg
      .append("g")
      .attr("class", "grid opacity-[0.03]")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => "")
      );

    // Minimalist Axes
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

    // Area path
    const areaGen = d3
      .area<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y0(yScale(0))
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(regionalAverage)
      .attr("fill", "url(#trendAreaGradient)")
      .attr("d", areaGen);

    // Trend line path
    const lineGen = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(regionalAverage)
      .attr("fill", "none")
      .attr("stroke", "#4CC9F0")
      .attr("stroke-width", 3)
      .attr("filter", "url(#trendGlow)")
      .attr("d", lineGen);

    // Simple baseline
    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", yScale(0))
      .attr("x2", width - margin.right)
      .attr("y2", yScale(0))
      .attr("stroke", "rgba(245,247,250,0.15)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3 3");

    // Human-Centered Editorial Annotations (NYT style!)
    
    // Annotation 1: El Nino Anomaly
    const elNinoYear = 1998;
    const elNinoVal = regionalAverage.find(d => d.year === elNinoYear)?.value || 0;
    
    svg
      .append("line")
      .attr("x1", xScale(elNinoYear))
      .attr("y1", yScale(elNinoVal))
      .attr("x2", xScale(elNinoYear))
      .attr("y2", yScale(elNinoVal) - 60)
      .attr("stroke", "#E63946")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "2 2");

    svg
      .append("circle")
      .attr("cx", xScale(elNinoYear))
      .attr("cy", yScale(elNinoVal))
      .attr("r", 4)
      .attr("fill", "#E63946");

    const textGroup1 = svg.append("g").attr("transform", `translate(${xScale(elNinoYear) - 80}, ${yScale(elNinoVal) - 100})`);
    textGroup1.append("text")
      .attr("fill", "#E63946")
      .attr("class", "font-sans text-[11px] font-bold uppercase tracking-wider")
      .text("Strong El Niño Drop");
    textGroup1.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "12")
      .attr("class", "font-sans text-[10px] opacity-70")
      .text("Trade winds shifted water westward,");
    textGroup1.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "24")
      .attr("class", "font-sans text-[10px] opacity-70")
      .text("causing temporary sea level drop.");

    // Annotation 2: Acceleration Phase
    const accYear = 2016;
    const accVal = regionalAverage.find(d => d.year === accYear)?.value || 0;

    svg
      .append("line")
      .attr("x1", xScale(accYear))
      .attr("y1", yScale(accVal))
      .attr("x2", xScale(accYear) + 40)
      .attr("y2", yScale(accVal) + 50)
      .attr("stroke", "#00B4D8")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "2 2");

    svg
      .append("circle")
      .attr("cx", xScale(accYear))
      .attr("cy", yScale(accVal))
      .attr("r", 4)
      .attr("fill", "#00B4D8");

    const textGroup2 = svg.append("g").attr("transform", `translate(${xScale(accYear) + 50}, ${yScale(accVal) + 40})`);
    textGroup2.append("text")
      .attr("fill", "#00B4D8")
      .attr("class", "font-sans text-[11px] font-bold uppercase tracking-wider")
      .text("Accelerated Rise Phase");
    textGroup2.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "12")
      .attr("class", "font-sans text-[10px] opacity-70")
      .text("Rate of rise nearly doubled");
    textGroup2.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "24")
      .attr("class", "font-sans text-[10px] opacity-70")
      .text("due to increased ice sheet melting.");

    // Right-side explanation guide (NYT sidebar style)
    const sidebar = svg.append("g").attr("transform", `translate(${width - margin.right + 30}, ${margin.top + 30})`);
    
    sidebar.append("text")
      .attr("fill", "#4CC9F0")
      .attr("class", "font-serif text-sm font-bold")
      .text("What does this mean?");
      
    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "22")
      .attr("class", "font-sans text-xs opacity-75")
      .text("Since 1993, the Pacific ocean has");
      
    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "38")
      .attr("class", "font-sans text-xs opacity-75")
      .text("risen by an average of 110mm.");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "60")
      .attr("class", "font-sans text-xs opacity-70 italic")
      .text("To a layperson, 110mm sounds small.");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "76")
      .attr("class", "font-sans text-xs opacity-70 italic")
      .text("But in low-lying coastal zones,");

    sidebar.append("text")
      .attr("fill", "#F5F7FA")
      .attr("dy", "92")
      .attr("class", "font-sans text-xs opacity-70 italic")
      .text("this is enough to push high tides");

    sidebar.append("text")
      .attr("fill", "#4CC9F0")
      .attr("dy", "108")
      .attr("class", "font-sans text-xs font-bold")
      .text("directly into village crops.");

  }, [regionalAverage]);

  return (
    <div className="w-full bg-[#030d14]/40 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-2xl">
      <div className="mb-6">
        <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
          Scientific Record A
        </span>
        <h3 className="font-serif text-2xl font-bold text-sea-foam mt-1">
          Pacific Regional Average Trend (1993 - 2024)
        </h3>
        <p className="font-sans text-sm text-sea-foam/60 mt-2 max-w-3xl leading-relaxed">
          This chart compiles observations across all Pacific islands. Notice that the trend line is not a simple straight line; it accelerates significantly post-2015.
        </p>
      </div>
      <div className="w-full h-[450px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
}
