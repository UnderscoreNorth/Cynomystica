import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
import socketLogin from "../lib/socketLogin";
import emitLogin from "../lib/emitLogin";
export default async function signUp(socket: socketInterface, signUp: any) {
  const result = await users.createUser(signUp.username, signUp.password);
  if (result.pass) {
    await socketLogin(socket, signUp.username);
    sendUserList();
    emitLogin(socket);
  } else {
    setTimeout(() => {
      socket.emit("alert", { type: "login", message: result.message });
    }, 10000);
  }
}
