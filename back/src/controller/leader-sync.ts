import { default as IO, socketInterface } from "../server/socket";
import settings from "../server/settings";
import permissions from "../server/permissions";
import playlist from "../server/playlist";
export default async function leaderSync(socket: socketInterface, msg: any) {
  if (socket.accessLevel >= permissions().items["leader"]) {
    try {
      if (settings().leader == socket.username) {
        playlist.leaderSeekTime = msg;
      }
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "permissions",
        message: "Something went wrong with the request",
      });
    }
  } else {
    socket.emit("alert", {
      type: "permissions",
      message: "You do not have permissions to perform this request",
    });
  }
}
