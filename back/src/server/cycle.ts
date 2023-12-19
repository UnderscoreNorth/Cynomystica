import { default as playlist } from "./playlist";
import { default as IO, activityCheck, checkVersion } from "./socket";
import polls from "./polls";
import chat from "./chat";
import { writeToLog } from "../lib/logger";

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
    currentTitle: playlist.playlist?.[0]?.name,
    currentURL: playlist.playlist?.[0]?.url,
  });
}
async function logActivity() {
  let { active, total } = await activityCheck();
  writeToLog("userActivity", [{ total, active, time: new Date() }]);
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
      polls().check();
      chat().logMessages();
    } catch (err) {
      console.log("cycle", err);
    } finally {
      inCycle = false;
      if (beat == 60) {
        logActivity();
        beat = 0;
      }
      if (beat % 10 == 0) {
        checkVersion();
      }
      if (beat % 5 == 0) {
        playlist.send(IO());
      }
    }
  }
};
setInterval(function () {
  cycle();
}, interval);
