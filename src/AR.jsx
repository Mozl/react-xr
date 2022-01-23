import React from "react";
import { Suspense } from "react";
import { ARCanvas } from "@react-three/xr";
import WobblySphere from "./WobblySphere";

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
            <WobblySphere position={[0, 0.1, -1.2]} />
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
