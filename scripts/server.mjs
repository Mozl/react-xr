import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
// const idMap = [];

// wss.uuid = uuid();
// idMap.push(wss.uuid, wss);

wss.on("connection", function connection(ws) {
  ws.id = uuid();

  wss.clients.forEach(function each(client) {
    console.log("Client.ID: " + client.id);
  });
  ws.on("message", function message(info) {
    try {
      console.log('info.toString("uft8"): ', info.toString("utf8"));
      ws.send(info.toString("utf8"));
    } catch (e) {
      console.log("Error processing incoming message", e);
    }
  });
});
