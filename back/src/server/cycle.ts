import { default as playlist } from "./playlist";
import { default as IO, checkVersion } from "./socket";
import chat from "./chat";

let inCycle = false;
let lastPlaylist = "";
const interval = 1000;
let beat = 0;
function getCurrentPlayList() {
  return JSON.stringify(playlist.playlist);
}
function consoleVitals() {
  if (
    playlist.currentSeekTime == 0 &&
    playlist.playing == false &&
    playlist.playlist[0] == undefined
  )
    return;
  console.log({
    seek: playlist.currentSeekTime,
    playing: playlist.playing,
    current: playlist.playlist[0],
  });
}
export const cycle = async () => {
  if (!inCycle) {
    inCycle = true;
    try {
      beat++;
      if (beat == 1) {
        consoleVitals();
      }
      playlist.updateDates();
      let currentPlaylist = getCurrentPlayList();
      playlist.checkSchedule();
      if (currentPlaylist !== lastPlaylist) {
        console.log("playlist update");
        playlist.send(IO());
      }
      lastPlaylist = currentPlaylist;
      chat().logMessages();
    } catch (err) {
      console.log("cycle", err);
    } finally {
      inCycle = false;
      if (beat == 10) {
        checkVersion();
        beat = 0;
      }
      if (beat == 3) {
        playlist.send(IO());
      }
    }
  }
};
setInterval(function () {
  cycle();
}, interval);
