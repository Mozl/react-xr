import React from "react";
import { Suspense } from "react";
import { ARCanvas } from "@react-three/xr";
import WobblySphere from "./WobblySphere";

// function Box({ color, size, scale, children, ...rest }) {
//   return (
//     <mesh scale={scale} {...rest}>
//       <boxBufferGeometry attach="geometry" args={size} />
//       <meshPhongMaterial attach="material" color={color} />
//       {children}
//     </mesh>
//   );
// }

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
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            {/* <Box color="red" size={[0.5, 0.5, 0.5]} position={[-1, 0, -0.5]} /> */}
            <WobblySphere />
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

export default AR;
