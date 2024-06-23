import { readFileSync, unlinkSync, watch } from "fs";
import playlist from "../server/playlist";

export function queueWatchInit() {
  const reading = new Set();
  watch("queue", async (eventType, filename) => {
    try {
      let txt = readFileSync(`queue/${filename}`, "utf8");
      if (reading.has(filename)) return;
      reading.add(filename);
      playlist.queueVideo({ mediaURL: txt }, "SYSTEM", null);
      unlinkSync(`queue/${filename}`);
      reading.delete(filename);
    } catch (err) {}
  });
}
