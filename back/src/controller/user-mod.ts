import { socketInterface, default as IO, sendUserList } from "../server/socket";
import userModeration from "../sqliteTables/userModeration";
export default async function userMod(socket: socketInterface, obj: any) {
  console.log(socket.username, obj);
  if (socket.username !== obj.username) {
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
