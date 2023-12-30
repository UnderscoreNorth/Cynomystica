import { socketInterface } from "../../server/socket";
import moderation from "../../server/moderation";
import permissions from "../../server/permissions";
import { moderationItem, actionTypes } from "../../sqliteTables/userModeration";
export default async function undoModeration(
  socket: socketInterface,
  msg: moderationItem | actionTypes
) {
  if (typeof msg == "object") {
    if (msg.action == "Ignore") {
      moderation().undoItem(msg.username, msg.action, socket.username);
    } else {
      if (socket.accessLevel >= permissions().items["userMod"]) {
        try {
          await moderation().undoItem(
            msg.username,
            msg.action,
            msg.byUser == "" ? "" : socket.username
          );
          moderation().sendMod(socket);
        } catch (err) {
          console.log(err);
          socket.emit("alert", {
            type: "error",
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
  } else {
    if (socket.accessLevel >= permissions().items["userMod"]) {
      try {
        await moderation().clear(msg);
        moderation().sendMod(socket);
      } catch (err) {
        console.log(err);
        socket.emit("alert", {
          type: "error",
          message: "Something went wrong with the request",
        });
      }
    } else {
      moderation().clear("Ignore", socket.username);
    }
  }
}
