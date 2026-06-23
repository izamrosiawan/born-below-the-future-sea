# Born Below the Future Sea 🌊

An immersive, storytelling-driven data visualization project created for the **Pacific DataViz Challenge**. This application explores the historical and future impacts of sea-level rise across low-lying Pacific island nations, framing data within a human-centered, generational narrative.

The story follows **Litia**, a child born in Fiji in 2024, tracing how the ocean she grows up with differs from the one her parents inherited in 1993.

---

## 🌟 Key Features

* **3D Ocean Wave Canvas:** A scroll-driven, customized WebGL/Three.js fragment shader that models wave elevations. The ocean colors dynamically morph to a warm sunset gradient as the user reaches the story's end.
* **Synthesized Ocean Ambience:** A browser-synthesized audio ambience generator using the **Web Audio API** (modulating Brown Noise using low-pass filters and a 6-second low-frequency oscillator) to mimic realistic coastal wave swells.
* **Interactive Generation Slider:** A side-by-side coastline comparison tool visualizing a healthy 1993 ecosystem versus a saltwater-inundated 2024 coastline.
* **Timeline Chronology:** A GSAP-powered, scroll-linked timeline scrubbing satellite altimetry data points from 1993 to 2024.
* **Frontline Georeference Map:** A stylized, interactive georeferenced map plotting 21 Pacific territories relative to Fiji, showing localized sea-level rise rates proportional to bubble radius.
* **Gaussian-Smoothed Data Pipeline:** Custom data processor in `parser.ts` executing a Gaussian filter ($\sigma = 1.2$) to eliminate decimal rounding stepping in historical records, generating smooth, high-fidelity lines in D3 charts.

---

## 🛠️ Technology Stack

* **Framework:** Next.js (React 19 & TypeScript)
* **Styling:** Tailwind CSS v4 & custom HSL color systems
* **3D Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), and `@react-three/drei`
* **Data Visualization:** D3.js (interactive line charts, custom gridlines, overlays, and transitions)
* **Animation & Scrolling:** GSAP (ScrollTrigger) & Lenis (smooth scrolling)
* **Audio Synthesis:** Web Audio API (client-side brownian noise oscillators)

---

## 📁 Repository Architecture

```text
src/
├── app/                  # Next.js app routes, layout, and global theme styles
├── components/           # Reusable UI widgets & map layers
│   ├── Map/              # Georeferenced Pacific SVG map node layout
│   └── AudioToggle.tsx   # Audio ambient controls & synthesizers
├── data/                 # Raw datasets (CSV) and CSV parsing engines
├── hooks/                # Intersection Observers and custom hooks
├── sections/             # Linear storytelling scrollytelling pages
├── three/                # WebGL scenes, shader materials, and canvas setups
└── visualizations/       # Custom D3.js chart modules
```

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Development Server
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser to view the application.

### 3. Production Build
Generate an optimized production build:
```bash
npm run build
```
Verify page routes and static assets compilation.
