import { socketInterface, sendUserList } from "../server/socket";
export default function disconnect(socket: socketInterface, msg: any) {
  console.log(socket.username + " Disconnected");
  socket.disconnect();
  sendUserList();
}
