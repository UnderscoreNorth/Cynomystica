import { socketInterface } from "../server/socket";
import permissions from "../sqliteTables/permissions";
export default async function sendPermissions(socket: socketInterface) {
  socket.emit("permissions", await permissions.getAll());
}
