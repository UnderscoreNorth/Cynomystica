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
import userModeration from "./sqliteTables/userModeration";

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
import userMod from "./controller/user-mod";
import version from "./controller/version";

import playlist from "./server/playlist";
import updatePlaylist from "./controller/update-playlist";

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
  "user-mod": userMod,
  version: version,
  "update-playlist": updatePlaylist,
};
io.on("connection", async (socket: socketInterface) => {
  socket.uuid = uuidv4();
  console.log("new connection", socket.handshake.headers["x-real-ip"]);
  if (!socket.request.headers["user-agent"]) socket.disconnect();
  console.log(64, await userModeration.getUser(socket.handshake["x-real-ip"]));
  if ((await userModeration.getUser(socket.handshake["x-real-ip"])).length) {
    socket.emit("alert", {
      type: "IP banned",
      message: "This IP has been banned",
    });
    socket.disconnect();
    return;
  }
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
  socket.emit("icons", await Icons.get());
  await getSchedule(socket);
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
