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
import getSchedule from "./controller/get-schedule";
import sendPermissions from "./lib/sendPermissions";

import playlist from "./server/playlist";

dbInit();
const app = express();
const port = config.PORT;
const server = createServer(app);
// @ts-ignore
init(server);
let io = IO();
//playlist.queuePlaylist({ playlist: "Commercials", duration: 500 });

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
  "get-schedule": getSchedule,
};
io.on("connection", async (socket: socketInterface) => {
  socket.uuid = uuidv4();
  console.log(
    "new connection",
    socket.request.connection.remoteAddress,
    socket.request.headers["user-agent"]
  );
  if (!socket.request.headers["user-agent"]) socket.disconnect();
  socket.emit("connected");
  for (let event in ioEvents) {
    try {
      socket.on(event, async (msg) => {
        ioEvents[event](socket, msg);
      });
    } catch (err) {
      console.log(socket.username, new Date(), err);
    }
  }
  socket.on("connection", (socket2) => {
    console.log("reconnection", socket.username, socket2.username);
  });
  sendUserList();
  sendPermissions(socket);
  chat().getRecent(socket);
  socket.emit("icons", await Icons.get("Toradora"));
  await getSchedule(socket);
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
