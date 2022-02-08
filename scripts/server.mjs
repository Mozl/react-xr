import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.id = uuid();

  wss.clients.forEach(function each(client) {
    console.log("Client.ID: " + client.id);
  });
  ws.on("message", function message(info, isBinary) {
    console.log('info.toString("uft8"): ', info.toString("utf8"));
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(info.toString("utf8"), { binary: isBinary });
      }
    });
  });
});
