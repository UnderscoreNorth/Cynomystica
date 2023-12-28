import { default as IO, socketInterface } from "../../server/socket";
import permissions from "../../server/permissions";
export default async function upsertPermissions(
  socket: socketInterface,
  msg: any
) {
  if (socket.accessLevel >= permissions().items["managePermissions"]) {
    try {
      await permissions().upsert(msg);
      permissions().send(IO());
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
