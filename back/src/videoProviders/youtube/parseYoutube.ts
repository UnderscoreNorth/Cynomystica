import config from "../../../config.json";
import { PlaylistItem } from "../../server/playlist";

const parseYoutube = (mediaURL: string) => {
  return new Promise<PlaylistItem>((resolve, reject) => {
    try {
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${mediaURL}&part=contentDetails,snippet&key=${config.YT_API_KEY}`
      ).then(async (result) => {
        const jsonResult = await result.json();
        const item = jsonResult.items[0];
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        let hours = 0,
          minutes = 0,
          seconds = 0,
          duration = 0;

        if (reptms.test(item.contentDetails.duration)) {
          const matches = reptms.exec(item.contentDetails.duration) || [];
          if (matches[1]) hours = Number(matches[1]);
          if (matches[2]) minutes = Number(matches[2]);
          if (matches[3]) seconds = Number(matches[3]);
          duration = hours * 3600 + minutes * 60 + seconds;
        }
        if (duration > 0) {
          resolve({
            id: 0,
            name: item.snippet.title,
            url: mediaURL,
            startDate: null,
            endDate: null,
            username: "N/A",
            duration: duration,
            type: "yt",
            scheduledID: null,
          });
        } else {
          reject();
        }
      });
    } catch (err) {
      reject();
    }
  });
};

export default parseYoutube;
