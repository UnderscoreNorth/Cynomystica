import { socketInterface } from "../../server/socket";
import polls from "../../server/polls";
export default function closePoll(socket: socketInterface, msg: any) {
  polls().close(socket, msg.pollID);
}
