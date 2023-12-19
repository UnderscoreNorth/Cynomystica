import { socketInterface } from "../server/socket";
import emotes from "../sqliteTables/emotes";
export default async function sendEmotes(socket: socketInterface) {
  socket.emit("emotes", emotes.get());
}
