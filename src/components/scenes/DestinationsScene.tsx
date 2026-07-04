import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

const NODE_COUNT = 8;

function Constellation() {
  const group = useRef<THREE.Group>(null!);
  const nodePositions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const th = (i / NODE_COUNT) * Math.PI * 2;
      const r = 2 + Math.sin(i * 1.7) * 0.6;
      pts.push(new THREE.Vector3(Math.cos(th) * r, Math.sin(i * 1.3) * 1.2, Math.sin(th) * r - 1));
    }
    return pts;
  }, []);

  const lineGeom = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      const a = nodePositions[i];
      const b = nodePositions[(i + 1) % nodePositions.length];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    return g;
  }, [nodePositions]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.1;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#00D4FF" transparent opacity={0.35} />
      </lineSegments>
      {nodePositions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 20, 20]} />
          <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Backdrop({ count = 300 }: { count?: number }) {
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.5;
      positions[i * 3 + 2] = r * Math.cos(ph) - 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  return (
    <points geometry={geom}>
      <pointsMaterial size={0.02} color="#8CF7E0" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function DestinationsScene() {
  return (
    <SceneCanvas cameraPosition={[0, 0, 7]} fogColor="#0D1B2A" fogNear={6} fogFar={18} lightColor="#00D4FF">
      <Constellation />
      <Backdrop />
    </SceneCanvas>
  );
}
