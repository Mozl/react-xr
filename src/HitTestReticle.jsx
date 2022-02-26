import React, { useRef } from "react";
import * as THREE from "three";
import { Interactive, useHitTest } from "@react-three/xr";

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
      <Interactive onSelect={handleSelect}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={ref}>
          <circleGeometry args={[0.1, 8]} />
          <meshStandardMaterial side={THREE.DoubleSide} color={"orange"} />
        </mesh>
      </Interactive>
    </>
  );
};

export default HitTestReticle;
