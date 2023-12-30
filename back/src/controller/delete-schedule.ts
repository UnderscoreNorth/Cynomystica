import { socketInterface } from "../server/socket";
import schedule from "../sqliteTables/schedule";
import { getSchedule } from "../server/schedule";
import permissions from "../server/permissions";
export default async function deleteSchedule(
  socket: socketInterface,
  msg: any
) {
  if (socket.accessLevel >= permissions().items["manageSchedule"]) {
    try {
      await schedule.delete(msg.id);
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
