import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

function GongRing({
  radius,
  tube,
  speed,
  color,
  position,
}: {
  radius: number;
  tube: number;
  speed: number;
  color: string;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[radius, tube, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.25} />
      </mesh>
    </Float>
  );
}

function IncenseSmoke({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = Math.random() * 8 - 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame(() => {
    const pos = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + 0.006;
      pos.setY(i, y > 4 ? -4 : y);
      pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 0.002);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.03} color="#FFD166" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function CultureScene() {
  return (
    <SceneCanvas cameraPosition={[0, 0, 7]} fogColor="#0D1B2A" fogNear={5} fogFar={17} lightColor="#FFD166">
      <GongRing radius={2.2} tube={0.05} speed={0.6} color="#FFD166" position={[1.6, 0.4, -1]} />
      <GongRing radius={1.4} tube={0.04} speed={0.9} color="#00D4FF" position={[-1.8, -0.6, -2]} />
      <GongRing radius={0.9} tube={0.03} speed={1.2} color="#FFD166" position={[0.4, 1.2, -2.5]} />
      <IncenseSmoke />
    </SceneCanvas>
  );
}
