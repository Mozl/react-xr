import React, { useRef } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { Interactive } from "@react-three/xr";

export default function Model({ ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/my_treasure_chest.glb");
  const { actions } = useAnimations(animations, group);
  const topTexture = useTexture("/my_chest_top.png");
  const baseTexture = useTexture("/my_chest_base.png");
  const handleSelect = () => {
    actions["CylinderAction"].clampWhenFinished = true;
    actions["CylinderAction"].setLoop("", 1).setDuration(5).play();
  };
  return (
    <Interactive onSelect={handleSelect}>
      <group ref={group} {...props} dispose={null}>
        <group scale={[1, 1, 0.59]}>
          <mesh
            geometry={nodes.Cube_1.geometry}
            material={materials["Material.001"]}
            metalness={0.8}
          >
            {/* <meshBasicMaterial map={baseTexture} map-flipY={false} /> */}
          </mesh>
          <mesh
            geometry={nodes.Cube_2.geometry}
            material={materials["Material.002"]}
          >
            {/* <meshBasicMaterial map={baseTexture} map-flipY={false} /> */}
          </mesh>
        </group>
        <group position={[0, 0.83, 0]}>
          <pointLight
            intensity={100}
            decay={2}
            color="#ff6705"
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
        <mesh
          name="Cylinder"
          geometry={nodes.Cylinder.geometry}
          // material={materials.Material}
          position={[0, 1.24, -0.49]}
          rotation={[-0.01, 0.01, -1.57]}
          scale={[0.46, 0.82, 0.46]}
        >
          <meshBasicMaterial map={topTexture} map-flipY={false} />
        </mesh>
      </group>
    </Interactive>
  );
}

useGLTF.preload("/my_treasure_chest.glb");
