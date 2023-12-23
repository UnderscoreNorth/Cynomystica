import { default as IO, socketInterface } from "../server/socket";
import users from "../sqliteTables/users";
import icons from "../sqliteTables/icons";
import sendIcons from "../lib/sendIcons";
export default async function upsertIcons(
  socket: socketInterface,
  msg: string
) {
  if ((await users.getAccessLevel(socket.username)) >= 4) {
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
