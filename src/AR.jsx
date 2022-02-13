import React, { useState } from "react";
import { Suspense } from "react";
import { ARCanvas, Interactive } from "@react-three/xr";
import { Text, Html } from "@react-three/drei";
import HitTestReticle from "./HitTestReticle";
import { v4 as uuid } from "uuid";

const isProduction = process.env.NODE_ENV === "production";
const url = isProduction
  ? "wss://xr-websocket.herokuapp.com"
  : "ws://localhost:8080";

const ws = new WebSocket(url);
const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]);
  const [objectList, setObjectList] = useState([]);
  const [wsObjectList, setWsObjectList] = useState([]);
  const [boxColor, setBoxColor] = useState("#76eec6");
  const id = uuid();

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
  //fdddsssssssss
  const handleSelect = (reticlePos) => {
    // x- left(-)/right(+), z - back(-)/forward(+), y - down(-)/up(+)
    console.log("reticlePos: ", reticlePos);
    const objToSend = {
      ...reticlePos,
      id,
    };
    ws.send(JSON.stringify(objToSend));
    setObjectList(
      objectList.concat(
        <Interactive
          onSelect={() => {
            console.log("tap on box");
            setBoxColor("#910c96");
          }}
        >
          <mesh position={reticlePos}>
            {/* <Text
              position={reticlePos}
              fontSize={5}
              color="#d0ff00"
              anchorX="center"
              anchorY="middle"
            >
              Hello react-xr!
            </Text> */}
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color={boxColor} />
          </mesh>
        </Interactive>
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
          <Html position={reticlePosition}>
            <button onClick={() => ws.send(JSON.stringify({ msg: "clear" }))}>
              Clear
            </button>
          </Html>
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
