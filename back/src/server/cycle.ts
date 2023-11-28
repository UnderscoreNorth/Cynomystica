import { default as playlist } from "./playlist";
import { default as IO } from "./socket";
import chat from "./chat";

let inCycle = false;
let lastPlaylist = "";
const interval = 1000;
let beat = 0;
function getCurrentPlayList() {
  return JSON.stringify(playlist.playlist);
}
function consoleVitals() {
  /*console.log({
    playlist: playlist.obj,
    currentSeekTime,
    currentVideoDuration,
  });*/
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
      await playlist.checkSchedule();
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
        beat = 0;
      }
    }
  }
};
setInterval(function () {
  cycle();
}, interval);
