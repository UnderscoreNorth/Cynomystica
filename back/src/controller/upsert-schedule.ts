import { socketInterface } from "../server/socket";
import schedule from "../sqliteTables/schedule";
import { getSchedule } from "../server/schedule";
import permissions from "../server/permissions";
export default async function upsertSchedule(
  socket: socketInterface,
  msg: string
) {
  if (socket.accessLevel >= permissions.items["manageSchedule"]) {
    try {
      await schedule.upsert(socket.username, msg);
      await getSchedule();
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "queue",
        message: "Something went wrong with the request",
      });
    }
  }
}
