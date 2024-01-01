import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
import settingsSQL from "../sqliteTables/settings";
import presetsSQL from "../sqliteTables/presets";
import { readFileSync, writeFileSync, existsSync } from "fs";
const infoPath = "./logs/info.html";
class Settings {
  settings: Record<string, any>;
  enabledPresets: Record<string, Record<string, boolean>>;
  info: string;
  constructor() {
    this.enabledPresets = {
      emotes: {},
      icons: {},
    };
    this.settings = {};
    this.info = "";
    this.refreshSettings();
    this.refreshPresets();
    this.refreshInfo();
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
  sendInfo(socket: socketInterface | Server) {
    socket?.emit("info", this.info);
  }
  async refreshSettings() {
    this.settings = await settingsSQL.get();
  }
  async refreshPresets() {
    this.enabledPresets = await presetsSQL.get();
  }
  async refreshInfo() {
    if (!existsSync(infoPath)) {
      writeFileSync(infoPath, "");
    }
    this.info = readFileSync(infoPath).toString();
  }
  async updateInfo(html: string) {
    let allowedEl = [
      "div",
      "style",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "b",
      "hr",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "a",
      "p",
      "i",
      "u",
      "img",
      "video",
      "ol",
      "ul",
      "li",
    ];
    html = html.replace(/</g, "&lt;");
    for (let el of allowedEl) {
      let regex = new RegExp(`&lt;` + el, "gi");
      html = html.replace(regex, "<" + el);
      regex = new RegExp(`&lt;\/` + el, "gi");
      html = html.replace(regex, "<" + el);
    }
    writeFileSync(infoPath, html);
    this.info = html;
    this.sendInfo(IO());
  }
}
let settings: Settings;
export function init() {
  settings = new Settings();
}
export default function () {
  return settings;
}
