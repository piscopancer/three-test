'use client'

import cross from '@/assets/models/cross-shape.glb'
import fragmentShader from '@/assets/shaders/test/fragment.glsl'
import vertexShader from '@/assets/shaders/test/vertex.glsl'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMotionValue, useSpring, useTime, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import * as colors from 'tailwindcss/colors'
import { Color, Vector2 } from 'three'
import type { GLTF } from 'three-stdlib'

export default function Home() {
  const time = useTime()

  useEffect(() => {
    console.log(cross)
  }, [])

  return (
    <main className='bg-zinc-950 h-svh flex flex-col'>
      <aside className=''>
        <button className='py-1 px-2 bg-zinc-800 text-zinc-200'>play</button>
      </aside>
      <section className='grow'>
        <Canvas camera={{ position: [0, 0, 50], fov: 30, zoom: 1.2 }}>
          <directionalLight position={[5, 3, 3]} intensity={15} color={new Color(colors.lime[400])} />
          <directionalLight position={[-5, 0, -3]} intensity={5} color={new Color(colors.purple[500])} />
          {/* <ambientLight intensity={1} color={new Color(colors.white)} /> */}
          <group scale={1.4}>
            <Cross />
            {/* <SuperSphere /> */}
          </group>
          <group position={[20, 0, 0]}>
            {/* <Shape /> */}
            {/* <SuperSphere /> */}
          </group>
          <group position={[-20, 0, 0]}>{/* <SuperSphere /> */}</group>
        </Canvas>
      </section>
    </main>
  )
}

function SuperSphere() {
  const geoRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.MeshToonMaterial>(null!)
  const rotationMv = useSpring(0.5)
  const scaleMv = useSpring(1, { bounce: 10, stiffness: 200 })
  const color = useTransform(scaleMv, [1, 1.2], [colors.zinc[700], colors.lime[400]])

  useFrame((s, d) => {
    geoRef.current.rotation.y += rotationMv.get() * d
    geoRef.current.scale.x = scaleMv.get()
    geoRef.current.scale.z = scaleMv.get()
    matRef.current.color = new Color(color.get())
  })

  return (
    <mesh
      ref={geoRef}
      onPointerOver={() => {
        rotationMv.set(1)
        scaleMv.set(1.2)
      }}
      onPointerOut={() => {
        rotationMv.set(0.5)
        scaleMv.set(1)
      }}
    >
      <sphereGeometry args={[7, 32, 16]} />
      <meshToonMaterial ref={matRef} color={color.get()} wireframe />
    </mesh>
  )
}

type TShape = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

function Cross() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const { nodes, materials } = useGLTF(cross) as TShape
  const hoverMv = useMotionValue(0)
  const roughnessMv = useTransform(useSpring(hoverMv), [0, 1], [0.2, 0.5])
  const colorMv = useTransform(hoverMv, [0, 1], [colors.orange[500], colors.lime[400]])
  const scaleMv = useTransform(useSpring(hoverMv), [0, 1], [1, 1.1])

  useFrame((s, d) => {
    meshRef.current.rotation.y += 0.5 * d
    meshRef.current.rotation.z += -0.2 * d
    meshRef.current.scale.setScalar(scaleMv.get())
    // matRef.current.uniforms.u_resolution = { value: new Vector2(window.innerWidth, window.innerHeight) }
    // matRef.current.roughness = roughnessMv.get()
    // matRef.current.color = new Color(colorMv.get())
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        material={materials.Material}
        geometry={nodes.Cube.geometry}
        onPointerOver={() => {
          hoverMv.set(1)
          // console.log('shader', matRef.current)
        }}
        onPointerOut={() => hoverMv.set(0)}
      >
        {/* <meshStandardMaterial ref={matRef} metalness={1} /> */}
        <shaderMaterial ref={matRef} uniforms={{ u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) } }} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </mesh>
    </group>
  )
}
