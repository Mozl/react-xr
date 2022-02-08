import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { ARCanvas } from "@react-three/xr";
import HitTestReticle from "./HitTestReticle";

const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]);
  const [objectList, setObjectList] = useState([]);
  console.log("objectList: ", objectList);
  const [wsObjectList, setWsObjectList] = useState([]);
  const ws = new WebSocket("ws://localhost:8080");

  useEffect(() => {
    setObjectList(
      objectList.concat(
        <>
          <mesh position={[0, -1.6, -3.3]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial />
          </mesh>
        </>,
        <>
          <mesh position={[-1, -1.6, -3.3]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial />
          </mesh>
        </>,
        <>
          <mesh position={[1, -1.6, -3.3]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial />
          </mesh>
        </>
      )
    );
  }, []);

  ws.onmessage = (event) => {
    console.log("event: ", event);
    // setObjectList(JSON.parse(event.data).data);
    console.log("parsed message from ws server:", JSON.parse(event));
    // setWsObjectList(
    //   wsObjectList.concat(
    //     <>
    //       <mesh position={reticlePos}>
    //         <boxGeometry args={[0.5, 0.5, 0.5]} />
    //         <meshBasicMaterial />
    //       </mesh>
    //     </>
    //   )
    // );
  };

  // listen onmessage for updates from websocket
  // when update comes in, sort the update into buckets per uuid
  // per uuid, have an array of coordinates of boxes
  // render each array of coordinates, rerender if array is updated

  const handleSelect = (reticlePos) => {
    setObjectList(
      objectList.concat(
        <>
          <mesh position={reticlePos}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial />
          </mesh>
        </>
      )
    );
  };
  return (
    <>
      <div className="three">
        <ARCanvas
          camera={{ fov: 30 }}
          shadows
          shadowMap
          raycaster={{
            computeOffsets: ({ clientX, clientY }) => ({
              offsetX: clientX,
              offsetY: clientY,
            }),
          }}
          sessionInit={{ requiredFeatures: ["hit-test"] }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <HitTestReticle
              setReticlePosition={setReticlePosition}
              handleSelect={() => handleSelect(reticlePosition)}
            />
            {objectList}
            {wsObjectList}
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
