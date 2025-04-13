"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"

export default function PlanetPage({ params }) {
  const planetId = params.id
  const textureUrl = `/textures/${planetId}.jpg`

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <PlanetModel texture={textureUrl} />
        </Suspense>
        <OrbitControls />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
      </Canvas>
    </div>
  )
}

// Update the PlanetModel component to handle texture loading errors
function PlanetModel({ texture }) {
  // Create a fallback texture with the planet's color
  const createFallbackTexture = (color = "#cccccc") => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext("2d")

    // Fill with base color
    context.fillStyle = color
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Add some noise/texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 2
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`
      context.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }

  // Use a placeholder texture
  const planetTexture = useTexture(
    texture,
    (loadedTexture) => {
      console.log(`Loaded texture: ${texture}`)
    },
    (error) => {
      console.error(`Error loading texture ${texture}:`, error)
      return createFallbackTexture()
    },
  )

  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial map={planetTexture} metalness={0.2} roughness={0.8} />
    </mesh>
  )
}
