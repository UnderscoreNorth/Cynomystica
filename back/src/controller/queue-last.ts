import { socketInterface } from "../server/socket";
import { default as playlist } from "../server/playlist";
import moment from "moment";
export default async function queueLast(socket: socketInterface, message: any) {
  if (socket.lastQueue) {
    if (moment.utc().diff(socket.lastQueue) < 500) {
      console.log(socket.username, "spamming");
      return;
    }
  }
  await playlist
    .queueVideo(message, socket.username, socket, null, true)
    .then(() => {})
    .catch((err) => {
      console.log("queuevideo", err);
    });
  socket.lastQueue = moment.utc();
}
