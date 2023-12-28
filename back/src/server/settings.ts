import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
import settingsSQL from "../sqliteTables/settings";
import presetsSQL from "../sqliteTables/presets";
class Settings {
  settings: Record<string, any>;
  enabledPresets: Record<string, Record<string, boolean>>;
  constructor() {
    this.enabledPresets = {
      emotes: {},
      icons: {},
    };
    this.settings = {};
    this.refreshSettings();
    this.refreshPresets();
  }
  sendPreset(socket: socketInterface | Server) {
    socket?.emit("presets", this.enabledPresets);
  }
  async updatePreset(presets: Record<string, Record<string, boolean>>) {
    await presetsSQL.upsert(presets);
    await this.refreshPresets();
    this.sendPreset(IO());
  }
  async updateSettings(settings: Record<string, string>) {
    {
      await settingsSQL.upsert(settings);
      await this.refreshSettings();
      this.sendSettings(IO());
    }
  }
  sendSettings(socket: socketInterface | Server) {
    socket?.emit("settings", this.settings);
  }
  async refreshSettings() {
    this.settings = await settingsSQL.get();
  }
  async refreshPresets() {
    this.enabledPresets = await presetsSQL.get();
  }
}
let settings: Settings;
export function init() {
  settings = new Settings();
}
export default function () {
  return settings;
}
