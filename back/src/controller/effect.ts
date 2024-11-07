import { default as IO, socketInterface } from "../server/socket";
import { default as effects } from "../server/effects";
export default async function effect(
  socket: socketInterface,
  msg: { command: "toggle" | "update"; value: string; arg: string }
) {
  if (socket.accessLevel >= 4) {
    effects().updateEffects(msg);
    try {
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "permissions",
        message: "Something went wrong with the request",
      });
    }
  } else {
    socket.emit("alert", {
      type: "permissions",
      message: "You do not have permissions to perform this request",
    });
  }
}
