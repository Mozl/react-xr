import React from "react";
import { Suspense } from "react";
// import { Canvas, useThree, extend } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
import { ARCanvas } from "@react-three/xr";
// import { ARButton } from 'three/examples/jsm/webxr/ARButton';

// extend({ ARButton });

function Box({ color, size, scale, children, ...rest }) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  );
}

const AR = () => {
  return (
    <>
      <div className="three">
        <ARCanvas
          camera={{ fov: 30 }}
          shadows
          raycaster={{
            computeOffsets: ({ clientX, clientY }) => ({
              offsetX: clientX,
              offsetY: clientY,
            }),
          }}
        >
          {/* <OrbitControls /> */}
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Box color="red" size={[1, 1, 1]} />
            {/* <Sphere>
              <meshBasicMaterial attach="material" color="hotpink" />
            </Sphere> */}
          </Suspense>
        </ARCanvas>
      </div>
      <style jsx={"true"}>{`
        .three {
          height: 100vh;
          background: linear-gradient(125deg, #f98734, #66a0fb);
        }
        .wave {
          height: 100vh;
        }
      `}</style>
    </>
  );
};

// let ARButton;
// const AREnv = () => {
//   // ARButton = require('three/examples/jsm/webxr/ARButton').ARButton;
//   const { gl } = useThree();
//   const arButton = ARButton.createButton(gl);
//   gl.xr.enabled = true;
//   return <arButton />;
// };

export default AR;
