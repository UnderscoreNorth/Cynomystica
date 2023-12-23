import { socketInterface } from "../server/socket";
import icons from "../sqliteTables/icons";
import { Server } from "socket.io";
export default async function sendIcons(socket: socketInterface | Server) {
  socket.emit("icons", await icons.get());
}
