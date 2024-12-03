import { socketInterface } from "../../server/socket";
import playlists from "../../sqliteTables/playlists";
import playlistItems from "../../sqliteTables/playlistItems";
import parseURL from "../../lib/parseURL";
import { PlaylistItem } from "../../server/playlist";
export default async function addToPlaylist(socket: socketInterface, msg: any) {
  let playlist = await playlists.getPlaylist(msg.playlist);
  if (socket.accessLevel >= playlist.minAccessLevel) {
    let itemCount = 0;
    let duration = 0;
    for (let item of playlist.items) {
      if (item.username == socket.username) {
        itemCount++;
        duration += item.duration;
      }
    }
    if (
      playlist.items.map((x) => x.url).includes(msg.url) &&
      !playlist.allowDuplicates
    ) {
      socket.emit("alert", {
        type: "playlist",
        message: "Duplicates are not allowed",
      });
      return;
    }
    if (playlist.itemLimit > 0 && itemCount >= playlist.itemLimit) {
      socket.emit("alert", { type: "playlist", message: "Item limit reached" });
      return;
    }
    let video: PlaylistItem[];
    for (const url of msg.url.split(",").map((x) => x.trim())) {
      try {
        video = await parseURL(url);
      } catch (error) {
        socket.emit("alert", {
          type: "playlist",
          message: "Invalid link",
        });
        return;
      }
      for (const v of video) {
        if (v.duration > 0) {
          if (
            playlist.durationLimit > 0 &&
            duration + v.duration > playlist.durationLimit * 60
          ) {
            duration += v.duration;
            socket.emit("alert", {
              type: "playlist",
              message: "Duration limit reached",
            });
            return;
          }
          await playlistItems.insert(socket.username, msg.playlist, {
            url: url,
            title: v.name,
            duration: v.duration,
          });
        }
      }
      socket.emit("playlists", await playlists.getPlaylists());
    }
  } else {
    socket.emit("alert", {
      type: "playlist",
      message: `You don't have permission to add to this playlist`,
    });
  }
}
