import { default as IO, socketInterface } from "../../server/socket";
import icons from "../../sqliteTables/icons";
import sendIcons from "../../lib/sendIcons";
import permissions from "../../server/permissions";
export default async function upsertIcons(
  socket: socketInterface,
  msg: string
) {
  if (socket.accessLevel >= permissions.items["manageIcons"]) {
    try {
      await icons.upsert(msg);
      sendIcons(IO());
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "queue",
        message: "Something went wrong with the request",
      });
    }
  }
}
