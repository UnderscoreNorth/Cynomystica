import { socketInterface } from "../server/socket";
import { default as playlist } from "../server/playlist";
export default function getPlaylist(socket: socketInterface) {
  playlist.send(socket);
}
