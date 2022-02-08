import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
const idMap = [];

wss.uuid = uuid();
idMap.push(wss.uuid, wss);

wss.on("connection", function connection(ws) {
  ws.on("message", function message(info) {
    ws.id = uuid();
    try {
      // console.log(info.toString("utf8"));
      info = JSON.parse(info);
      if ((info.action = "send")) {
        console.log(info);
        ws.send(info);
      }
    } catch (e) {
      console.log("Error processing incoming message", e);
    }
  });
});
