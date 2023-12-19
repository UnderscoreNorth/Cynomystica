import { socketInterface } from "../../server/socket";
import polls from "../../server/polls";
export default function createPoll(socket: socketInterface, msg: any) {
  polls().create(
    socket,
    msg.title.trim(),
    msg.options.filter((x) => x.trim() !== ""),
    msg.duration > 0 ? msg.duration : 0
  );
}
