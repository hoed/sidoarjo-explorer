import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

function ClockRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={ref} position={[0, 0, -2.5]}>
      <torusGeometry args={[2.6, 0.02, 16, 120]} />
      <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.7} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function Lantern({ speed, offsetX, offsetZ, color, phase }: { speed: number; offsetX: number; offsetZ: number; color: string; phase: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * speed + phase) % 6;
    ref.current.position.set(offsetX + Math.sin(t) * 0.4, t - 3, offsetZ);
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.16, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

export default function EventsScene() {
  const lanterns = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        speed: 0.25 + Math.random() * 0.35,
        offsetX: (Math.random() - 0.5) * 6,
        offsetZ: -1 - Math.random() * 3,
        color: i % 2 ? "#FFD166" : "#00D4FF",
        phase: Math.random() * 6,
      })),
    [],
  );

  return (
    <SceneCanvas cameraPosition={[0, 0, 7]} fogColor="#0D1B2A" fogNear={5} fogFar={17} lightColor="#00D4FF">
      <ClockRing />
      {lanterns.map((l, i) => (
        <Lantern key={i} {...l} />
      ))}
    </SceneCanvas>
  );
}
