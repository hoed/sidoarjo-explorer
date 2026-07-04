import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

function TempleStack() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  const tiers = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        size: 2.4 - i * 0.4,
        y: -1.6 + i * 0.42,
      })),
    [],
  );

  return (
    <group ref={group} position={[0, -0.3, -2]}>
      {tiers.map((t, i) => (
        <mesh key={i} position={[0, t.y, 0]}>
          <boxGeometry args={[t.size, 0.36, t.size]} />
          <meshStandardMaterial color="#3A2C1E" emissive="#FFD166" emissiveIntensity={0.08} roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.3, 0.6, 4]} />
        <meshStandardMaterial color="#FFD166" emissive="#FFD166" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function DustMotes({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.025} color="#00D4FF" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HistoryScene() {
  return (
    <SceneCanvas cameraPosition={[0, 0.3, 7]} fogColor="#0D1B2A" fogNear={5} fogFar={17} lightColor="#FFD166">
      <TempleStack />
      <DustMotes />
    </SceneCanvas>
  );
}
