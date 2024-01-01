import { getVideoDurationInSeconds } from "get-video-duration";
import { PlaylistItem } from "../server/playlist";
import * as CONFIG from "../../config.json";
const parseRawVideo = (mediaURL: string) => {
  return new Promise<PlaylistItem>((resolve, reject) => {
    try {
      let regex = /^.+\/(.+)\.mp\d$/;
      //@ts-ignore
      let name = decodeURI(mediaURL.match(regex)[1]);
      getVideoDurationInSeconds(
        mediaURL,
        CONFIG.FFPROBE ? CONFIG.FFPROBE : null
      )
        .then((duration: number) => {
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
            permanent: false,
          });
        })
        .catch((err) => {
          console.log(28, err.toString());
          if (
            err == "Error: No duration found!" &&
            mediaURL.match(/^.+\/(.+)\.mp3$/)[1]
          ) {
            resolve({
              id: 0,
              name: name,
              url: mediaURL,
              startDate: null,
              endDate: null,
              username: "N/A",
              duration: -1,
              type: "raw",
              scheduledID: null,
              permanent: false,
            });
          } else {
            reject(err);
          }
        });
    } catch (err) {
      console.log(32, err);
      reject();
    }
  });
};

export default parseRawVideo;
