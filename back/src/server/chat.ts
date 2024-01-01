import { getFromLog, writeToLog } from "../lib/logger";
import messageFormatter from "../lib/messageFormatter";
import permissions from "./permissions";
import { default as IO, socketInterface } from "./socket";
import { Server } from "socket.io";

export interface Message {
  username: string;
  message: string;
  icon: string;
  time: Date;
}
export type Messages = Array<Message>;

export class Chat {
  recentMsgs: Messages;
  unloggedMsgs: Messages;
  constructor() {
    this.recentMsgs = [];
    this.unloggedMsgs = [] as Array<Message>;
  }
  message(message: Message, socket: socketInterface) {
    if (message.message == "/reload" && socket.accessLevel >= 4) {
      IO().emit("alert", { type: "Reload" });
    } else {
      if (this.recentMsgs.length > 500) this.recentMsgs.splice(0, 1);
      if (!(socket.accessLevel >= permissions().items["postMedia"])) {
        message.message = message.message.replace(/(http[^\s]+):pic/gim, "$1");
        message.message = message.message.replace(/(http[^\s]+):vid/gim, "$1");
      }
      message.message = messageFormatter(message.message);
      this.recentMsgs.push(message);
      this.unloggedMsgs.push(message);
      IO().emit("message", message);
    }
  }
  getRecent(socket: Server | socketInterface) {
    socket.emit("message", this.recentMsgs);
  }
  logMessages() {
    writeToLog("chat", this.unloggedMsgs);
  }
  async getFromLog() {
    this.recentMsgs = await getFromLog("chat");
  }
}
let chat = new Chat();
export default function () {
  return chat;
}
