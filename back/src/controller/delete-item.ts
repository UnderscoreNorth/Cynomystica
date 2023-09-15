import { socketInterface } from "../server/socket";
import { default as playlist } from "../server/playlist";
export default function deleteItem(socket: socketInterface, msg: any) {
  const itemID = msg.id;
  playlist.deleteVideo(itemID);
}
