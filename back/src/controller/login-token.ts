import { socketInterface, sendUserList } from "../server/socket";
import * as jwt from "../lib/jwt";
import socketLogin from "../lib/socketLogin";
import emitLogin from "../lib/emitLogin";
export default async function loginToken(socket: socketInterface, data: any) {
  const username = data.username;
  const result = await jwt.verify(data.refreshToken, username, "refresh");
  if (result) {
    let loginResult = await socketLogin(socket, username);
    if (loginResult !== "success") {
      setTimeout(() => {
        socket.emit("alert", {
          type: "login",
          message: loginResult,
        });
      }, 2000);
      return;
    }
    sendUserList();
    emitLogin(socket);
  } else {
    setTimeout(() => {
      socket.emit("alert", { type: "login-token", message: "Token failed" });
    }, 2000);
  }
}
