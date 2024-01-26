import { default as IO, socketInterface } from "../server/socket";
import settings from "../server/settings";
import permissions from "../server/permissions";
export default async function setLeader(socket: socketInterface, msg: any) {
  if (socket.accessLevel >= permissions().items["leader"]) {
    try {
      let leader = socket.username;
      if (settings().leader == leader) leader = "";
      settings().setLeader(leader);
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
