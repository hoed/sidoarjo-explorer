import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      ref.current.rotation.x += dt * 0.008;
    }
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.02} color="#00D4FF" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function useEarthTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Ocean base
    const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ocean.addColorStop(0, "#0a3a52");
    ocean.addColorStop(0.5, "#0e4a66");
    ocean.addColorStop(1, "#0a3a52");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Deterministic pseudo-random so the texture is stable across renders
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Continent-like landmasses as soft blobby clusters, wrapped at the
    // seam so they tile seamlessly around the sphere.
    const landColors = ["#3f7d4f", "#5a8f4e", "#8a7a45", "#4f8a6b"];
    for (let cluster = 0; cluster < 9; cluster++) {
      const baseX = rand() * canvas.width;
      const baseY = 70 + rand() * (canvas.height - 140);
      const blobs = 8 + Math.floor(rand() * 10);
      for (let i = 0; i < blobs; i++) {
        const cx = baseX + (rand() - 0.5) * 160;
        const cy = baseY + (rand() - 0.5) * 90;
        const r = 18 + rand() * 42;
        const color = landColors[Math.floor(rand() * landColors.length)];
        for (const dx of [-canvas.width, 0, canvas.width]) {
          const grad = ctx.createRadialGradient(cx + dx, cy, 0, cx + dx, cy, r);
          grad.addColorStop(0, color);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(cx + dx, cy, r, r * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Subtle latitude/longitude graticule
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += canvas.width / 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += canvas.height / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Polar ice caps
    const poleGradTop = ctx.createLinearGradient(0, 0, 0, 40);
    poleGradTop.addColorStop(0, "rgba(230,240,245,0.85)");
    poleGradTop.addColorStop(1, "rgba(230,240,245,0)");
    ctx.fillStyle = poleGradTop;
    ctx.fillRect(0, 0, canvas.width, 40);
    const poleGradBottom = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
    poleGradBottom.addColorStop(0, "rgba(230,240,245,0)");
    poleGradBottom.addColorStop(1, "rgba(230,240,245,0.85)");
    ctx.fillStyle = poleGradBottom;
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function TerrainOrb() {
  const ref = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const earthTexture = useEarthTexture();

  useFrame((state, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.09;
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.5}>
      {/* The globe itself — smooth sphere, textured, slowly spinning */}
      <mesh ref={ref}>
        <sphereGeometry args={[1.7, 64, 64]} />
        <meshStandardMaterial map={earthTexture} metalness={0.15} roughness={0.75} emissive="#00D4FF" emissiveIntensity={0.05} />
      </mesh>
      {/* Thin cloud-like haze layer, rotating at a slightly different speed */}
      <mesh ref={cloudsRef} scale={1.015}>
        <sphereGeometry args={[1.7, 48, 48]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.06} roughness={1} depthWrite={false} />
      </mesh>
      {/* Atmosphere glow rim, viewed from the back of a slightly larger sphere */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1.7, 48, 48]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.14} side={THREE.BackSide} />
      </mesh>
    </Float>
  );
}

function GoldRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.25;
    ref.current.rotation.y = s.clock.elapsedTime * 0.18;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusGeometry args={[2.4, 0.015, 16, 200]} />
      <meshStandardMaterial color="#FFD166" emissive="#FFD166" emissiveIntensity={0.6} metalness={1} roughness={0.15} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0a1220"]} />
      <fog attach="fog" args={["#0a1220", 6, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#FFD166" />
      <pointLight position={[-4, -2, -2]} intensity={1.2} color="#00D4FF" />
      <Suspense fallback={null}>
        <TerrainOrb />
        <GoldRing />
        <Particles />
        <Stars radius={40} depth={30} count={2500} factor={2.5} fade speed={0.6} />
      </Suspense>
    </Canvas>
  );
}
