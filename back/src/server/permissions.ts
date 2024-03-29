import permissionsSQL from "../sqliteTables/permissions";
import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
class Permissions {
  items: Record<string, number>;
  constructor() {
    this.items = {};
    this.refresh();
  }
  send(socket: socketInterface | Server) {
    socket?.emit("permissions", this.items);
  }
  async refresh() {
    await permissionsSQL.getAll().then((v) => {
      this.items = v;
    });
  }
  async upsert(permissions: Record<string, number>) {
    for (let permission in permissions) {
      await permissionsSQL.upsert(permission, permissions[permission]);
    }
    await this.refresh();
    this.send(IO());
  }
}
let permissions: Permissions;
export function init() {
  permissions = new Permissions();
}
export default function () {
  return permissions;
}
