import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
export default async function signIn(socket: socketInterface, signIn: any) {
  const result = await users.authenticateUser(signIn.username, signIn.password);
  if (result.pass) {
    socket.username = result.username;
    socket.accessLevel = result.accessLevel;
    sendUserList();
    socket.emit("login", {
      username: result.username,
      accessLevel: result.accessLevel,
    });
  } else {
    setTimeout(() => {
      socket.emit("alert", { type: "login", message: result.message });
    }, 10000);
  }
}
