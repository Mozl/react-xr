import React, { useState } from "react";
import { Suspense, useCallback } from "react";
import { ARCanvas, Interactive } from "@react-three/xr";
import { Text, Html, Environment, Box, Sphere } from "@react-three/drei";
import MyTreasureChest from "./MyTreasureChest";
import CameraControls from "./CameraControls";
import HitTestReticle from "./HitTestReticle";
import { v4 as uuid } from "uuid";
import { Physics, useSphere, useBox, Debug } from "@react-three/cannon";

const isProduction = process.env.NODE_ENV === "production";
const url = isProduction
  ? "wss://xr-websocket.herokuapp.com"
  : "ws://localhost:8080";

const ws = new WebSocket(url);
const id = uuid().substring(0, 5);

function Ball({ reticlePos, spawnBall }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [reticlePos.x, reticlePos.y + 3, reticlePos.z + 2],
    args: [0.06, 10, 10],
  }));

  return (
    <Interactive
      onSelect={() => {
        console.log("box tapped on");
        api.applyForce([0, 50, -20], [0, 0, 0]);
      }}
    >
      <Sphere
        onClick={() => {
          console.log("box clicked");
          api.applyForce([0, 400, -470], [0, 0, 0]);
          spawnBall();
        }}
        ref={ref}
        args={[0.06, 10, 10]}
      >
        <meshStandardMaterial roughness={0.01} color="red" />
      </Sphere>
    </Interactive>
  );
}

const Ground = ({ reticlePos }) => {
  useBox(() => ({
    args: [20, 20, 2],
    position: [reticlePos.x, reticlePos.y - 2 || -0.5, reticlePos.z],
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  return null;
};

const BallPlatform = ({ reticlePos }) => {
  useBox(() => ({
    args: [1, 1, 0.1],
    position: [reticlePos.x, reticlePos.y + 1, reticlePos.z + 2],
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  return null;
};

const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]); // eg. { x: 0, y: -1.600000023841858, z: -2.3510549068450928 }
  const [objectList, setObjectList] = useState([]);
  const [wsObjectList, setWsObjectList] = useState([]);
  const [clearText, setClearText] = useState("Clear");
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(["uuid"]);
  const spawnBall = useCallback(
    (e) => setBalls((balls) => [...balls, uuid()]),
    []
  );

  ws.onmessage = ({ data }) => {
    data = JSON.parse(data);
    const positionFromWs = [data.x, data.y, data.z];

    setWsObjectList(
      wsObjectList.concat(
        <>
          <mesh position={positionFromWs}>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.2}
              color="#008cff"
              transform
              occlude
            >
              {data?.id}
            </Text>
            <MyTreasureChest
              physicsPosition={positionFromWs}
              scale={[0.3, 0.3, 0.3]}
              score={score}
              setScore={setScore}
            />
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
            <MyTreasureChest
              physicsPosition={reticlePosition}
              // scale={[0.3, 0.3, 0.3]}
              scale={[1.5, 1.5, 1.5]}
              score={score}
              setScore={setScore}
            />
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
          <CameraControls />
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
            <div className="score">Score: {score}</div>
          </Html>
          <Physics
            gravity={[0, -30, 0]}
            defaultContactMaterial={{ restitution: 0.7 }}
          >
            <Debug scale={1}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                {balls.map((key, index) => (
                  <Ball
                    key={key}
                    // reticlePos={{
                    //   x: 0,
                    //   y: -1.600000023841858,
                    //   z: -3.388284921646118,
                    // }}
                    reticlePos={reticlePosition}
                    spawnBall={spawnBall}
                  />
                ))}
                <Ground
                  // reticlePos={{
                  //   x: 0,
                  //   y: -1.600000023841858,
                  //   z: -3.388284921646118,
                  // }}
                  reticlePos={reticlePosition}
                />
                <BallPlatform
                  // reticlePos={{
                  //   x: 0,
                  //   y: -1.600000023841858,
                  //   z: -3.388284921646118,
                  // }}
                  reticlePos={reticlePosition}
                />
                <HitTestReticle
                  setReticlePosition={setReticlePosition}
                  handleSelect={() => handleSelect(reticlePosition)}
                />
                {/* <MyTreasureChest
                  physicsPosition={{
                    x: 0,
                    y: -1.600000023841858,
                    z: -3.388284921646118,
                  }}
                  score={score}
                  setScore={setScore}
                /> */}
                {objectList}
                {wsObjectList}
              </Suspense>
            </Debug>
          </Physics>
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
        .score {
          position: absolute;
          font-size: 16px;
          left: 320px;
          top: 37px;
          width: 120px;
        }
      `}</style>
    </>
  );
};

export default AR;
