import { socketInterface } from "../../server/socket";
import playlists from "../../sqliteTables/playlists";
export default async function getPlaylists(socket: socketInterface, msg: any) {
  socket.emit("playlists", await playlists.getPlaylists());
}
