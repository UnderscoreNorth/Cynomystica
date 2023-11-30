import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
import * as jwt from "../lib/jwt";
import socketLogin from "../lib/socketLogin";
export default async function signUp(socket: socketInterface, signUp: any) {
  const result = await users.createUser(signUp.username, signUp.password);
  if (result.pass) {
    await socketLogin(socket, signUp.username);
    sendUserList();
    let accessToken = jwt.sign(signUp.username, "access");
    let refreshToken = jwt.sign(signUp.username, "refresh");
    socket.emit("login", {
      username: signUp.username,
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
