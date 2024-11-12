import { default as IO, type socketInterface } from "./socket";
import schedule from "../sqliteTables/schedule";
import permissions from "./permissions";
import moment from "moment";

export const getSchedule = async (
  socket: socketInterface | null,
  date = "2000-01-01 00:00:00"
) => {
  let socketSchedule = await schedule.getAll(moment(date));
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
