import { socketInterface } from "../server/socket";
import emotes from "../sqliteTables/emotes";
import { Server } from "socket.io";
export default async function sendEmotes(socket: socketInterface | Server) {
  socket.emit("emotes", emotes.get());
}
