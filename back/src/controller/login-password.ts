import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
import socketLogin from "../lib/socketLogin";
import emitLogin from "../lib/emitLogin";
export default async function signIn(socket: socketInterface, signIn: any) {
  const result = await users.authenticateUser(signIn.username, signIn.password);
  if (result.pass) {
    let loginResult = await socketLogin(socket, signIn.username);
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
      socket.emit("alert", { type: "login", message: result.message });
    }, 2000);
  }
}
