import { socketInterface } from "../server/socket";
import { default as chat } from "../server/chat";
import permissions from "../server/permissions";
interface incomingMessage {
  icon: string;
  msg: string;
}
export default function message(socket: socketInterface, obj: incomingMessage) {
  if (socket.accessLevel >= permissions.items["chat"]) {
    const messageObj = {
      username: socket.username,
      message: obj.msg.substring(0, 500),
      icon: obj.icon,
      time: new Date(),
    };
    socket.lastMessage = new Date();
    chat().message(messageObj, socket);
  }
}
