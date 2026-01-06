'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function GoldBar() {
  const mesh = useRef<THREE.Mesh>(null!)
  
  // Handled with institutional weight (slower, more deliberate rotation)
  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.3 
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={mesh} castShadow>
        {/* Proportions of a high-density 1kg PAMP Suisse Bar */}
        <boxGeometry args={[2.2, 1.1, 0.4]} />
        <meshPhysicalMaterial 
          color="#D4AF37" // Champagne Gold
          metalness={1} 
          roughness={0.12} 
          reflectivity={1}
          clearcoat={1} // The "Polished" layer
          clearcoatRoughness={0.1}
          emissive="#2a1f00"
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  )
}

export function DiamondAsset() {
  const mesh = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.4
    mesh.current.rotation.x += delta * 0.1
  })

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <mesh ref={mesh} castShadow>
        {/* Icosahedron provides more facets for light dispersion than a simple octahedron */}
        <icosahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          metalness={0} 
          roughness={0} 
          transmission={1} // True physical transparency
          thickness={2} // Bends light as it passes through the stone
          ior={2.417} // The actual Index of Refraction for a Diamond
          reflectivity={1}
          clearcoat={1}
          emissive="#e0f4ff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}