import { socketInterface } from "../../server/socket";
import playlists from "../../sqliteTables/playlists";
import permissions from "../../server/permissions";
export default async function upsertPlaylist(
  socket: socketInterface,
  msg: any
) {
  if (socket.accessLevel >= permissions().items["createPlaylists"]) {
    await playlists.upsert(socket.username, msg);
    socket.emit("playlists", await playlists.getPlaylists());
  } else {
    socket.emit("alert");
  }
}
