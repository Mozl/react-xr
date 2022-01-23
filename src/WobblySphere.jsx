import React, { useRef } from "react";
import { Suspense } from "react";
import { extend, useFrame } from "@react-three/fiber";
import VertexDisplacementShaderMaterial from "./materials/VertexDisplacementShaderMaterial";

extend({ VertexDisplacementShaderMaterial });

const WobblySphere = () => (
  <>
    <ambientLight intensity={1} />
    <Suspense fallback={null}>
      <Icosahedron />
    </Suspense>
  </>
);

const Icosahedron = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  return (
    <mesh>
      <icosahedronBufferGeometry args={[1, 64]} />
      <vertexDisplacementShaderMaterial ref={ref} />
    </mesh>
  );
};

export default WobblySphere;
