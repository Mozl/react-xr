import React, { useRef, Suspense, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { Interactive } from "@react-three/xr";
import VertexDisplacementShaderMaterial from "./materials/VertexDisplacementShaderMaterial";

extend({ VertexDisplacementShaderMaterial });

const WobblySphere = ({ position }) => {
  const [color1, setColor1] = useState(0);
  const [color2, setColor2] = useState(0.1);
  const [color3, setColor3] = useState(0.2);
  const onSelect = () => {
    setColor1(Math.random());
    setColor2(Math.random());
    setColor3(Math.random());
  };
  return (
    <>
      <Interactive onSelect={onSelect}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Icosahedron
            position={position}
            color1={color1}
            color2={color2}
            color3={color3}
          />
        </Suspense>
      </Interactive>
    </>
  );
};

const Icosahedron = ({ position, color1, color2, color3 }) => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));
  useFrame(({ clock }) => {
    ref.current.color1 = color1;
    ref.current.color2 = color2;
    ref.current.color3 = color3;
  });

  return (
    <mesh scale={0.5} position={position}>
      <icosahedronBufferGeometry args={[1, 64]} />
      <vertexDisplacementShaderMaterial ref={ref} />
    </mesh>
  );
};

export default WobblySphere;
