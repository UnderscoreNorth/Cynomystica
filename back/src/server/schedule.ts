import { default as IO, type socketInterface } from "./socket";
import schedule from "../sqliteTables/schedule";
import permissions from "./permissions";

export const getSchedule = async (socket: socketInterface | null) => {
  let socketSchedule = await schedule.getAll(new Date("Jan 1 2000"));
  const sendSchedule = (socket: socketInterface) => {
    let visibleOnly =
      (socket.accessLevel ?? -1) < permissions().items["manageSchedule"];
    console.log(socket.accessLevel, visibleOnly);
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
