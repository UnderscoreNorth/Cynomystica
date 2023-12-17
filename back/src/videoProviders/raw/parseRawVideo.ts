import { getVideoDurationInSeconds } from "get-video-duration";
import { PlaylistItem } from "../../server/playlist";
import * as CONFIG from "../../../config.json";
const parseRawVideo = (mediaURL: string) => {
  return new Promise<PlaylistItem>((resolve, reject) => {
    try {
      getVideoDurationInSeconds(
        mediaURL,
        CONFIG.FFPROBE ? CONFIG.FFPROBE : null
      )
        .then((duration: number) => {
          let regex = /^.+\/(.+)\.mp4$/;
          //@ts-ignore
          let name = decodeURI(mediaURL.match(regex)[1]);
          resolve({
            id: 0,
            name: name,
            url: mediaURL,
            startDate: null,
            endDate: null,
            username: "N/A",
            duration: duration,
            type: "raw",
            scheduledID: null,
          });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

export default parseRawVideo;
