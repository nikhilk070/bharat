"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 350;
const MAX_DISTANCE = 3.5;

function NetworkNodes() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate initial random positions and colors for nodes
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);

    // Brand Colors
    const colorChoices = [
      new THREE.Color("#F47220"), // Saffron
      new THREE.Color("#1DB05A"), // Green
      new THREE.Color("#94A3B8"), // Muted Blue-Grey
      new THREE.Color("#CBD5E1"), // Light Slate
    ];

    for (let i = 0; i < COUNT; i++) {
      // Spread nodes in a massive tunnel: X[-15,15], Y[-15,15], Z[10, -80]
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = 10 - Math.random() * 90;

      const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = randomColor.r;
      col[i * 3 + 1] = randomColor.g;
      col[i * 3 + 2] = randomColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Update loop for animations and line drawing
  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    // Very subtle slow global rotation
    pointsRef.current.rotation.z -= delta * 0.01;
    linesRef.current.rotation.z -= delta * 0.01;

    const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    const linePositions = [];
    const lineColors = [];

    // Draw lines between nodes that are close to each other
    for (let i = 0; i < COUNT; i++) {
      const x1 = currentPositions[i * 3];
      const y1 = currentPositions[i * 3 + 1];
      const z1 = currentPositions[i * 3 + 2];

      // Give nodes a tiny floating movement using sine waves
      currentPositions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;
      currentPositions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 0.4 + i) * 0.005;

      for (let j = i + 1; j < COUNT; j++) {
        const x2 = currentPositions[j * 3];
        const y2 = currentPositions[j * 3 + 1];
        const z2 = currentPositions[j * 3 + 2];

        const distSq = (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;

        if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
          linePositions.push(x1, y1, z1, x2, y2, z2);

          // Use slate grey for connection lines
          lineColors.push(0.6, 0.6, 0.6, 0.6, 0.6, 0.6);
        }
      }
    }

    // Update line geometry dynamically
    linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.2} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.15} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function CinematicCamera() {
  useFrame((state) => {
    // Parallax effect based on mouse movement
    const targetX = (state.mouse.x * 3);
    const targetY = (state.mouse.y * 3);

    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;

    // Cinematic Scroll Effect:
    // Tie the camera's Z position to the window scroll.
    // As user scrolls down, camera flies deep into the network.
    const scrollY = window.scrollY || 0;
    // Base Z is 10. For every 100px scrolled, move forward by 4 units.
    const targetZ = 10 - (scrollY * 0.04);

    // Smooth camera Z movement
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1;
  });
  return null;
}

export default function NetworkScene() {
  return (
    // Fixed wrapper so it acts as a background for the entire page scroll
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {/* Fog perfectly matches the #050505 background to hide distant nodes elegantly */}
        <fog attach="fog" args={["#050505", 5, 45]} />
        <NetworkNodes />
        <CinematicCamera />
      </Canvas>
    </div>
  );
}
