import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Environment } from "@react-three/drei";
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

function TerrainOrb() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.7, 6]} />
        <meshStandardMaterial
          color="#0D1B2A"
          emissive="#00D4FF"
          emissiveIntensity={0.18}
          metalness={0.85}
          roughness={0.22}
          wireframe={false}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.72, 3]} />
        <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.28} />
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
        <Environment preset="night" />
        <TerrainOrb />
        <GoldRing />
        <Particles />
        <Stars radius={40} depth={30} count={2500} factor={2.5} fade speed={0.6} />
      </Suspense>
    </Canvas>
  );
}
