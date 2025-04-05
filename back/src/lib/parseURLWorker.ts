import config from "../../config.json";
import { PlaylistItem } from "../server/playlist";
export async function parseURLWorker(url: string, allowMultiple = false) {
  let host = "http://localhost:" + config.WORKER_PORT + "/processVideo";
  let res = await fetch(host, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      allowMultiple,
    }),
  });
  return (await res.json()) as PlaylistItem[];
}
