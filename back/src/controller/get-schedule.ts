import { socketInterface } from "../server/socket";
import schedule from "../sqliteTables/schedule";
export default async function getSchedule(socket: socketInterface) {
  socket.emit("schedule", {
    status: "success",
    schedule: await schedule.getAll(new Date("Jan 1 2000")),
  });
}
