import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
import * as jwt from "../lib/jwt";
import socketLogin from "../lib/socketLogin";
export default async function loginToken(socket: socketInterface, data: any) {
  const username = data.username;
  const result = await jwt.verify(data.refreshToken, username, "refresh");
  if (result) {
    if (!(await socketLogin(socket, username))) {
      setTimeout(() => {
        socket.emit("alert", {
          type: "login-token",
          message: "User already logged in",
        });
      }, 5000);
      return;
    }
    let accessToken = jwt.sign(username, "access");
    let refreshToken = jwt.sign(username, "refresh");
    sendUserList();
    socket.emit("login", {
      username: username,
      accessLevel: socket.accessLevel,
      accessToken,
      refreshToken,
    });
  } else {
    setTimeout(() => {
      socket.emit("alert", { type: "login-token", message: "Token failed" });
    }, 5000);
  }
}
