import { socketInterface } from "../server/socket";
import { default as chat } from "../server/chat";
interface incomingMessage {
  icon: string;
  msg: string;
}
export default function message(socket: socketInterface, obj: incomingMessage) {
  const messageObj = {
    username: socket.username,
    message: obj.msg,
    icon: obj.icon,
    time: new Date(),
  };
  chat().message(messageObj);
}
