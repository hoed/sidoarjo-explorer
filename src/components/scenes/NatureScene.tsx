import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

function WaterPlane() {
  const ref = useRef<THREE.Mesh>(null!);
  const geom = useMemo(() => new THREE.PlaneGeometry(14, 14, 60, 60), []);
  const base = useMemo(() => {
    const pos = geom.attributes.position as THREE.BufferAttribute;
    return Float32Array.from(pos.array);
  }, [geom]);

  useFrame((state) => {
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z = Math.sin(x * 0.6 + t * 0.6) * 0.18 + Math.cos(y * 0.5 + t * 0.4) * 0.14;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={ref} geometry={geom} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.6, -2]}>
      <meshStandardMaterial
        color="#0D3B3E"
        emissive="#00D4FF"
        emissiveIntensity={0.12}
        metalness={0.6}
        roughness={0.35}
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function Fireflies({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const { geom, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 6 - 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      speeds[i] = 0.2 + Math.random() * 0.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, speeds };
  }, [count]);

  useFrame((state) => {
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + speeds[i] * 0.003;
      pos.setY(i, y > 3 ? -3 : y);
      pos.setX(i, pos.getX(i) + Math.sin(t * speeds[i] + i) * 0.002);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.055} color="#8CF7E0" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function NatureScene() {
  return (
    <SceneCanvas cameraPosition={[0, 0.4, 6]} fogColor="#0D1B2A" fogNear={4} fogFar={16} lightColor="#00D4FF">
      <WaterPlane />
      <Fireflies />
    </SceneCanvas>
  );
}
