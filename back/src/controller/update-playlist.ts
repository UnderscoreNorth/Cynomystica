import { socketInterface } from "../server/socket";
import { PlaylistObj } from "../server/playlist";
import playlist from "../server/playlist";
export default function updatePlaylist(
  socket: socketInterface,
  sentPlaylist: PlaylistObj
) {
  let newPlaylist: PlaylistObj = [];
  for (let item of sentPlaylist) {
    for (let subItem of playlist.playlist) {
      if (item.id == subItem.id) {
        newPlaylist.push(subItem);
      }
    }
  }
  playlist.playlist = newPlaylist;
  playlist.send(null);
}
