import { Server } from "socket.io";
import { default as IO, socketInterface } from "./socket";
class Effects {
  effects: Record<string, any>;
  constructor() {
    this.effects = {};
  }
  async updateEffects(msg: {
    command: "toggle" | "update";
    value: string;
    arg: string;
  }) {
    if (msg.command == "toggle") {
      if (this.effects[msg.value] == undefined)
        this.effects[msg.value] = {
          is_on: false,
        };
      this.effects[msg.value].is_on = !this.effects[msg.value].is_on;
      if (msg?.arg?.length) this.effects[msg.value].arg_1 = msg.arg;
    }
    this.sendEffects(IO());
  }
  sendEffects(socket: socketInterface | Server) {
    console.log(this.effects);
    socket?.emit("effects", this.effects);
  }
}
let effects: Effects;
export function init() {
  effects = new Effects();
}
export default function () {
  return effects;
}
