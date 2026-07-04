import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

function BowlRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.3, 0, 0]} position={[0, -1.4, -1.5]}>
      <torusGeometry args={[2, 0.06, 16, 100]} />
      <meshStandardMaterial color="#FFD166" emissive="#FFD166" emissiveIntensity={0.6} metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

function Steam({ count = 320 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1.6;
      const th = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(th) * r;
      positions[i * 3 + 1] = Math.random() * 6 - 3;
      positions[i * 3 + 2] = Math.sin(th) * r - 1.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + 0.007;
      pos.setY(i, y > 3.5 ? -3.5 : y);
      pos.setX(i, pos.getX(i) + Math.sin(t + i) * 0.0015);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.035} color="#FFEAB0" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function SpiceOrb({ radius, speed, color, offset }: { radius: number; speed: number; color: string; offset: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * 0.6, Math.sin(t) * radius - 1.5);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

export default function CulinaryScene() {
  return (
    <SceneCanvas cameraPosition={[0, 0.2, 6.5]} fogColor="#0D1B2A" fogNear={5} fogFar={16} lightColor="#FFD166">
      <BowlRing />
      <Steam />
      <SpiceOrb radius={2.4} speed={0.4} color="#FF7A59" offset={0} />
      <SpiceOrb radius={1.8} speed={0.55} color="#00D4FF" offset={2} />
      <SpiceOrb radius={2.1} speed={0.35} color="#FFD166" offset={4} />
    </SceneCanvas>
  );
}
