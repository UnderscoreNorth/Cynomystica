import { default as IO } from "../server/socket";
import { socketInterface } from "../server/socket";
import users from "../sqliteTables/users";
import moderation from "../server/moderation";
import userSettings from "../sqliteTables/userSettings";
export default async function socketLogin(
  socket: socketInterface,
  username: string
) {
  for (let otherSocket of Object.values(
    await IO().sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    if (otherSocket.username == username && otherSocket.accessLevel == 0) {
      return "User already logged in.";
    } else if (
      otherSocket.username == username &&
      otherSocket.accessLevel > 0
    ) {
      otherSocket.emit("alert", {
        type: "disconnect",
        message: "You have logged in elsewhere",
      });
    }
  }
  let actions = moderation().users[username];
  if (typeof actions == "object") {
    for (let action in actions) {
      switch (action) {
        case "Ban":
          return "Username has been banned.";
        default:
          break;
      }
    }
  }
  console.log("signin", username, socket.handshake.headers["x-real-ip"]);
  const accessLevel = (await users.getAccessLevel(username)) ?? 0;
  socket.username = username;
  socket.accessLevel = accessLevel;
  if (accessLevel >= 1) {
    users.updateLastLogin(socket.username);
    /*socket.emit(
      "usersettings",
      await userSettings.get(
        socket.username,
        socket.handshake.headers["user-agent"]
      )
    );*/
    moderation().sendIgnored(socket);
  }
  return "success";
}
