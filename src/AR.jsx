import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { ARCanvas } from "@react-three/xr";
import HitTestReticle from "./HitTestReticle";
import { v4 as uuid } from "uuid";

const ws = new WebSocket("ws://localhost:8080");
const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]);
  const [objectList, setObjectList] = useState([]);
  console.log("objectList: ", objectList);
  const [wsObjectList, setWsObjectList] = useState([]);
  console.log("wsObjectList: ", wsObjectList);
  const id = uuid();

  ws.onmessage = ({ data }) => {
    console.log("data: ", data);
    console.log("data from ws: ", JSON.parse(data));
    data = JSON.parse(data);
    const positionFromWs = [data.x * 1.3, data.y + 0.7, data.z];
    console.log("positionFromWs: ", positionFromWs);

    setWsObjectList(
      wsObjectList.concat(
        <>
          <mesh position={positionFromWs}>
            <boxGeometry args={[0.7, 0.5, 0.5]} />
            <meshBasicMaterial color={"red"} />
          </mesh>
        </>
      )
    );
  };

  // listen onmessage for updates from websocket
  // when update comes in, sort the update into buckets per uuid
  // per uuid, have an array of coordinates of boxes
  // render each array of coordinates, rerender if array is updated

  const handleSelect = (reticlePos) => {
    console.log("reticlePos: ", reticlePos);
    const objToSend = {
      ...reticlePos,
      id,
    };
    ws.send(JSON.stringify(objToSend));
    setObjectList(
      objectList.concat(
        <>
          <mesh position={reticlePos}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color={"blue"} />
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
