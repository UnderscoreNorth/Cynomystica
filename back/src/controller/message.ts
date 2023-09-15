import { socketInterface } from "../server/socket";
import { default as chat } from "../server/chat";
export default function message(socket: socketInterface, msg: string) {
  const messageObj = {
    from: socket.username,
    message: msg,
    time: new Date(),
  };
  console.log(9, msg);
  chat().message(messageObj);
}
