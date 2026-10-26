# Born Below the Future Sea

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen.svg)](https://born-below-the-future-sea.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15%20%7C%20App%20Router-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%20Shaders-black.svg)](https://threejs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-Interactive%20Viz-orange.svg)](https://d3js.org/)
[![Challenge](https://img.shields.io/badge/Competition-Pacific%20DataViz%20Challenge-teal.svg)](https://pacificdatavizchallenge.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> [!NOTE]
> **Live Interactive Experience**: Akses visualisasi scrollytelling data iklim dan simulasi kenaikan permukaan laut Pasifik di [https://born-below-the-future-sea.vercel.app/](https://born-below-the-future-sea.vercel.app/)

Proyek visualisasi data interaktif naratif (*storytelling-driven scrollytelling*) yang dikembangkan untuk **Pacific DataViz Challenge**. Aplikasi ini mengeksplorasi catatan historis dan proyeksi kenaikan permukaan air laut (*sea-level rise*) di berbagai negara kepulauan Pasifik melalui sudut pandang generasi manusia.

Kisah berpusat pada **Litia**, seorang anak yang lahir di Fiji pada tahun 2024, menelusuri bagaimana kondisi samudra tempat ia bertumbuh berbeda secara drastis dibanding samudra yang diwarisi generasi orang tuanya pada tahun 1993.

---

## 1. Anggota Tim Pengembang

Proyek ini dirancang dan dikembangkan secara kolaboratif oleh:

| No | Nama Anggota | Peran & Tanggung Jawab |
| :---: | :--- | :--- |
| 1 | **Izam Rosiawan** | Lead Developer, WebGL/Shader Architecture, Data Pipeline & Integration |
| 2 | **Ade** | Frontend Engineering, Interactive UI/UX Components & Layout Styling |
| 3 | **Clai** | Narrative Storytelling, Data Research, Asset Design & Curations |

---

## 2. Fitur Utama

* **3D Ocean Wave Canvas**: Fragment shader WebGL/Three.js dinamis berbasis scroll yang memodelkan elevasi gelombang laut secara real-time. Spektrum warna samudra bertransisi secara mulus ke gradien senja (*sunset glow*) ketika narasi mencapai fase akhir.
* **Synthesized Ocean Ambience**: Generator efek suara deburan ombak pesisir berbasis browser menggunakan Web Audio API (modulasi Brown Noise via low-pass filter dan Low-Frequency Oscillator 6 detik tanpa memerlukan file audio eksternal).
* **Interactive Generation Slider**: Komponen perbandingan visual interaktif (*before-after slider*) yang memperlihatkan kondisi ekosistem pesisir 1993 berbanding daratan tergenang air laut pada 2024.
* **Timeline Chronology**: Linimasa scroll-scrubbing ditenagai GSAP ScrollTrigger yang memetakan anomali permukaan laut berbasis data altimetri satelit periode 1993 hingga 2024.
* **Frontline Georeference Map**: Peta georeferensi interaktif 21 teritori kepulauan Pasifik relatif terhadap Fiji, menampilkan laju kenaikan permukaan air laut lokal yang proporsional dengan radius bubble.
* **Gaussian-Smoothed Data Pipeline**: Modul pemroses data di `parser.ts` dengan filter Gaussian ($\sigma = 1.2$) untuk mereduksi fluktuasi pembulatan desimal pencatatan satelit, menghasilkan kurva tren yang presisi dan mulus pada grafik D3.

---

## 3. Tech Stack

* **Framework**: Next.js 15 (React 19, TypeScript)
* **Styling**: Tailwind CSS v4 & custom HSL color tokens
* **3D & Shader Rendering**: Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`
* **Data Visualization**: D3.js (interactive line charts, dynamic axes, area curves, and SVG coordinate mapping)
* **Animation & Motion**: GSAP (ScrollTrigger) & Lenis (smooth virtual scroll)
* **Audio Synthesis**: Web Audio API (procedural brown noise generation)

---

## 4. Struktur Repositori

```text
born-below-the-future-sea/
├── public/                 # Aset visual statis, tekstur, dan ikon
├── raw-data/               # Dataset altimetri satelit dan metrik iklim Pasifik
├── src/
│   ├── app/                # Next.js App Router (layout, routes, metadata)
│   ├── components/         # Komponen UI modular, audio toggle, dan peta SVG
│   │   ├── Map/            # Georeferenced Pacific SVG map node layout
│   │   └── AudioToggle.tsx # Kontrol audio ambient & web audio synthesizer
│   ├── data/               # Parser data CSV dan kalkulator agregasi spasial
│   ├── hooks/              # Custom React hooks & Intersection Observers
│   ├── sections/           # Modul scrollytelling naratif sekuensial
│   ├── three/              # Scene Three.js, material shader, dan canvas setup
│   └── visualizations/     # Modul grafik D3.js interaktif
├── package.json            # Manifest dependensi & skrip eksekusi
├── tsconfig.json           # Konfigurasi TypeScript
└── README.md               # Dokumentasi utama proyek
```

---

## 5. Sumber Data & Metodologi

* **Data Sumber**: [Pacific Data Hub](https://pacificdata.org) (Satellite Altimetry & Mean Sea Level Datasets).
* **Cakupan Temporal**: 1993 - 2024 (Data observasi satelit Copernicus Marine Service & NOAA).
* **Wilayah Kajian**: Kepulauan Pasifik (Fiji, Kiribati, Tuvalu, Marshall Islands, Vanuatu, Samoa, Solomon Islands, dkk.).
* **Pembersihan Data**: Penanganan *missing values*, interpolasi linier untuk gap pencatatan musiman, serta smoothing berbasis Gaussian filter untuk visualisasi tren makro.

---

## 6. Panduan Menjalankan

### 1. Instalasi Dependensi
Pastikan [Node.js](https://nodejs.org/) (versi 18 LTS atau lebih baru) sudah terpasang, lalu jalankan:
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

### 3. Build Produksi
```bash
npm run build
npm run start
```

---

## 7. Lisensi

Didistribusikan di bawah lisensi MIT.
