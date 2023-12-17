import { default as IO } from "../server/socket";
import { socketInterface } from "../server/socket";
import users from "../sqliteTables/users";
import userModeration from "../sqliteTables/userModeration";
import userSettings from "../sqliteTables/userSettings";
export default async function socketLogin(
  socket: socketInterface,
  username: string
) {
  for (let otherSocket of Object.values(
    await IO().sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    if (otherSocket.username == username) {
      return "User already logged in.";
    }
  }
  let actions = await userModeration.getUser(username);
  for (let action of actions) {
    switch (action.action) {
      case "Ban":
        return "Username has been banned.";
      default:
        break;
    }
  }
  console.log("signin", username, socket.handshake.headers["x-real-ip"]);
  const accessLevel = (await users.getAccessLevel(username)) ?? 0;
  socket.username = username;
  socket.accessLevel = accessLevel;
  if (accessLevel >= 1) {
    socket.emit(
      "usersettings",
      await userSettings.get(
        socket.username,
        socket.handshake.headers["user-agent"]
      )
    );
  }
  return "success";
}
