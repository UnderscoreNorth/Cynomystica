import permissionsSQL from "../sqliteTables/permissions";
import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
class Permissions {
  items: Record<string, number>;
  constructor() {
    this.refresh();
  }
  send(socket: socketInterface | Server) {
    socket.emit("permissions", this.items);
  }
  refresh() {
    permissionsSQL.getAll().then((v) => {
      this.items = v;
      this.send(IO());
    });
  }
  async upsert(permissions: Record<string, number>) {
    for (let permission in permissions) {
      await permissionsSQL.upsert(permission, permissions[permission]);
    }
    this.refresh();
  }
}
let permissions = new Permissions();
export default permissions;
