import { default as playlist } from "./playlist";
import { default as IO } from "./socket";
import schedule from "../sqliteTables/schedule";
import { writeChatToLog } from "../chatLogging";

let inCycle = false;
let playlistIndex = 0;
let currentSeekTime = 0;
let currentVideoDuration = 0;
let startTime = new Date();
let lastPlaylist = "";
const interval = 1000;
let beat = 0;
export const cycle = async () => {
  if (!inCycle) {
    inCycle = true;
    try {
      beat++;
      if (beat == 1) {
        console.log({
          playlist: playlist.obj,
          currentSeekTime,
          currentVideoDuration,
        });
      }
      currentSeekTime =
        Math.abs(new Date().getTime() - startTime.getTime()) / 1000;
      let currentPlaylist = JSON.stringify([playlist.order, playlist.obj]);
      if (playlist.order.length && Object.values(playlist.order).length) {
        if (currentSeekTime > currentVideoDuration) {
          if (currentVideoDuration > 0) {
            const id = playlist.order[playlistIndex];
            delete playlist.obj[id];
            playlist.order.splice(playlistIndex, 1);
          }
          if (playlist.order.length && Object.values(playlist.order).length) {
            const playlistItem = playlist.obj[playlist.order[playlistIndex]];
            currentVideoDuration = playlistItem.duration;
          } else {
            currentVideoDuration = 0;
          }
          currentSeekTime = 0;
          startTime = new Date();
          playlist.send(IO());
        } else {
          IO().emit("seek-update", {
            status: "success",
            seekTime: currentSeekTime,
          });
        }
        currentPlaylist = JSON.stringify([playlist.order, playlist.obj]);
      } else {
        currentSeekTime = 0;
        startTime = new Date();
        playlistIndex = 0;
        currentVideoDuration = 0;
      }
      let scheduled = await schedule.getAll();
      if (scheduled[0] && Object.keys(playlist.obj)?.length == 0) {
        let nextScheduledItem = scheduled[0];
        if (new Date() >= new Date(nextScheduledItem.playTimeUTC) || 1 == 1) {
          playlist.queueVideo(nextScheduledItem.url, playlist.index);
        }
      }
      if (currentPlaylist !== lastPlaylist) {
        console.log("playlist update");
        playlist.send(IO());
      }
      lastPlaylist = currentPlaylist;
    } catch (err) {
      console.log("cycle", err);
    } finally {
      inCycle = false;
      if (beat == 10) {
        beat = 0;
      }
    }
  }
  //writeChatToLog(unloggedMessages);
};
setInterval(function () {
  cycle();
}, interval);
