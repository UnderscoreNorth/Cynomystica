import { socketInterface } from "../server/socket";
import * as jwt from "../lib/jwt";
export default function emitLogin(socket: socketInterface) {
  let accessToken = jwt.sign(socket.username, "access");
  let refreshToken = jwt.sign(socket.username, "refresh");
  socket.emit("login", {
    username: socket.username,
    accessLevel: socket.accessLevel,
    accessToken,
    refreshToken,
  });
}
