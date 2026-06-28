"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// Global-to-module scroll height caching to prevent forced reflows (layout thrashing)
let maxScroll = 0;
if (typeof window !== "undefined") {
  const updateMaxScroll = () => {
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  };
  window.addEventListener("resize", updateMaxScroll);
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(updateMaxScroll);
    observer.observe(document.body);
  }
  // Initial calculation
  setTimeout(updateMaxScroll, 100);
}

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
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      material.uniforms.uScrollProgress.value = progress;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[120, 120, 128, 128]} />
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

  // Initialize static particle coordinates and speed offsets
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = Math.random() * 11 - 5; // -5 to 6 range (range of 11)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45;
      spd[i] = 0.8 + Math.random() * 1.2; // vertical speed units per second
    }
    return [pos, spd];
  }, [count]);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#4CC9F0") },
    };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms && material.uniforms.uTime) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          args={[speeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        transparent={true}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          attribute float aSpeed;
          varying float vOpacity;

          void main() {
            vec3 pos = position;
            
            // Animate Y position on the GPU:
            // Range is from y = -5.0 to y = 6.0 (total height is 11.0)
            float minY = -5.0;
            float rangeY = 11.0;
            
            // Calculate new Y using mod to wrap around smoothly
            pos.y = mod(pos.y + aSpeed * uTime - minY, rangeY) + minY;
            
            vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            
            // Size attenuation (larger when closer to camera)
            gl_PointSize = 40.0 * aSpeed / -viewPosition.z;
            gl_Position = projectionMatrix * viewPosition;
            
            // Fade out near the top (6) and bottom (-5) boundaries to prevent sudden popping
            float distFromCenter = abs(pos.y - 0.5); // Center is 0.5
            vOpacity = 1.0 - smoothstep(4.0, 5.5, distFromCenter);
          }
        `}
        fragmentShader={`
          varying float vOpacity;
          uniform vec3 uColor;

          void main() {
            // Soft circular particles
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.15, dist) * vOpacity * 0.45;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}

function CameraRig() {
  const { camera, scene } = useThree();
  
  useFrame(() => {
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    
    let targetY = 4.0;
    let targetZ = 16.0;
    let targetX = 0.0;
    let targetFov = 42;
    
    if (progress < 0.2) {
      const t = progress / 0.2;
      targetY = THREE.MathUtils.lerp(4.0, 2.5, t);
      targetZ = THREE.MathUtils.lerp(16.0, 14.0, t);
    } else if (progress >= 0.2 && progress < 0.85) {
      const t = (progress - 0.2) / 0.65;
      targetY = THREE.MathUtils.lerp(2.5, 4.5, t);
      targetZ = THREE.MathUtils.lerp(14.0, 16.0, t);
    } else {
      const t = (progress - 0.85) / 0.15;
      // Sink camera under the waves (waves are at y = -2.5)
      targetY = THREE.MathUtils.lerp(4.5, -4.2, t);
      targetZ = THREE.MathUtils.lerp(16.0, 10.0, t);
      targetX = THREE.MathUtils.lerp(0.0, 1.5, t);
      targetFov = THREE.MathUtils.lerp(42, 60, t);
    }
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
      camera.updateProjectionMatrix();
    }
    
    const fog = scene.fog;
    if (fog && fog instanceof THREE.Fog) {
      if (progress > 0.85) {
        const t = (progress - 0.85) / 0.15;
        const color = new THREE.Color().lerpColors(new THREE.Color("#061826"), new THREE.Color("#140b03"), t);
        fog.color.copy(color);
        scene.background = color;
        fog.near = THREE.MathUtils.lerp(12, 1, t);
        fog.far = THREE.MathUtils.lerp(28, 12, t);
      } else {
        const color = new THREE.Color("#061826");
        fog.color.copy(color);
        scene.background = color;
        fog.near = 12;
        fog.far = 28;
      }
    }
    
    camera.lookAt(0, -2.5, 0);
  });
  
  return null;
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
        <CameraRig />
        <WaveMesh />
        <SeaParticles count={350} />
      </Canvas>
    </div>
  );
}
