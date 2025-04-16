import * as THREE from "three";

/**
 * Creates a fallback texture with a given color
 */
export function createFallbackTexture(color = "#cccccc"): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) {
    console.error("Failed to get 2D context");
    return new THREE.Texture(); // Return empty texture as fallback
  }

  // Fill with base color
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add some noise/texture
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
    context.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

/**
 * Calculate elliptical orbit parameters
 */
export function calculateOrbitParameters(
  orbitDistance: number,
  eccentricity: number
) {
  const semiMajorAxis = orbitDistance;
  const semiMinorAxis =
    orbitDistance * Math.sqrt(1 - eccentricity * eccentricity);
  const focalDistance = Math.sqrt(
    semiMajorAxis * semiMajorAxis - semiMinorAxis * semiMinorAxis
  );

  return { semiMajorAxis, semiMinorAxis, focalDistance };
}

/**
 * Create an elliptical orbit path geometry
 */
export function createOrbitPath(
  semiMajorAxis: number,
  semiMinorAxis: number,
  focalDistance: number
) {
  const curve = new THREE.EllipseCurve(
    -focalDistance, // x center is offset by focal distance
    0, // y center
    semiMajorAxis,
    semiMinorAxis,
    0,
    2 * Math.PI,
    false,
    0
  );

  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y))
  );

  return geometry;
}
