import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
import * as jwt from "../lib/jwt";
import socketLogin from "../lib/socketLogin";
export default async function signIn(socket: socketInterface, signIn: any) {
  const result = await users.authenticateUser(signIn.username, signIn.password);
  if (result.pass) {
    if (!(await socketLogin(socket, signIn.username))) {
      setTimeout(() => {
        socket.emit("alert", {
          type: "login",
          message: "User already logged in",
        });
      }, 5000);
      return;
    }
    let accessToken = jwt.sign(result.username, "access");
    let refreshToken = jwt.sign(result.username, "refresh");
    sendUserList();
    socket.emit("login", {
      username: result.username,
      accessLevel: result.accessLevel,
      accessToken,
      refreshToken,
    });
  } else {
    setTimeout(() => {
      socket.emit("alert", { type: "login", message: result.message });
    }, 10000);
  }
}
