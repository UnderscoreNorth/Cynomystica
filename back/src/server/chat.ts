import { default as IO } from "./socket";

export interface Message {
  from: string;
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
    this.recentMsgs.push(message);
    this.unloggedMsgs.push(message);
    IO().emit("message", message);
  }
}
let chat = new Chat();
export default function () {
  return chat;
}
