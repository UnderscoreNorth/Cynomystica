import { socketInterface } from "../server/socket";
import userSettings from "../sqliteTables/userSettings";
export default async function upsertUserSettings(
  socket: socketInterface,
  msg: string
) {
  try {
    await userSettings.upsert(
      socket.username,
      socket.request.headers["user-agent"],
      msg
    );
  } catch (err) {
    console.log(err);
    socket.emit("alert", {
      type: "queue",
      message: "Something went wrong",
    });
  }
}
