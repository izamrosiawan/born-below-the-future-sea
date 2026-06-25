"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function ReflectionSection() {
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<"none" | "relocate" | "stay">("none");
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
  });

  // Slow text sequencing for a cinematic documentary experience
  useEffect(() => {
    if (!isIntersecting) return;

    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 4000),
      setTimeout(() => setStep(3), 7000),
      setTimeout(() => setStep(4), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isIntersecting]);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 py-24 overflow-hidden bg-gradient-to-b from-[#061826] via-[#0b293d] to-[#140b03]">
      {/* Sunset Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(244,162,97,0.06)_0%,transparent_65%)] pointer-events-none" />

      {/* Spacer to push content down if needed, keeping layout balanced */}
      <div className="h-4" />

      {/* Cinematic Typography Sequence */}
      <div ref={ref} className="max-w-2xl flex flex-col gap-8 z-10 select-none my-auto">
        <p
          className={`font-serif text-xl md:text-2xl lg:text-3xl italic text-sea-foam transition-all duration-1000 ${
            step >= 1 ? "opacity-90 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
          }`}
        >
          "The ocean rises a few millimeters every year."
        </p>

        <p
          className={`font-serif text-xl md:text-2xl lg:text-3xl italic text-sea-foam transition-all duration-1000 ${
            step >= 2 ? "opacity-90 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
          }`}
        >
          For a child born today, <br />
          that sounds small.
        </p>

        <p
          className={`font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-soft-cyan transition-all duration-1500 ${
            step >= 3 ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-sm translate-y-4"
          }`}
        >
          Until those millimeters <br />
          become a lifetime.
        </p>
      </div>

      {/* Interactive Dilemma Section */}
      <div
        className={`w-full max-w-4xl mt-16 flex flex-col items-center gap-8 z-10 transition-all duration-1000 ${
          step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <div className="text-center max-w-xl flex flex-col gap-2">
          <span className="font-sans text-[10px] text-soft-cyan uppercase tracking-widest font-semibold">
            Chapter 8 — The Decision
          </span>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-soft-cyan">
            Dilema Litia: Masa Depan yang Menanti (2050)
          </h3>
          <p className="font-sans text-xs md:text-sm text-sea-foam/70 leading-relaxed">
            Ketika Litia menginjak usia 26 tahun, permukaan air laut di Fiji diperkirakan naik lebih dari 200 mm. Komunitas pesisirnya dihadapkan pada pilihan yang memilukan. Klik di bawah untuk melihat konsekuensinya.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
          {/* Relocate Option */}
          <button
            onClick={() => setSelectedChoice("relocate")}
            className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md select-none outline-none ${
              selectedChoice === "relocate"
                ? "border-soft-cyan bg-soft-cyan/10 shadow-[0_0_30px_rgba(0,180,216,0.15)]"
                : "border-white/15 bg-[#030d14]/40 hover:border-white/25 hover:bg-[#030d14]/60"
            }`}
          >
            <span className="font-serif text-[10px] font-semibold text-soft-cyan uppercase tracking-widest mb-2">Pilihan A</span>
            <h4 className="font-serif text-base font-bold text-sea-foam mb-2">Relokasi (Pindah)</h4>
            <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
              Meninggalkan Fiji untuk mencari tempat tinggal baru di Selandia Baru atau Australia sebagai migran iklim demi keselamatan fisik.
            </p>
          </button>

          {/* Stay Option */}
          <button
            onClick={() => setSelectedChoice("stay")}
            className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md select-none outline-none ${
              selectedChoice === "stay"
                ? "border-soft-cyan bg-soft-cyan/10 shadow-[0_0_30px_rgba(0,180,216,0.15)]"
                : "border-white/15 bg-[#030d14]/40 hover:border-white/25 hover:bg-[#030d14]/60"
            }`}
          >
            <span className="font-serif text-[10px] font-semibold text-soft-cyan uppercase tracking-widest mb-2">Pilihan B</span>
            <h4 className="font-serif text-base font-bold text-sea-foam mb-2">Adaptasi (Menetap)</h4>
            <p className="font-sans text-xs text-sea-foam/70 leading-relaxed">
              Bertahan di tanah leluhur, membangun tanggul laut, menanam hutan bakau, dan berjuang menjaga budaya tetap hidup.
            </p>
          </button>
        </div>

        {/* Detailed Narrative Reveal */}
        <div className="relative w-full max-w-3xl min-h-[140px] mt-2 transition-all duration-500">
          {selectedChoice === "relocate" && (
            <div className="p-6 rounded-2xl border border-white/5 bg-[#030d14]/60 backdrop-blur-md flex flex-col gap-2 text-left transition-all duration-500">
              <span className="font-serif text-xs font-semibold text-soft-cyan uppercase tracking-wider">
                "Kehilangan Tanah, Menyelamatkan Masa Depan"
              </span>
              <p className="font-sans text-xs md:text-sm text-sea-foam/80 leading-relaxed">
                Litia dan keluarganya terpaksa mengemas sisa hidup mereka ke dalam koper dan berpindah ke negara asing. Fisik mereka aman di dataran tinggi, tetapi hubungan spiritual mereka dengan tanah leluhur (*Vanua*) terputus selamanya. Kuburan nenek moyang mereka tenggelam di bawah laut Fiji, dan identitas budaya mereka perlahan terkikis di tanah perantauan.
              </p>
            </div>
          )}

          {selectedChoice === "stay" && (
            <div className="p-6 rounded-2xl border border-white/5 bg-[#030d14]/60 backdrop-blur-md flex flex-col gap-2 text-left transition-all duration-500">
              <span className="font-serif text-xs font-semibold text-soft-cyan uppercase tracking-wider">
                "Berakar di Tengah Pasang"
              </span>
              <p className="font-sans text-xs md:text-sm text-sea-foam/80 leading-relaxed">
                Litia memilih untuk tidak pergi. Bersama desanya, ia bergotong-royong meninggikan rumah mereka di atas tiang kayu, menanam ribuan bibit bakau untuk menahan abrasi, dan mempertahankan desa. Hubungan sosial, bahasa, dan ritual adat mereka tetap hidup. Namun, setiap badai datang mereka harus bertaruh nyawa, dan sumur air tawar mereka semakin asin untuk diminum.
              </p>
            </div>
          )}

          {selectedChoice === "none" && (
            <div className="flex items-center justify-center p-8 border border-white/10 border-dashed rounded-2xl bg-[#030d14]/25 h-[120px]">
              <p className="font-sans text-xs md:text-sm text-sea-foam/40 italic">
                Pilih salah satu opsi di atas untuk melihat konsekuensi nasib Litia...
              </p>
            </div>
          )}
        </div>

        {/* Final Resolution (fades in once a choice is clicked) */}
        <div
          className={`w-full max-w-2xl text-center flex flex-col items-center gap-4 border-t border-white/10 pt-8 mt-4 transition-all duration-700 ${
            selectedChoice !== "none" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden"
          }`}
        >
          <h4 className="font-serif text-base md:text-lg font-bold text-soft-cyan">
            Konklusi: Menetap dan Berjuang
          </h4>
          <p className="font-sans text-xs md:text-sm text-sea-foam/80 leading-relaxed">
            Bagi masyarakat adat Fiji, memisahkan diri dari tanah adalah bentuk kematian identitas. Oleh karena itu, mayoritas masyarakat pesisir memilih untuk <strong>menetap, beradaptasi, dan berjuang</strong>. Mereka menolak dipandang sebagai korban yang pasrah; mereka adalah pejuang iklim di garis depan.
          </p>
          <div className="font-sans text-xs text-soft-cyan/90 italic leading-relaxed max-w-lg border-l-2 border-soft-cyan/30 pl-4 text-left mt-2 bg-[#030d14]/30 py-2 pr-2 rounded-r-lg">
            "Kami tidak tenggelam, kami sedang berjuang. Namun, ketangguhan kami tidak boleh dijadikan alasan bagi dunia untuk terus menunda aksi penyelamatan bumi."
          </div>
        </div>
      </div>

      {/* Premium Credits & Source Footer */}
      <footer
        className={`w-full max-w-5xl mt-24 border-t border-white/10 pt-12 pb-2 flex flex-col md:flex-row gap-8 justify-between items-center z-10 transition-all duration-1000 ${
          step >= 4 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-sans text-[9px] text-soft-cyan uppercase tracking-widest font-semibold">
            Project Credits
          </span>
          <p className="font-serif text-sm text-sea-foam font-bold">
            Pacific DataViz Challenge — Built for the Future of Oceania
          </p>
          <p className="font-sans text-[11px] text-sea-foam/60 leading-relaxed max-w-md">
            Dibuat oleh <strong className="text-soft-cyan font-semibold">Kelompok Pacific Guardians</strong> sebagai bentuk visualisasi data interaktif untuk advokasi iklim global.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
          <span className="font-sans text-[9px] text-sea-foam/40 uppercase tracking-wider">
            Sumber Data Resmi
          </span>
          <a
            href="https://pacificdata.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-soft-cyan/20 bg-soft-cyan/5 hover:bg-soft-cyan/15 hover:border-soft-cyan/40 text-soft-cyan hover:text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,180,216,0.03)] hover:shadow-[0_0_20px_rgba(0,180,216,0.15)] backdrop-blur-sm"
          >
            <span>Buka Pacific Data Hub</span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
      </footer>
    </section>
  );
}

