import { default as IO, socketInterface } from "./socket";
import { Server } from "socket.io";

export interface Message {
  username: string;
  message: string;
  time: Date;
}
export type Messages = Array<Message>;

export class Chat {
  recentMsgs: Messages;
  unloggedMsgs: Messages;
  constructor() {
    this.recentMsgs = [];
    this.unloggedMsgs = [];
  }
  message(message: Message) {
    if (this.recentMsgs.length > 100) this.recentMsgs.splice(0, 1);
    this.recentMsgs.push(message);
    this.unloggedMsgs.push(message);
    IO().emit("message", message);
  }
  getRecent(socket: Server | socketInterface) {
    socket.emit("message", this.recentMsgs);
  }
}
let chat = new Chat();
export default function () {
  return chat;
}
