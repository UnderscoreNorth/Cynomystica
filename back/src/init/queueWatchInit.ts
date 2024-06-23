import { existsSync, mkdirSync, readFileSync, unlinkSync, watch } from "fs";
import playlist from "../server/playlist";
const watchDir = "queue";
export function queueWatchInit() {
  if (!existsSync(watchDir)) {
    mkdirSync(watchDir);
  }
  const reading = new Set();
  watch(watchDir, async (eventType, filename) => {
    try {
      let txt = readFileSync(`${watchDir}/${filename}`, "utf8");
      if (reading.has(filename)) return;
      reading.add(filename);
      playlist.queueVideo({ mediaURL: txt }, "SYSTEM", null);
      unlinkSync(`${watchDir}/${filename}`);
      reading.delete(filename);
    } catch (err) {}
  });
}
