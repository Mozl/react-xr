import React, { useState } from "react";
import { Suspense } from "react";
import { ARCanvas, Interactive } from "@react-three/xr";
import { Text, Html, Environment } from "@react-three/drei";
import MyTreasureChest from "./MyTreasureChest";
import HitTestReticle from "./HitTestReticle";
import { v4 as uuid } from "uuid";

const isProduction = process.env.NODE_ENV === "production";
const url = isProduction
  ? "wss://xr-websocket.herokuapp.com"
  : "ws://localhost:8080";

const ws = new WebSocket(url);
const id = uuid().substring(0, 5);

const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]);
  const [objectList, setObjectList] = useState([]);
  const [wsObjectList, setWsObjectList] = useState([]);
  const [clearText, setClearText] = useState("Clear");

  ws.onmessage = ({ data }) => {
    data = JSON.parse(data);
    const positionFromWs = [data.x, data.y, data.z];

    setWsObjectList(
      wsObjectList.concat(
        <>
          <mesh position={positionFromWs}>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.4}
              color="#008cff"
              transform
              occlude
            >
              {data?.id}
            </Text>
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              shadow-mapSize={[512, 512]}
              castShadow
            />
            <MyTreasureChest scale={[0.3, 0.3, 0.3]} />
          </mesh>
        </>
      )
    );
  };

  const handleSelect = (reticlePos) => {
    // x- left(-)/right(+), y - down(-)/up(+), z - back(-)/forward(+)
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
          }}
        >
          <mesh position={reticlePos}>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.4}
              color="#d0ff00"
              anchorX="center"
              anchorY="middle"
              transform
              occlude
            >
              {id}
            </Text>
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              shadow-mapSize={[512, 512]}
              castShadow
            />
            <MyTreasureChest scale={[0.3, 0.3, 0.3]} />
          </mesh>
        </Interactive>
      )
    );
  };

  return (
    <>
      <div className="three">
        <ARCanvas
          camera={{ fov: 50 }}
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
          <Suspense fallback={null}>
            <Html position={reticlePosition}>
              <button
                className="clearButton"
                onClick={() => {
                  ws.send(JSON.stringify({ msg: "clear" }));
                  setClearText("Cleared");
                }}
              >
                {clearText}
              </button>
              <div className="username">Your username: {id}</div>
            </Html>
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              shadow-mapSize={[512, 512]}
              castShadow
            />
            <Environment preset="city" />

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
        .clearButton {
          position: absolute;
          padding: 15px 32px;
          font-size: 16px;
          left: 30px;
          top: 30px;
          text-decoration: none;
          border: none;
        }
        .clearButton:active {
          background-color: lightblue;
        }
        .username {
          position: absolute;
          font-size: 16px;
          left: 160px;
          top: 37px;
          width: 120px;
        }
      `}</style>
    </>
  );
};

export default AR;
