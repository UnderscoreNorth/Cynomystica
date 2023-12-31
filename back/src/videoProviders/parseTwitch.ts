import { PlaylistItem } from "../server/playlist";
export default async function parseTwitch(id: string, type: "vod" | "live") {
  return new Promise<PlaylistItem>((resolve, reject) => {
    try {
      let name: string, url: string;
      let duration: number;
      if (type == "live") {
        name = id + " - twitch.tv livestream";
        url = id;
        duration = -1;
      }
      resolve({
        id: 0,
        name: name,
        url: url,
        startDate: null,
        endDate: null,
        username: "N/A",
        duration: duration,
        type: "tw_" + type,
        scheduledID: null,
      });
    } catch (err) {
      console.log(err);
      reject();
    }
  });
}
