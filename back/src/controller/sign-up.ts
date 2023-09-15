import { socketInterface, sendUserList } from "../server/socket";
import users from "../sqliteTables/users";
export default async function signUp(socket: socketInterface, signUp: any) {
  const result = await users.createUser(signUp.username, signUp.password);
  if (result.pass) {
    socket.username = signUp.username;
    socket.accessLevel = signUp.accessLevel;
    sendUserList();
    socket.emit("login", {
      username: signUp.username,
      accessLevel: signUp.accessLevel,
    });
  } else {
    setTimeout(() => {
      socket.emit("alert", { type: "login", message: result.message });
    }, 10000);
  }
}
