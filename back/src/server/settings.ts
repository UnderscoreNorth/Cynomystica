import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
class Settings {
  settings: Record<string, any>;
  enabledPresets: Record<string, Record<string, boolean>>;
  constructor() {
    this.enabledPresets = {
      emotes: {},
      icons: {},
    };
    this.settings = {};
  }
  sendPreset(socket: socketInterface | Server) {
    socket?.emit("presets", this.enabledPresets);
  }
  updatePreset(presets: Record<string, Record<string, boolean>>) {
    this.enabledPresets = presets;
    this.sendPreset(IO());
  }
  refresh() {}
}
let settings = new Settings();
export default settings;
