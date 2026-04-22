"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { useGameStore } from "@/lib/store"
import { Player } from "@/lib/game-logic"
import { Suspense, useState, useEffect, useRef, useMemo } from "react"
import * as THREE from "three"

function XGeometry() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} />
      </mesh>
    </group>
  )
}

function Piece({ type, isWinning }: { type: Player, isWinning: boolean }) {
  if (!type) return null
  
  return (
    <Float floatIntensity={isWinning ? 4 : 1} rotationIntensity={isWinning ? 2 : 0.5} speed={2}>
      {type === "X" ? (
        <XGeometry />
      ) : (
        <mesh>
          <torusGeometry args={[0.4, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color={isWinning ? "#ffffff" : "#ff3333"} 
            metalness={1} 
            roughness={0} 
            emissive={isWinning ? "#ffffff" : "#ff0000"} 
            emissiveIntensity={isWinning ? 10 : 2} 
          />
        </mesh>
      )}
    </Float>
  )
}

function Board() {
  const { board, setSquare, currentPlayer, winner, isBotThinking, playerSide } = useGameStore()
  const [hovered, setHovered] = useState<number | null>(null)

  const handleCellClick = (index: number) => {
    if (winner || board[index] || currentPlayer !== playerSide || isBotThinking || !playerSide) return
    setSquare(index, playerSide)
  }

  const cells = useMemo(() => {
    const arr = []
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3)
      const col = i % 3
      const x = (col - 1) * 1.6
      const z = (row - 1) * 1.6
      arr.push({ id: i, pos: [x, 0, z] })
    }
    return arr
  }, [])

  return (
    <group>
      {cells.map(({ id, pos }) => (
        <group key={id} position={pos as [number, number, number]}>
      
          <mesh
            onPointerOver={() => setHovered(id)}
            onPointerOut={() => setHovered(null)}
            onPointerDown={(e) => {
              e.stopPropagation()
              handleCellClick(id)
            }}
          >
            <boxGeometry args={[1.5, 0.1, 1.5]} />
            <meshStandardMaterial
              transparent
              opacity={0.9}
              metalness={0.8}
              roughness={0.2}
              color={hovered === id && !board[id] && !winner ? "#660000" : "#222222"}
              emissive={hovered === id && !board[id] && !winner ? "#330000" : "#000000"}
            />
          </mesh>

       
          {hovered === id && !board[id] && !winner && (
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.55, 0.05, 1.55]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={10} transparent opacity={0.5} />
            </mesh>
          )}
          
          {board[id] && (
            <group position={[0, 0.6, 0]}>
              <Piece type={board[id]} isWinning={winner === board[id]} />
            </group>
          )}
        </group>
      ))}

     
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[4.9, 0.02, 4.9]} />
        <meshStandardMaterial color="#440000" metalness={1} roughness={0.2} emissive="#220000" />
      </mesh>
    </group>
  )
}

function GlowingFloor() {
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uColor: { value: new THREE.Color("#ff0000") },
      uOpacity: { value: 0.15 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        float dist = distance(vUv, vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, dist);
        gl_FragColor = vec4(uColor, alpha * uOpacity);
      }
    `
  }), [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial {...shaderArgs} transparent />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5, 15]} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={1.5} color="#ff3333" />
      <spotLight position={[0, 10, 0]} intensity={3} angle={0.5} penumbra={1} castShadow color="#ffffff" />

      <Suspense fallback={null}>
        <Board />
        <GlowingFloor />
        <Environment preset="city" />
        
        
        <gridHelper args={[20, 20, "#110000", "#050505"]} position={[0, -0.79, 0]} />
        
        <ContactShadows position={[0, -0.78, 0]} opacity={0.8} scale={8} blur={2} far={1} color="#000000" />
      </Suspense>

      <OrbitControls 
        makeDefault
        enablePan={false} 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2.1}
        minDistance={4}
        maxDistance={10}
        rotateSpeed={1.5}
        dampingFactor={0.1}
        enableDamping
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} intensity={1} radius={0.3} />
        <Vignette offset={0.2} darkness={1.1} />
      </EffectComposer>
    </>
  )
}

export default function Game3D() {
  const glRef = useRef<THREE.WebGLRenderer>(null)
  const [cameraConfig, setCameraConfig] = useState({ position: [0, 6, 6] as [number, number, number], fov: 45 })

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768 || window.innerHeight > window.innerWidth
      if (isMobile) {
        setCameraConfig({
          position: [0, 8, 8],
          fov: 55
        })
      } else {
        setCameraConfig({
          position: [0, 6, 6],
          fov: 45
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const gl = glRef.current
    return () => {
      if (gl) {
        gl.dispose()
        gl.forceContextLoss()
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas 
        shadows 
        camera={{ position: cameraConfig.position, fov: cameraConfig.fov }}
        onCreated={({ gl }) => { 
          glRef.current = gl;
        }}
        gl={{ antialias: true, stencil: false, depth: true }}
        dpr={window.devicePixelRatio > 1 ? 1.5 : 1}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
