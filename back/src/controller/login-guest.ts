import socketLogin from "../lib/socketLogin";
import { socketInterface, sendUserList } from "../server/socket";
import * as jwt from "../lib/jwt";
import users from "../sqliteTables/users";
export default async function loginGuest(
  socket: socketInterface,
  message: any
) {
  console.log(4, message);
  if (users.existsUser(message)) {
    socket.emit("alert", {
      type: "login",
      message: "Username already taken",
    });
    return;
  }
  const usernameCheckResults = users.usernameCheck(message);
  if (usernameCheckResults.length) {
    socket.emit("alert", {
      type: "login",
      message: usernameCheckResults.join("\n"),
    });
    return;
  }
  if (!(await socketLogin(socket, message))) {
    setTimeout(() => {
      socket.emit("alert", {
        type: "login",
        message: "Username already taken",
      });
    }, 5000);
    return;
  }
  let accessToken = jwt.sign(message, "access");
  let refreshToken = jwt.sign(message, "refresh");
  socket.username = message;
  socket.accessLevel = 0;
  sendUserList();
  socket.emit("login", {
    username: message,
    accessLevel: 0,
    accessToken,
    refreshToken,
  });
}
