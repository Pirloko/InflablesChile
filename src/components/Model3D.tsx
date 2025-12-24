import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'
import * as THREE from 'three'

interface Model3DProps {
  position: [number, number, number]
  scale: number
  rotation: [number, number, number]
}

const Model3D = ({ position, scale, rotation }: Model3DProps) => {
  const groupRef = useRef<Group>(null)
  
  // Cargar el modelo GLB
  const { scene } = useGLTF('/models/InflableOficialglb.glb')

  // Ajustar el modelo una sola vez cuando se carga
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          // Asegurar que el material sea visible
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.transparent = false
                  mat.opacity = 1
                }
              })
            } else if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.transparent = false
              child.material.opacity = 1
            }
          }
        }
      })
    }
  }, [scene])

  return (
    <primitive
      ref={groupRef}
      object={scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  )
}

// Precargar el modelo
useGLTF.preload('/models/InflableOficialglb.glb')

export default Model3D

