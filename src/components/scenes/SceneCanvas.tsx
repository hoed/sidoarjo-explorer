import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

export function SceneCanvas({
  children,
  cameraPosition = [0, 0, 6],
  fov = 50,
  fogColor,
  fogNear = 6,
  fogFar = 18,
  lightColor = "#00D4FF",
}: {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  lightColor?: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      {fogColor && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} color={lightColor} />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
