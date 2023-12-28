import { default as IO, socketInterface } from "../../server/socket";
import emotes from "../../sqliteTables/emotes";
import sendEmotes from "../../lib/sendEmotes";
import permissions from "../../server/permissions";
export default async function upsertEmotes(
  socket: socketInterface,
  msg: string
) {
  if (socket.accessLevel >= permissions.items["manageEmotes"]) {
    try {
      await emotes.upsert(msg);
      sendEmotes(IO());
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "emotes",
        message: "Something went wrong with the request",
      });
    }
  }
}
