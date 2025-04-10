import { default as IO, type socketInterface } from "./socket";
import schedule from "../sqliteTables/schedule";
import permissions from "./permissions";
import moment from "moment";

export const getSchedule = async (
  socket: socketInterface | null,
  date = "2000-01-01T00:00:00.000Z"
) => {
  let socketSchedule = await schedule.getAll(moment(date).subtract(1, "day"));
  const sendSchedule = (socket: socketInterface) => {
    let visibleOnly =
      (socket.accessLevel ?? -1) < permissions().items["manageSchedule"];
    socket.emit("schedule", {
      status: "success",
      schedule: socketSchedule.filter(
        (x) => !visibleOnly || (x.visible && visibleOnly)
      ),
    });
  };
  if (socket == null) {
    for (let socket of Object.values(
      await IO().sockets.fetchSockets()
    ) as unknown as socketInterface[]) {
      sendSchedule(socket);
    }
  } else {
    sendSchedule(socket);
  }
};
