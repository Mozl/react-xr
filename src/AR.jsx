import React, { useState, Suspense, useCallback } from "react";
import { ARCanvas, Interactive } from "@react-three/xr";
import { Physics, useSphere, useBox } from "@react-three/cannon";
import { Text, Html, Environment, Box, Sphere } from "@react-three/drei";
import { v4 as uuid } from "uuid";
import MyTreasureChest from "./MyTreasureChest";
import CameraControls from "./CameraControls";
import HitTestReticle from "./HitTestReticle";

const isProduction = process.env.NODE_ENV === "production";
const url = isProduction
  ? "wss://xr-websocket.herokuapp.com"
  : "ws://localhost:8080";

const ws = new WebSocket(url);
const id = uuid().substring(0, 5);
localStorage.setItem("score", 0);

const randomIntFromInterval = (min, max) => Math.random() * (max - min) + min;

const Ball = ({ reticlePos, spawnBall, incrementScore }) => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [reticlePos.x, reticlePos.y + 2, reticlePos.z + 2.4],
    args: [0.06, 6, 6],
  }));

  return (
    <Interactive
      onSelect={() => {
        api.applyForce(
          [0, 400, -470],
          [randomIntFromInterval(-0.01, 0.01), 0, 0]
        );
        // incrementScore();
        spawnBall();
      }}
    >
      <Sphere
        onClick={() => {
          api.applyForce(
            [0, 400, -470],
            [randomIntFromInterval(-0.01, 0.01), 0, 0]
          );
          incrementScore();
          spawnBall();
        }}
        ref={ref}
        args={[0.06, 6, 6]}
      >
        <meshStandardMaterial color="red" />
      </Sphere>
    </Interactive>
  );
};

const Ground = ({ reticlePos }) => {
  useBox(() => ({
    args: [20, 20, 2],
    position: [reticlePos.x, reticlePos.y - 2 || -0.5, reticlePos.z],
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  return null;
};

const BallPlatform = ({ reticlePos, score }) => {
  const [ref] = useBox(() => ({
    args: [1, 1, 0.1],
    position: [reticlePos.x, reticlePos.y + 1, reticlePos.z + 2.4],
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  return (
    <mesh>
      <Text
        position={[0, -0.6, -0.65]}
        fontSize={0.1}
        color="#ff1100"
        anchorX="center"
        anchorY="middle"
        transform
        occlude
      >
        Score: {score}
      </Text>
      <Box ref={ref} args={[0.5, 0.5, 0.1]}>
        <meshStandardMaterial color="grey" />
      </Box>
    </mesh>
  );
};

const AR = () => {
  const [reticlePosition, setReticlePosition] = useState([]); // eg. { x: 0, y: -1.600000023841858, z: -2.3510549068450928 }
  const [objectList, setObjectList] = useState([]);
  const [wsObjectList, setWsObjectList] = useState([]);
  const [clearText, setClearText] = useState("Clear");
  let score = localStorage.getItem("score");
  const incrementScore = () => {
    localStorage.setItem("score", ++score);
  };
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
              incrementScore={incrementScore}
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
            incrementScore={incrementScore}
          />
        </mesh>
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
            <div className="username">Username: {id}</div>
            <div className="score">Score: {score}</div>
          </Html>
          <Physics
            gravity={[0, -30, 0]}
            defaultContactMaterial={{ restitution: 0.7 }}
          >
            {/* <Debug scale={1}> */}
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <Environment preset="city" />
              {balls.map((key, index) => (
                <Ball
                  key={index}
                  reticlePos={{
                    x: 0,
                    y: -1.600000023841858,
                    z: -3.388284921646118,
                  }}
                  // reticlePos={reticlePosition}
                  spawnBall={spawnBall}
                  incrementScore={incrementScore}
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
                reticlePos={{
                  x: 0,
                  y: -1.600000023841858,
                  z: -3.388284921646118,
                }}
                // reticlePos={reticlePosition}
                score={score}
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
                  incrementScore={incrementScore}
                /> */}
              {objectList}
              {wsObjectList}
            </Suspense>
            {/* </Debug> */}
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
          left: 160px;
          top: 80px;
          width: 120px;
        }
      `}</style>
    </>
  );
};

export default AR;
