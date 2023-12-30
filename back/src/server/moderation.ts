import {
  default as userModeration,
  type actionTypes,
} from "../sqliteTables/userModeration";
import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
import { sendUserList } from "./socket";
class Moderation {
  users: Record<string, Record<string, Record<string, string>>>;
  constructor() {
    this.users = {};
    this.refresh();
  }
  sendMod(socket: socketInterface | Server) {
    socket?.emit("moderation", this.users);
  }
  async sendIgnored(socket: socketInterface) {
    socket.emit("ignores", await userModeration.getIgnores(socket.username));
  }
  async refresh() {
    await userModeration.getAll().then((res) => {
      this.users = {};
      for (let row of res) {
        if (row.action !== "Ignore") {
          this.users[row.username] = this.users[row.username] || {};
          this.users[row.username][row.action] = row;
        }
      }
    });
  }
  async insert(username: string, action: actionTypes, socket: socketInterface) {
    await userModeration.insert(username, action, socket.username);
    if (action !== "Ignore") {
      this.users[username] = this.users[username] || {};
      this.users[username][action] = {
        username,
        action,
        byUser: socket.username,
        dateCreated: new Date().toUTCString(),
      };
    }
  }
  async undoItem(username: string, action: actionTypes, byUser: string) {
    await userModeration.delete(username, action, byUser);
    if (action !== "Ignore") {
      await this.refresh();
      if (action == "Mute") sendUserList();
    }
  }
  async clear(action: actionTypes, byUser = "") {
    await userModeration.clear(action, byUser);
    if (action !== "Ignore") {
      await this.refresh();
      sendUserList();
    }
  }
}
let moderation: Moderation;
export function init() {
  moderation = new Moderation();
}
export default function () {
  return moderation;
}
