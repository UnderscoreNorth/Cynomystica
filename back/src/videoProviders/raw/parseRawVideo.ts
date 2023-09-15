import { getVideoDurationInSeconds } from "get-video-duration";
import { PlaylistItem } from "../../server/playlist";

const parseRawVideo = (mediaURL: string) => {
  return new Promise<PlaylistItem>((resolve, reject) => {
    try {
      getVideoDurationInSeconds(mediaURL).then((duration: number) => {
        resolve({
          id: 0,
          name: mediaURL,
          url: mediaURL,
          endDate: null,
          user: "N/A",
          duration: duration,
          type: "raw",
        });
      });
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

export default parseRawVideo;
