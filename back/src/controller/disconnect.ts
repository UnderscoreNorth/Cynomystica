import { socketInterface, sendUserList } from "../server/socket";
import polls from "../server/polls";
export default function disconnect(socket: socketInterface, msg: any) {
  polls().disconnect(socket);
  console.log(socket.username + " Disconnected");
  socket.disconnect();
  sendUserList();
}
