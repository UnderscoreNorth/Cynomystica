import { socketInterface } from "../../server/socket";
import playlists from "../../sqliteTables/playlists";
import permissions from "../../server/permissions";
export default async function deletePlaylist(
  socket: socketInterface,
  msg: any
) {
  if (socket.accessLevel >= permissions().items["createPlaylists"]) {
    await playlists.delete(msg.id);
    socket.emit("playlists", await playlists.getPlaylists());
  } else {
    socket.emit("alert");
  }
}
