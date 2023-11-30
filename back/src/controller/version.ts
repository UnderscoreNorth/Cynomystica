import { socketInterface, sendUserList } from "../server/socket";
export default async function version(
  socket: socketInterface,
  version: number
) {
  socket.version = version;
}
