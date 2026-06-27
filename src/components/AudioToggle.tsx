"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 1. Generate Brown Noise Buffer
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter formula
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for loss of volume
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // 2. Filter to make it sound like a deep ocean wash
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350; // Deep cutoff
      filterRef.current = filter;

      // 3. Modulate gain (rhythmic swell of waves)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNodeRef.current = gainNode;

      // LFO to drive wave crashing cycles (approx 5s cycles)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.16; // ~6 seconds swell cycle
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.07; // swell amplitude

      // Connect LFO -> LFO Gain -> main Gain parameter
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);

      // Connect source path
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start nodes
      noiseSource.start(0);
      lfo.start(0);
      lfoRef.current = lfo;

      setIsPlaying(true);
    } catch (e) {
      console.error("Failed to initialize synthesized ocean audio context", e);
    }
  };

  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      startAudio();
      return;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    } else if (audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== "running") return;
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      
      let targetFreq = 350;
      let targetGain = 0.08;
      
      if (progress < 0.2) {
        const t = progress / 0.2;
        targetFreq = 350 + t * 50; // 350 -> 400 Hz
        targetGain = 0.08 + t * 0.02; // 0.08 -> 0.10
      } else if (progress >= 0.2 && progress < 0.85) {
        const t = (progress - 0.2) / 0.65;
        targetFreq = 400 + t * 100; // 400 -> 500 Hz
        targetGain = 0.10 + t * 0.04; // 0.10 -> 0.14
      } else {
        const t = (progress - 0.85) / 0.15;
        targetFreq = 500 - t * 380; // 500 -> 120 Hz (muffled underwater rumble)
        targetGain = 0.14 - t * 0.09; // 0.14 -> 0.05
      }
      
      const now = audioCtxRef.current.currentTime;
      if (filterRef.current) {
        filterRef.current.frequency.setTargetAtTime(targetFreq, now, 0.15);
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(targetGain, now, 0.15);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      className="fixed top-6 right-6 z-50 flex items-center justify-center p-3 rounded-full bg-deep-ocean/50 backdrop-blur-md border border-white/10 hover:border-soft-cyan/35 text-sea-foam hover:text-soft-cyan hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
      title={isPlaying ? "Mute Ocean Ambience" : "Play Ocean Ambience"}
    >
      {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}
