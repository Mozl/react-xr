import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { Interactive, useHitTest } from "@react-three/xr";
extend({ OrbitControls });

const HitTestReticle = ({ setReticlePosition, handleSelect }) => {
  const ref = useRef();

  useHitTest((hit) => {
    hit.decompose(
      ref.current.position,
      ref.current.rotation,
      ref.current.scale
    );
    setReticlePosition(ref.current.position);
  });

  return (
    <>
      <CameraControls />
      <Interactive onSelect={handleSelect}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={ref}>
          <circleGeometry args={[0.1, 8]} />
          <meshStandardMaterial side={THREE.DoubleSide} color={"orange"} />
        </mesh>
      </Interactive>
    </>
  );
};

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();
  useFrame(() => controls.current.update());
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

export default HitTestReticle;
