import userModeration from "../sqliteTables/userModeration";
import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
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
    socket.emit("moderation", await userModeration.getIgnores(socket.username));
  }
  async refresh() {
    await userModeration.getAll().then((res) => {
      for (let row of res) {
        if (row.action !== "ignored") {
          this.users[row.username] = this.users[row.username] || {};
          this.users[row.username][row.action] = row;
        }
      }
    });
  }
  async insert(username: string, action: string, socket: socketInterface) {
    await userModeration.insert(username, action, socket.username);
    if (action != "ignored") {
      this.users[username] = this.users[username] || {};
      this.users[username][action] = {
        username,
        action,
        byUser: socket.username,
        dateCreated: new Date().toUTCString(),
      };
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
