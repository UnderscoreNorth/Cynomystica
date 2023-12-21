import { getFromLog, writeToLog } from "../lib/logger";
import messageFormatter from "../lib/messageFormatter";
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
  message(message: Message) {
    if (message.message == "/reload" && message.username == "_North") {
      IO().emit("alert", { type: "Reload" });
    } else {
      if (this.recentMsgs.length > 500) this.recentMsgs.splice(0, 1);
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
