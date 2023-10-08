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
          startDate: null,
          endDate: null,
          username: "N/A",
          duration: duration,
          type: "raw",
          scheduledID: null,
        });
      });
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

export default parseRawVideo;
