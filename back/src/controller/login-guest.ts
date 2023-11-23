import socketLogin from "../lib/socketLogin";
import { socketInterface, sendUserList } from "../server/socket";
import * as jwt from "../lib/jwt";
import users from "../sqliteTables/users";
export default async function loginGuest(
  socket: socketInterface,
  message: any
) {
  console.log(4, message.username);
  if (users.existsUser(message.username)) {
    socket.emit("alert", {
      type: "login",
      message: "Username already taken",
    });
    return;
  }
  const usernameCheckResults = users.usernameCheck(message.username);
  if (usernameCheckResults.length) {
    socket.emit("alert", {
      type: "login",
      message: usernameCheckResults.join("\n"),
    });
    return;
  }
  if (!(await socketLogin(socket, message.username))) {
    setTimeout(() => {
      socket.emit("alert", {
        type: "login",
        message: "Username already taken",
      });
    }, 5000);
    return;
  }
  let accessToken = jwt.sign(message.username, "access");
  let refreshToken = jwt.sign(message.username, "refresh");
  socket.username = message.username;
  socket.accessLevel = 0;
  sendUserList();
  socket.emit("login", {
    username: message.username,
    accessLevel: 0,
    accessToken,
    refreshToken,
  });
}
