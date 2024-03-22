import { socketInterface } from "../server/socket";
import { getSchedule as get } from "../server/schedule";
export default async function getSchedule(
  socket: socketInterface,
  msg: string
) {
  get(socket, msg);
}
