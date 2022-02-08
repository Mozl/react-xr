import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Model({ ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/ARSceneTest.gltf");
  const { actions } = useAnimations(animations, group);
  actions?.SuzanneAction?.play();
  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={[0, -2, -3]}
      rotation={[0, -70.5, 0]}
    >
      <group renderOrder={3}>
        <mesh
          receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials["Material.001"]}
        />
        <mesh // blue cylinder
          castShadow
          geometry={nodes.Cylinder.geometry}
          material={materials["Material.002"]}
          position={[-1.98, 0.39, -1.98]} // front-to-back, up-to-down, left-to-right
          scale={0.36}
        />
        <mesh
          castShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials["Material.003"]}
          position={[-1.98, 0.39, -0.75]}
          scale={0.36}
        />
        <mesh
          castShadow
          geometry={nodes.Cylinder002.geometry}
          material={materials["Material.005"]}
          position={[-2.04, 0.37, 0.58]}
          scale={0.36}
        />
        <mesh
          castShadow
          geometry={nodes.Cylinder003.geometry}
          material={materials["Material.004"]}
          position={[-2.07, 0.39, 1.93]}
          scale={0.36}
        />
        <mesh
          name="Suzanne"
          castShadow
          geometry={nodes.Suzanne.geometry}
          material={materials["Material.006"]}
          position={[0, 0.45, 0]}
          rotation={[-0.57, 0.88, 0]}
          scale={0.59}
        />
      </group>
      <group renderOrder={1}>
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          position={[3, 2.125, 2]}
          renderOrder={1}
        >
          <planeGeometry args={[2, 4.25]} />
          <meshBasicMaterial
            material={materials["Material.001"]}
            colorWrite={false}
          />
        </mesh>
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          position={[3, 2.125, -2]}
          renderOrder={1}
        >
          <planeGeometry args={[2, 4.25]} />
          <meshBasicMaterial
            material={materials["Material.001"]}
            colorWrite={false}
          />
        </mesh>
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          position={[3, 3.25, 0]}
          renderOrder={1}
        >
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial
            material={materials["Material.001"]}
            colorWrite={false}
          />
        </mesh>
      </group>
      <group
        name="sun"
        position={[6, 3, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={2}
      >
        <mesh material={materials["Material.002"]}>
          <boxGeometry scale={0.36} args={[1, 1, 1]} />
        </mesh>

        <pointLight
          castShadow
          shadow-mapSize-height={1024 * 2}
          shadow-mapSize-width={1024 * 2}
          intensity={3}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/ARSceneTest.gltf");
