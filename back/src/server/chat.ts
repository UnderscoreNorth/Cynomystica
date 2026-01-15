import { getFromLog, writeToLog } from "../lib/logger";
import messageFormatter from "../lib/messageFormatter";
import permissions from "./permissions";
import { default as IO, socketInterface } from "./socket";
import { Server } from "socket.io";
import { Moment } from "moment";
import subs from "./subs";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  username: string;
  message: string;
  icon: string;
  time: Moment;
}
export type Messages = Array<Message>;

let users = [];
setInterval(async()=>{
  let sockets = await IO().sockets.fetchSockets();
  users = [];
  for (let socket of Object.values(
       sockets   
        ) as unknown as socketInterface[]) {
          if(socket.username.includes('_'))
          users.push(socket.username);
        }
},1000);

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
    } else if (
      message.message == "/clear" &&
      socket.accessLevel >= permissions().items["clearChat"]
    ) {
      this.clear();
    } else {
      if (this.recentMsgs.length > 500) this.recentMsgs.splice(0, 1);
      if (!(socket.accessLevel >= permissions().items["postMedia"])) {
        message.message = message.message.replace(/(http[^\s]+):pic/gim, "$1");
        message.message = message.message.replace(/(http[^\s]+):vid/gim, "$1");
      }
      const conversionIndex:Record<string,string> = {};
      for(const user of users){
        if(message.message.includes(user)){
          const uuid = uuidv4()
          conversionIndex[uuid] = user;
          message.message = message.message.replace(new RegExp(user,'g'),uuid);
        }
      }

      message.message = messageFormatter(message.message);
      for(let uuid in conversionIndex){
         message.message = message.message.replace(new RegExp(uuid,'g'),conversionIndex[uuid]);
      }
      this.recentMsgs.push(message);
      this.unloggedMsgs.push(message);
      subs().message(message);
      IO().emit("message", message);
    }
  }
  getRecent(socket: Server | socketInterface) {
    socket.emit("message", this.recentMsgs);
  }
  logMessages() {
    writeToLog("chat", this.unloggedMsgs);
  }
  clear() {
    this.recentMsgs = [];
    IO().emit("clear-chat");
  }
  async getFromLog() {
    this.recentMsgs = await getFromLog("chat");
  }
}
let chat = new Chat();
export default function () {
  return chat;
}
