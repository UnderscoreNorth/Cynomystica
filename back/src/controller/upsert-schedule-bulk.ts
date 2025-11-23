import { socketInterface } from "../server/socket";
import schedule from "../sqliteTables/schedule";
import { getSchedule } from "../server/schedule";
import permissions from "../server/permissions";
import { SubsertObj } from "../sqliteTables/schedule";
export default async function upsertScheduleBulk(
  socket: socketInterface,
  msg: SubsertObj[]
) {
  if (socket.accessLevel >= permissions().items["manageSchedule"]) {
    try {
      for(const item of msg){
        await schedule.upsert(socket.username, item);
      }
      await getSchedule(null);
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "queue",
        message: "Something went wrong with the request",
      });
    }
  }
}
