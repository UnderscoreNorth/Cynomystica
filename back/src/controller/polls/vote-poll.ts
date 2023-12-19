import { socketInterface } from "../../server/socket";
import polls from "../../server/polls";
export default function votePoll(socket: socketInterface, msg: any) {
  polls().vote(socket, msg.pollID, msg.vote);
}
