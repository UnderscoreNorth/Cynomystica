import { socketInterface } from "../../server/socket";
import polls from "../../server/polls";
export default function deletePoll(socket: socketInterface, msg: any) {
  polls().delete(socket, msg.pollID);
}
