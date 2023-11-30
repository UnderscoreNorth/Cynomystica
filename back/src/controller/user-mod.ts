import { socketInterface, default as IO, sendUserList } from "../server/socket";
import userModeration from "../sqliteTables/userModeration";
export default async function userMod(socket: socketInterface, obj: any) {
  console.log(socket.username, obj);
  if (socket.username !== obj.username) {
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
    await userModeration.insert(obj.username, obj.action, socket.username);
    for (let subSocket of Object.values(
      await IO().sockets.fetchSockets()
    ) as unknown as socketInterface[]) {
      switch (obj.action) {
        case "Ban":
          if (subSocket.username == obj.username) {
            subSocket.emit("alert", {
              type: "banned",
              message: "You have been banned",
            });
            subSocket.disconnect();
          }
          break;
        case "IP Ban":
          if (obj.username == subSocket.handshake.headers["x-real-ip"]) {
            subSocket.emit("alert", {
              type: "banned",
              message: "You have been banned",
            });
            subSocket.disconnect();
          }
          break;
        default:
          break;
      }
    }
    sendUserList();
  } else {
    socket.emit("alert", {
      type: "moderation",
      message: `Can't take action against yourself`,
    });
  }
}
