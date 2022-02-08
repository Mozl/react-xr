import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.id = uuid();

  ws.on("message", function message(info, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (client !== ws)
          client.send(info.toString("utf8"), { binary: isBinary });
      }
    });
  });
});
