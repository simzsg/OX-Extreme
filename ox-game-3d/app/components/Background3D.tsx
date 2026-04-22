"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Grid } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import type { Group } from "three"
import * as THREE from "three"

const mouse = { x: 0, y: 0 }

function Particles() {
  const group = useRef<Group>(null)

  const [items] = useState(() => Array.from({ length: 50 }).map(() => ({
    position: [
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20 + 2,
      (Math.random() - 0.5) * 20 - 5
    ] as [number, number, number],
    rotation: [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      0
    ] as [number, number, number],
    scale: Math.random() * 0.6 + 0.2,
    isX: Math.random() > 0.5
  })))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    if (group.current) {
      const targetX = mouse.y * 0.4
      const targetY = mouse.x * 0.4
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
    }
  })

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Float key={i} speed={1.2} rotationIntensity={2} floatIntensity={1.5}>
          <mesh position={item.position} rotation={item.rotation} scale={item.scale}>
            {item.isX ? (
              <boxGeometry args={[0.5, 0.5, 0.5]} />
            ) : (
              <torusGeometry args={[0.3, 0.08, 16, 32]} />
            )}
            <meshStandardMaterial 
              color={item.isX ? "#ef4444" : "#a1a1aa"} 
              emissive={item.isX ? "#991b1b" : "#27272a"}
              emissiveIntensity={0.6}
              metalness={0.9} 
              roughness={0.2}
              opacity={0.7}
              transparent
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default function Background3D() {
  const [canvasKey, setCanvasKey] = useState<number | null>(null)
  const sceneRef = useRef<THREE.Scene>(null)
  const glRef = useRef<THREE.WebGLRenderer>(null)

  useEffect(() => {
    // Delay Canvas creation to let any old WebGL context fully clean up
    const timer = setTimeout(() => setCanvasKey(Date.now()), 100)
    
    const scene = sceneRef.current
    const gl = glRef.current
    
    return () => {
      clearTimeout(timer)
      setCanvasKey(null)

      if (scene) {
        scene.traverse((object: THREE.Object3D) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose()
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((m: THREE.Material) => m.dispose())
              } else {
                object.material.dispose()
              }
            }
          }
        })
      }
      if (gl) {
        gl.dispose()
        gl.forceContextLoss()
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {canvasKey && (
        <Canvas 
          key={canvasKey}
          camera={{ position: [0, 0, 10], fov: 50 }} 
          dpr={[1, 2]}
          onCreated={({ gl, scene }) => {
            glRef.current = gl;
            sceneRef.current = scene;
          }}
        >
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ff0000" />
          <pointLight position={[-10, 0, -5]} intensity={6} color="#ffffff" distance={25} />
          <pointLight position={[0, -5, 5]} intensity={3} color="#ef4444" distance={15} />
          
          <Particles />
          
          <Grid 
            position={[0, -6, 0]} 
            args={[80, 80]} 
            cellColor="#ff0000" 
            sectionColor="#991b1b" 
            sectionSize={3} 
            fadeDistance={35}
            cellThickness={0.7}
          />
          
          <fog attach="fog" args={["#000000", 12, 30]} />
        </Canvas>
      )}
    </div>
  )
}
