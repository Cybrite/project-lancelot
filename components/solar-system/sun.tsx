import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SunProps {
  position?: [number, number, number];
}

export default function Sun({ position = [0, 0, 0] }: SunProps) {
  const sunRef = useRef<THREE.Mesh>(null);

  const sunTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Failed to get 2D context");
      return new THREE.Texture();
    }

    // Create a radial gradient
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );

    gradient.addColorStop(0, "#ffff00");
    gradient.addColorStop(0.5, "#ffcc00");
    gradient.addColorStop(1, "#ff6600");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={sunRef} position={position}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive="#ffcc00"
        emissiveIntensity={5}
      />
      <pointLight intensity={5000} distance={10 ** 20} color="#ffcc00" />
    </mesh>
  );
}
