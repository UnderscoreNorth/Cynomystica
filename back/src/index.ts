import express from "express";
import config from "../config.json";
import { createServer } from "node:http";
import dbInit from "./init/dbInit";
import { v4 as uuidv4 } from "uuid";

import {
  socketInterface,
  init,
  default as IO,
  sendUserList,
} from "./server/socket";
import { getSchedule } from "./server/schedule";
import { default as chat } from "./server/chat";
import Icons from "./sqliteTables/icons";

import message from "./controller/message";
import deleteItem from "./controller/delete-item";
import disconnect from "./controller/disconnect";
import getPlaylist from "./controller/get-playlist";
import loginGuest from "./controller/login-guest";
import queueNext from "./controller/queue-next";
import signIn from "./controller/sign-in";
import signUp from "./controller/sign-up";
import upsertSchedule from "./controller/upsert-schedule";
import loginToken from "./controller/login-token";

dbInit();
const app = express();
const port = config.PORT;
const server = createServer(app);
// @ts-ignore
init(server);
let io = IO();
const ioEvents = {
  "delete-item": deleteItem,
  disconnect: disconnect,
  "get-playlist": getPlaylist,
  "login-guest": loginGuest,
  message: message,
  "queue-next": queueNext,
  "sign-in": signIn,
  "sign-up": signUp,
  "upsert-schedule": upsertSchedule,
  "login-token": loginToken,
};
io.on("connection", async (socket: socketInterface) => {
  socket.uuid = uuidv4();
  console.log(
    "new connection",
    socket.request.connection.remoteAddress,
    socket.request.headers["user-agent"]
  );
  if (!socket.request.headers["user-agent"]) socket.disconnect();

  for (let event in ioEvents) {
    socket.on(event, async (msg) => {
      ioEvents[event](socket, msg);
    });
  }
  socket.on("connection", (socket2) => {
    console.log("reconnection", socket.username, socket2.username);
  });
  sendUserList();
  chat().getRecent(socket);
  socket.emit("icons", await Icons.get("Toradora"));
  await getSchedule();
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
