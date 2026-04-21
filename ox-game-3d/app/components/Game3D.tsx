"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D, Center, Float, ContactShadows, Environment } from "@react-three/drei"
import { useGameStore } from "@/lib/store"
import { Player } from "@/lib/game-logic"
import { Suspense, useState } from "react"


function Piece({ type, position, isWinning }: { type: Player, position: [number, number, number], isWinning: boolean }) {
  if (!type) return null
  
  return (
    <Float floatIntensity={isWinning ? 5 : 1} rotationIntensity={isWinning ? 1 : 0.2}>
      <mesh position={position}>
        {type === "X" ? (
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={0.8}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            X
            <meshStandardMaterial color={isWinning ? "#ff0000" : "#ef4444"} metalness={0.8} roughness={0.2} emissive={isWinning ? "#ff0000" : "#7f1d1d"} emissiveIntensity={isWinning ? 2 : 0.8} />
          </Text3D>
        ) : (
          <mesh>
            <torusGeometry args={[0.4, 0.15, 16, 32]} />
            <meshStandardMaterial color={isWinning ? "#ffffff" : "#d4d4d8"} metalness={0.9} roughness={0.1} emissive={isWinning ? "#ffffff" : "#27272a"} emissiveIntensity={isWinning ? 2 : 0.2} />
          </mesh>
        )}
      </mesh>
    </Float>
  )
}

function Board() {
  const { board, setSquare, currentPlayer, winner, isBotThinking } = useGameStore()
  const [hovered, setHovered] = useState<number | null>(null)

  const handleCellClick = (index: number) => {
    if (winner || board[index] || currentPlayer !== "X" || isBotThinking) return
    setSquare(index, "X")
  }

  const cells = []
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3)
    const col = i % 3
    const x = (col - 1) * 1.5
    const z = (row - 1) * 1.5

    cells.push(
      <group key={i} position={[x, 0, z]}>
        <mesh
          position={[0, -0.2, 0]}
          onClick={() => handleCellClick(i)}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(i) }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(null) }}
        >
          <boxGeometry args={[1.4, 0.4, 1.4]} />
          <meshStandardMaterial
            color={hovered === i && !board[i] && currentPlayer === "X" && !winner ? "#ef4444" : "#09090b"}
            transparent
            opacity={0.9}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {board[i] && (
          <Center>
            <Piece type={board[i]} position={[0, 0.3, 0]} isWinning={false} />
          </Center>
        )}
      </group>
    )
  }

  return (
    <group>
      {cells}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[4.6, 0.1, 4.6]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export default function Game3D() {
  return (
    <div className="w-full h-full cursor-pointer relative">
      <Canvas shadows camera={{ position: [0, 5, 4], fov: 50 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#ff0000" />
        <pointLight position={[10, -10, 5]} intensity={0.3} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Board />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          enableZoom={false}
        />
      </Canvas>
    </div>
  )
}
