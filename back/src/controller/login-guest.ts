import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
export default function loginGuest(socket: socketInterface, message: any) {
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
  socket.username = message;
  socket.accessLevel = 0;
  sendUserList();
  socket.emit("login", {
    username: message,
    accessLevel: 0,
  });
}
