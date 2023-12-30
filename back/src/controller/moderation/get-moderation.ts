import { socketInterface } from "../../server/socket";
import moderation from "../../server/moderation";
import permissions from "../../server/permissions";
export default function getModeration(socket: socketInterface) {
  try {
    if (socket.accessLevel >= permissions().items["userMod"]) {
      moderation().sendMod(socket);
    }
  } catch (err) {
    console.log(err);
    socket.emit("alert", {
      type: "error",
      message: "Something went wrong with the request",
    });
  }
}
