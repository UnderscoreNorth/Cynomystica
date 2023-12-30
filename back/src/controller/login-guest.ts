import socketLogin from "../lib/socketLogin";
import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
import emitLogin from "../lib/emitLogin";
export default async function loginGuest(
  socket: socketInterface,
  message: any
) {
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
  let loginResult = await socketLogin(socket, message.username);
  if (loginResult !== "success") {
    setTimeout(() => {
      socket.emit("alert", {
        type: "login",
        message: loginResult,
      });
    }, 1000);
    return;
  }
  socket.username = message.username;
  socket.accessLevel = 0;
  sendUserList();
  emitLogin(socket);
}
