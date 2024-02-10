import { socketInterface } from "../server/socket";
import { default as chat } from "../server/chat";
import permissions from "../server/permissions";
import moment from "moment";
interface incomingMessage {
  icon: string;
  msg: string;
}
export default async function message(
  socket: socketInterface,
  obj: incomingMessage
) {
  if (socket.accessLevel >= permissions().items["chat"]) {
    if (!socket.muted) {
      const messageObj = {
        username: socket.username,
        message: obj.msg.substring(0, 500),
        icon: obj.icon,
        time: moment.utc(),
      };
      socket.lastMessage = moment.utc();
      chat().message(messageObj, socket);
    }
  }
}
