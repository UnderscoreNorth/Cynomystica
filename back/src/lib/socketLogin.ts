import { default as IO } from "../server/socket";
import { socketInterface } from "../server/socket";
import users from "../sqliteTables/users";
import userModeration from "../sqliteTables/userModeration";
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
    switch (action) {
      case "Ban":
        return "Username has been banned.";
      default:
        break;
    }
  }
  const accessLevel = (await users.getAccessLevel(username)) ?? 0;
  socket.username = username;
  socket.accessLevel = accessLevel;
  return "success";
}
