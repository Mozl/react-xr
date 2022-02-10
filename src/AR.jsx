import React, { useState } from "react";
import { Suspense } from "react";
import { ARCanvas } from "@react-three/xr";
import HitTestReticle from "./HitTestReticle";
import { v4 as uuid } from "uuid";

// const PORT = process.env.NODE_ENV === 'production' ? "ws://localhost:80"

const ws = new WebSocket("ws://xr-websocket.herokuapp.com");
const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]);
  const [objectList, setObjectList] = useState([]);
  const [wsObjectList, setWsObjectList] = useState([]);
  const id = uuid();
  // setTimeout(() => {
  //   console.log("sending some coords");

  //   ws.send(
  //     JSON.stringify({ x: 0, y: -1.600000023841858, z: -3.422672986984253 })
  //   );
  // }, 5000);

  ws.onmessage = ({ data }) => {
    data = JSON.parse(data);
    const positionFromWs = [data.x, data.y, data.z];

    setWsObjectList(
      wsObjectList.concat(
        <>
          <mesh position={positionFromWs}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color={"red"} />
          </mesh>
        </>
      )
    );
  };

  const handleSelect = (reticlePos) => {
    const objToSend = {
      ...reticlePos,
      id,
    };
    console.log("objToSend: ", objToSend);
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
