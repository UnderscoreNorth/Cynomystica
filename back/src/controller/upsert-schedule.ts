import { socketInterface } from "../server/socket";
import users from "../sqliteTables/users";
import schedule from "../sqliteTables/schedule";
import { getSchedule } from "../server/schedule";
export default async function upsertSchedule(
  socket: socketInterface,
  msg: string
) {
  console.log(
    "user access level: ",
    socket.username,
    await users.getAccessLevel(socket.username)
  );
  //if ((await users.getAccessLevel(socket.username)) > 2) {
  await schedule.upsert(socket.username, msg);
  await getSchedule();
  //}
}
