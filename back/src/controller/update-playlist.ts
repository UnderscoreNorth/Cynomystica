import { socketInterface } from "../server/socket";
import { PlaylistObj } from "../server/playlist";
import playlist from "../server/playlist";
import permissions from "../server/permissions";
import moment from "moment";
export default function updatePlaylist(
  socket: socketInterface,
  sentPlaylist: PlaylistObj
) {
  if (socket.accessLevel >= permissions().items["managePlaylist"]) {
    sentPlaylist = sentPlaylist.filter((x) => x !== null);
    let newPlaylist: PlaylistObj = [];
    let currentID = playlist.playlist[0].id;
    let newCurrentID = sentPlaylist[0].id;
    for (let item of sentPlaylist) {
      for (let subItem of playlist.playlist) {
        if (item.id == subItem.id) {
          newPlaylist.push(subItem);
        }
      }
    }
    playlist.playlist = newPlaylist;
    if (currentID !== newCurrentID) {
      playlist.currentSeekTime = 0;
      playlist.playlist[0].startDate = moment.utc();
    }
    playlist.send(null);
  }
}
