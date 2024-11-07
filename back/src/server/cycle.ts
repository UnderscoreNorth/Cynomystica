import { default as playlist } from "./playlist";
import { default as IO, activityCheck, checkVersion } from "./socket";
import polls from "./polls";
import chat from "./chat";
import { writeToLog } from "../lib/logger";
import moment = require("moment");

let inCycle = false;
let lastPlaylist = "";
const interval = 1000;
let beat = 0;
function getCurrentPlayList() {
  return JSON.stringify(playlist.playlist);
}
function consoleVitals(beat: number) {
  if (
    !(
      playlist.currentSeekTime == 0 &&
      playlist.playing == false &&
      playlist.playlist[0] == undefined
    ) &&
    beat == 1
  )
    console.log({
      seek: playlist.currentSeekTime,
      playing: playlist.playing,
      currentTitle: playlist.playlist?.[0]?.name,
      currentURL: playlist.playlist?.[0]?.url,
    });

  const memoryUsage = process.memoryUsage();
  if (memoryUsage.heapTotal / 1024 / 1024 > 200) {
    console.log(`Memory Usage: ` + new Date().toLocaleTimeString());
    console.log(`  RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`);
    console.log(
      `  Heap Total: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
    );
    console.log(
      `  Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    );
    console.log(
      `  External: ${Math.round(memoryUsage.external / 1024 / 1024)} MB`
    );
  }
}
async function logActivity() {
  let { active, total } = await activityCheck();
  writeToLog("userActivity", [{ total, active, time: moment.utc() }]);
}
export const cycle = async () => {
  if (!inCycle) {
    inCycle = true;
    try {
      beat++;
      consoleVitals(beat);
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
