import React, { useRef } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import { useBox } from "@react-three/cannon";

let addArrays = (arr1, arr2) => {
  if (!arr1) return arr2;
  return arr1.map((num, i) => {
    return num + arr2[i];
  });
};

export default function Model({ scale, physicsPosition, incrementScore }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/my_treasure_chest.glb");
  const { actions } = useAnimations(animations, group);
  const topTexture = useTexture("/my_chest_top.png");
  const handleSelect = () => {
    actions["CylinderAction"].clampWhenFinished = true;
    actions["CylinderAction"].setLoop("", 1).setDuration(5).play();
  };

  const rightOffsetX = 0.7;
  const leftOffsetX = -0.7;
  const frontOffsetZ = 0.45;
  const backOffsetZ = -0.45;
  const bottomOffsetY = -0.2;
  const triggerOffsetY = 0.9;
  const widePanelArgs = [1.3, 0.1, 1];
  const narrowPanelArgs = [1, 0.1, 1];

  // bottom
  const [ref] = useBox(() => ({
    mass: 10,
    args: [1.3, 0.6, 0.9],
    // position: [0, -0.2, 0],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [0, -0.2, 0]
    ),
    type: "Static",
  }));

  //trigger
  useBox(() => ({
    args: [1.3, 0.01, 0.9],
    // position: [0, 0.9, 0],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [0, 0.9, 0]
    ),
    isTrigger: true,
    onCollide: (e) => {
      console.log("collision detected, increasing score");
      incrementScore();
    },
  }));

  // back
  useBox(() => ({
    mass: 10,
    args: widePanelArgs,
    // position: [0, 0.5, -0.45],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [0, 0.5, -0.45]
    ),
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  // front
  useBox(() => ({
    mass: 10,
    args: widePanelArgs,
    // position: [0, 0.5, 0.45],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [0, 0.5, 0.45]
    ),
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  // left
  useBox(() => ({
    mass: 10,
    args: narrowPanelArgs,
    // position: [-0.7, 0.5, 0],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [-0.7, 0.5, 0]
    ),
    rotation: [-Math.PI / 2, 0, -Math.PI / 2],
    type: "Static",
  }));

  // right
  useBox(() => ({
    mass: 10,
    args: narrowPanelArgs,
    // position: [0.7, 0.5, 0],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [0.7, 0.5, 0]
    ),
    rotation: [-Math.PI / 2, 0, -Math.PI / 2],
    type: "Static",
  }));

  // lid
  useBox(() => ({
    mass: 10,
    args: [1.3, 0.6, 0.9],
    position: addArrays(
      [physicsPosition.x, physicsPosition.y, physicsPosition.z],
      [0, 1.5, -0.5]
    ),
    // position: [0, 1.5, -0.5],
    rotation: [-Math.PI / 4, 0, 0],
    type: "Static",
  }));

  return (
    <Interactive onSelect={handleSelect}>
      <group
        ref={ref}
        scale={scale}
        position={[0, -5, 0]}
        dispose={null}
        onClick={handleSelect}
      >
        <group scale={[1, 1, 0.59]}>
          <mesh
            geometry={nodes.Cube_1.geometry}
            material={materials["Material.001"]}
            metalness={0.8}
            receiveShadow
            castShadow
          />
          <mesh
            geometry={nodes.Cube_2.geometry}
            material={materials["Material.002"]}
            receiveShadow
            castShadow
          />
        </group>
        <mesh
          name="Cylinder"
          geometry={nodes.Cylinder.geometry}
          position={[0, 1.24, -0.49]}
          rotation={[-0.01, 0.01, -1.57]}
          scale={[0.46, 0.82, 0.46]}
          receiveShadow
          castShadow
          ref={group}
        >
          <meshBasicMaterial map={topTexture} map-flipY={false} />
        </mesh>
      </group>
    </Interactive>
  );
}

useGLTF.preload("/my_treasure_chest.glb");
