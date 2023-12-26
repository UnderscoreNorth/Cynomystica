import { default as IO, socketInterface } from "../../server/socket";
import permissions from "../../server/permissions";
import users from "../../sqliteTables/users";
export default async function updateUserRole(
  socket: socketInterface,
  msg: any
) {
  if (socket.accessLevel >= permissions.items["manageUsers"]) {
    try {
      await users.updateRole(msg.username, msg.accessLevel);
      let sockets = Object.values(await IO().sockets.fetchSockets());

      for (let socket of sockets as unknown as socketInterface[]) {
        if (socket.username == msg.username) {
          socket.accessLevel = msg.accessLevel;
          socket.emit("access-update", msg.accessLevel);
          break;
        }
      }
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
