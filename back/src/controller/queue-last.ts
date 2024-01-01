import { socketInterface } from "../server/socket";
import { default as playlist } from "../server/playlist";
export default async function queueLast(socket: socketInterface, message: any) {
  if (socket.lastQueue) {
    if (new Date().getTime() - socket.lastQueue.getTime() < 500) {
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
  socket.lastQueue = new Date();
}
