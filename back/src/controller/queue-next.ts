import { socketInterface } from "../server/socket";
import { default as playlist } from "../server/playlist";
export default async function queueNext(socket: socketInterface, message: any) {
  await playlist
    .queueVideo(message)
    .then(() => {
      playlist.send(null);
    })
    .catch((err) => {
      console.log("queuevideo", err);
    });
}
