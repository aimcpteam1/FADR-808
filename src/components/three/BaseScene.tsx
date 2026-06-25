"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import type { ReactNode } from "react";

interface BaseSceneProps {
  children?: ReactNode;
  className?: string;
  controls?: boolean;
}

/**
 * Reusable R3F Canvas wrapper.
 * Feature-specific 3D content is composed as children.
 */
export function BaseScene({ children, className, controls = false }: BaseSceneProps) {
  return (
    <div className={className ?? "w-full h-full"}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {children}

        {controls && <OrbitControls enableZoom={false} />}
        <Preload all />
      </Canvas>
    </div>
  );
}
