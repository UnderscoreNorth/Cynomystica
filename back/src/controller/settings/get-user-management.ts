import { default as IO, socketInterface } from "../../server/socket";
import permissions from "../../server/permissions";
import users from "../../sqliteTables/users";
export default async function getUserManagement(
  socket: socketInterface,
  msg: any
) {
  if (socket.accessLevel >= permissions().items["manageUsers"]) {
    try {
      socket.emit("user-management", await users.getUsers());
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "user management",
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
