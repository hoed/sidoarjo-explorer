import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

function Frame({
  position,
  rotSpeed,
  color,
}: {
  position: [number, number, number];
  rotSpeed: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * rotSpeed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * rotSpeed * 0.6) * 0.3;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <planeGeometry args={[0.9, 1.15]} />
        <meshStandardMaterial color="#0D1B2A" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.15)]} />
        <lineBasicMaterial color={color} transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}

export default function GalleryScene() {
  const frames = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -1 - Math.random() * 4] as [number, number, number],
        rotSpeed: 0.15 + Math.random() * 0.25,
        color: i % 2 ? "#FFD166" : "#00D4FF",
      })),
    [],
  );

  return (
    <SceneCanvas cameraPosition={[0, 0, 7]} fogColor="#0D1B2A" fogNear={5} fogFar={16} lightColor="#FFD166">
      {frames.map((f, i) => (
        <Frame key={i} {...f} />
      ))}
    </SceneCanvas>
  );
}
