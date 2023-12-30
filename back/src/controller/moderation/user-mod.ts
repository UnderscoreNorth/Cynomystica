import {
  socketInterface,
  default as IO,
  sendUserList,
} from "../../server/socket";
import moderation from "../../server/moderation";
import { actionTypes } from "../../sqliteTables/userModeration";
export default async function userMod(socket: socketInterface, obj: any) {
  if (socket.username !== obj.username) {
    try {
      if (obj.action == "IP Ban") {
        for (let subSocket of Object.values(
          await IO().sockets.fetchSockets()
        ) as unknown as socketInterface[]) {
          if (subSocket.username == obj.username) {
            obj.username = subSocket.handshake.headers["x-real-ip"];
            break;
          }
        }
      }
      await moderation().insert(obj.username, obj.action, socket);
      for (let subSocket of Object.values(
        await IO().sockets.fetchSockets()
      ) as unknown as socketInterface[]) {
        switch (obj.action as actionTypes) {
          case "Ban":
            if (subSocket.username == obj.username) {
              subSocket.emit("alert", {
                type: "clearLogin",
                message: "You have been banned",
              });
              setTimeout(() => {
                subSocket.disconnect();
              }, 50);
            }
            break;
          case "IP Ban":
            if (obj.username == subSocket.handshake.headers["x-real-ip"]) {
              subSocket.emit("alert", {
                type: "clearLogin",
                message: "You have been banned",
              });
              setTimeout(() => {
                subSocket.disconnect();
              }, 50);
            }
            break;
          case "Mute":
            if (subSocket.username == obj.username) {
              subSocket.muted = true;
              subSocket.emit("alert", {
                type: "mute",
                message: "You have been server muted",
              });
            }
          default:
            break;
        }
      }
      sendUserList();
    } catch (err) {
      socket.emit("alert", {
        type: "error",
        message: `Something went wrong`,
      });
    }
  } else {
    socket.emit("alert", {
      type: "moderation",
      message: `Can't take action against yourself`,
    });
  }
}
