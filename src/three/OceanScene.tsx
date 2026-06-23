"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom uniforms for scroll-driven ocean morphing
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uColorA: { value: new THREE.Color("#061826") }, // deep ocean
      uColorB: { value: new THREE.Color("#0B3D5C") }, // ocean blue
      uColorC: { value: new THREE.Color("#00B4D8") }, // deep cyan
      uColorSunset: { value: new THREE.Color("#140b03") }, // sunset glow base
      uCrestColor: { value: new THREE.Color("#4CC9F0") }, // soft cyan crests
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      uniforms.uScrollProgress.value = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [uniforms]);

  // Shader code for dynamic animated ocean surface
  const shaderArgs = useMemo(() => {
    return {
      uniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uScrollProgress;
        varying vec3 vPosition;
        varying float vElevation;
        
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          // Wave height scale increases as scroll progress increases (representing ocean rising/growing rougher)
          float waveScale = 0.4 + uScrollProgress * 1.2;
          
          float elevation = sin(modelPosition.x * 0.15 + uTime * 0.7) * 0.6 * waveScale;
          elevation += cos(modelPosition.z * 0.1 + uTime * 0.5) * 0.5 * waveScale;
          elevation += noise(modelPosition.xz * 0.4 + uTime * 0.25) * 0.4 * waveScale;
          
          modelPosition.y += elevation;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectionPosition;
          
          vPosition = modelPosition.xyz;
          vElevation = elevation;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform vec3 uColorSunset;
        uniform vec3 uCrestColor;
        uniform float uScrollProgress;
        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          float mixStrength = (vElevation + 1.0) * 0.5;
          
          // Transition base color to a sunset warm color at the very end of the scroll
          vec3 baseColor = mix(uColorA, uColorB, mixStrength);
          if (uScrollProgress > 0.8) {
            float sunsetFactor = smoothstep(0.8, 1.0, uScrollProgress);
            baseColor = mix(baseColor, uColorSunset, sunsetFactor);
          }
          
          // Highlights
          vec3 color = mix(baseColor, uColorC, smoothstep(0.0, 1.0, vElevation) * 0.3);
          
          // Crests
          if (vElevation > 0.3) {
            float crestStrength = smoothstep(0.3, 1.2, vElevation);
            color = mix(color, uCrestColor, crestStrength * 0.35);
          }
          
          // Depth Fog
          float fogFactor = smoothstep(8.0, 28.0, length(vPosition.xz));
          color = mix(color, mix(uColorA, uColorSunset, smoothstep(0.8, 1.0, uScrollProgress)), fogFactor * 0.75);

          gl_FragColor = vec4(color, 0.9);
        }
      `,
    };
  }, [uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[65, 65, 128, 128]} />
      <shaderMaterial
        vertexShader={shaderArgs.vertexShader}
        fragmentShader={shaderArgs.fragmentShader}
        uniforms={shaderArgs.uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SeaParticles({ count = 350 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = Math.random() * 10 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45;
      spd[i] = 0.04 + Math.random() * 0.06;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += speeds[i] * 0.04;
        if (posArr[i * 3 + 1] > 6) {
          posArr[i * 3 + 1] = -5;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4CC9F0"
        size={0.07}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// React component wrapping the canvas
export default function OceanScene() {
  return (
    <div className="fixed inset-0 w-full h-full -z-20 pointer-events-none bg-gradient-to-b from-[#030d14] via-[#061826] to-[#030d14]">
      <Canvas
        camera={{ position: [0, 4, 16], fov: 42 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 10, 5]} color="#4CC9F0" intensity={0.9} />
        <pointLight position={[-12, 6, -12]} color="#00B4D8" intensity={0.6} />
        <fog attach="fog" args={["#061826", 12, 28]} />
        <WaveMesh />
        <SeaParticles count={350} />
      </Canvas>
    </div>
  );
}
