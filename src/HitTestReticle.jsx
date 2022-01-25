import React, { useRef, Suspense } from "react";
import { useHitTest } from "@react-three/xr";

const HitTestReticle = () => {
  const ref = useRef();

  useHitTest((hit) => {
    hit.decompose(
      ref.current.position,
      ref.current.rotation,
      ref.current.scale
    );
  });

  return (
    <>
      <Suspense fallback={null}>
        <mesh ref={ref}>
          <circleBufferGeometry args={[5, 8]} color="0xffff00" />
        </mesh>
      </Suspense>
    </>
  );
};

export default HitTestReticle;
