import { default as IO } from "../server/socket";
import { socketInterface } from "../server/socket";
import users from "../sqliteTables/users";
export default async function socketLogin(
  socket: socketInterface,
  username: string
) {
  for (let otherSocket of Object.values(
    await IO().sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    if (otherSocket.username == username) {
      return false;
    }
  }
  const accessLevel = (await users.getAccessLevel(username)) ?? 0;
  socket.username = username;
  socket.accessLevel = accessLevel;
  return true;
}
