import { default as IO, socketInterface } from "../../server/socket";
import settings from "../../server/settings";
import permissions from "../../server/permissions";
export default async function upsertPresets(socket: socketInterface, msg: any) {
  if (
    socket.accessLevel >= permissions.items["manageIcons"] ||
    socket.accessLevel >= permissions.items["manageEmotes"]
  ) {
    try {
      settings.updatePreset(msg);
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
