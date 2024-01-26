import { socketInterface, sendUserList } from "../server/socket";
import polls from "../server/polls";
import settings from "../server/settings";
export default function disconnect(socket: socketInterface, msg: any) {
  polls().disconnect(socket);
  if (settings().leader == socket.username) settings().setLeader("");
  console.log(socket.username + " Disconnected");
  socket.disconnect();
  sendUserList();
}
