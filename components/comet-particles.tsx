"use client";

import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CometParticlesProps {
  count?: number;
  size?: number;
  scale?: [number, number, number];
  color?: string;
  spreadFactor?: number;
  position?: [number, number, number];
  velocity?: [number, number, number];
  trailLength?: number;
}

export default function CometParticles({
  count = 300,
  size = 0.1, // Reduced size
  scale = [15, 3, 3], // Reduced scale
  color = "#88ccff",
  spreadFactor = 0.4, // Reduced spread
  position = [0, 0, 0],
  velocity = [-1, 0, 0], // Default velocity in negative x direction
  trailLength = 10,
}: CometParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const prevPositionRef = useRef<[number, number, number]>([...position]);

  // Normalize velocity vector for calculations
  const normalizedVelocity = useMemo(() => {
    const vec = new THREE.Vector3(...velocity);
    return vec.normalize().toArray() as [number, number, number];
  }, [velocity]);

  // Create particles with random positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocityVec = new THREE.Vector3(...normalizedVelocity);

    // Create basis vectors for our coordinate system aligned with velocity
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(up, velocityVec).normalize();
    if (right.length() === 0) right.set(0, 0, 1);
    up.crossVectors(velocityVec, right).normalize();

    for (let i = 0; i < count; i++) {
      // Distance behind the comet (0 = at comet, 1 = full trail length)
      const distanceFactor = Math.random();

      // Position along the trail
      const trailX = position[0] - velocityVec.x * trailLength * distanceFactor;
      const trailY = position[1] - velocityVec.y * trailLength * distanceFactor;
      const trailZ = position[2] - velocityVec.z * trailLength * distanceFactor;

      // Add spread that's perpendicular to the velocity vector
      const spread = spreadFactor * Math.min(1, distanceFactor * 3);
      const rightOffset = (Math.random() - 0.5) * scale[1] * spread;
      const upOffset = (Math.random() - 0.5) * scale[2] * spread;

      positions[i * 3] = trailX + right.x * rightOffset + up.x * upOffset;
      positions[i * 3 + 1] = trailY + right.y * rightOffset + up.y * upOffset;
      positions[i * 3 + 2] = trailZ + right.z * rightOffset + up.z * upOffset;
    }

    return positions;
  }, [count, position, normalizedVelocity, scale, spreadFactor, trailLength]);

  // Create particle sizes, smaller the further from comet
  const particleSizes = useMemo(() => {
    const sizes = new Float32Array(count);
    const velocityVec = new THREE.Vector3(...normalizedVelocity);

    for (let i = 0; i < count; i++) {
      const particlePos = new THREE.Vector3(
        particlesPosition[i * 3],
        particlesPosition[i * 3 + 1],
        particlesPosition[i * 3 + 2]
      );
      const cometPos = new THREE.Vector3(...position);

      // Distance from comet head
      const distance = particlePos.distanceTo(cometPos);
      // Normalized distance (0 = at comet, 1 = max distance)
      const normalizedDist = Math.min(1, distance / trailLength);

      // Particles get smaller further from the comet
      sizes[i] = size * (1 - normalizedDist * 0.8);
    }

    return sizes;
  }, [
    count,
    particlesPosition,
    size,
    position,
    trailLength,
    normalizedVelocity,
  ]);

  // Create particle colors, fading out along the tail
  const particleColors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color(color);
    const velocityVec = new THREE.Vector3(...normalizedVelocity);

    for (let i = 0; i < count; i++) {
      const particlePos = new THREE.Vector3(
        particlesPosition[i * 3],
        particlesPosition[i * 3 + 1],
        particlesPosition[i * 3 + 2]
      );
      const cometPos = new THREE.Vector3(...position);

      // Distance from comet head
      const distance = particlePos.distanceTo(cometPos);
      // Normalized distance (0 = at comet, 1 = max distance)
      const normalizedDist = Math.min(1, distance / trailLength);

      // Fade out color along the tail
      const opacity = 1 - normalizedDist * 0.9;

      colors[i * 3] = color1.r;
      colors[i * 3 + 1] = color1.g;
      colors[i * 3 + 2] = color1.b * opacity;
    }

    return colors;
  }, [
    count,
    particlesPosition,
    color,
    position,
    trailLength,
    normalizedVelocity,
  ]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const velocityVec = new THREE.Vector3(...velocity);
      const speedFactor = velocityVec.length() * delta;

      // Track comet movement
      const positionChanged =
        position[0] !== prevPositionRef.current[0] ||
        position[1] !== prevPositionRef.current[1] ||
        position[2] !== prevPositionRef.current[2];

      const movementVector = [
        position[0] - prevPositionRef.current[0],
        position[1] - prevPositionRef.current[1],
        position[2] - prevPositionRef.current[2],
      ];

      // Create basis vectors for our coordinate system aligned with velocity
      const velocityDir = new THREE.Vector3(...normalizedVelocity);
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3()
        .crossVectors(up, velocityDir)
        .normalize();
      if (right.length() === 0) right.set(0, 0, 1);
      up.crossVectors(velocityDir, right).normalize();

      for (let i = 0; i < count; i++) {
        const px = positions[i * 3];
        const py = positions[i * 3 + 1];
        const pz = positions[i * 3 + 2];

        const particlePos = new THREE.Vector3(px, py, pz);
        const cometPos = new THREE.Vector3(...position);

        // Distance from comet head
        const distance = particlePos.distanceTo(cometPos);

        if (positionChanged) {
          // Move particles with the comet
          positions[i * 3] += movementVector[0];
          positions[i * 3 + 1] += movementVector[1];
          positions[i * 3 + 2] += movementVector[2];
        }

        // Flow along the velocity direction
        positions[i * 3] -=
          velocityDir.x * speedFactor * (0.5 + Math.random() * 1.5);
        positions[i * 3 + 1] -=
          velocityDir.y * speedFactor * (0.5 + Math.random() * 1.5);
        positions[i * 3 + 2] -=
          velocityDir.z * speedFactor * (0.5 + Math.random() * 1.5);

        // If particle moves too far, reset it to the comet head with slight offset
        if (distance > trailLength) {
          const rightOffset = (Math.random() - 0.5) * scale[1] * 0.2;
          const upOffset = (Math.random() - 0.5) * scale[2] * 0.2;

          positions[i * 3] =
            position[0] + right.x * rightOffset + up.x * upOffset;
          positions[i * 3 + 1] =
            position[1] + right.y * rightOffset + up.y * upOffset;
          positions[i * 3 + 2] =
            position[2] + right.z * rightOffset + up.z * upOffset;
        }

        // Random jitter to make it look more natural - less jitter for particles near the head
        const jitterAmount = 0.05 * Math.min(1, distance / (trailLength * 0.3));
        positions[i * 3 + 1] += (Math.random() - 0.5) * jitterAmount;
        positions[i * 3 + 2] += (Math.random() - 0.5) * jitterAmount;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      prevPositionRef.current = [...position];
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[particlesPosition, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          args={[particleSizes, 1]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          args={[particleColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
