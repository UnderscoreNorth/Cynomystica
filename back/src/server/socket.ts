import { Server, Socket } from "socket.io";
import chat from "./chat";
import moderation from "./moderation";
import { Moment } from "moment";
import moment from "moment";
const errorDelay = 100;

export interface socketInterface extends Socket {
  username: string;
  uuid: string;
  accessLevel: number;
  lastQueue: Moment;
  lastMessage: Moment;
  version: number;
  muted: boolean;
}

let io: Server;

export const init = (server: Server) => {
  //@ts-ignore
  io = new Server(server, { path: "/ws" });
  chat().getFromLog();
  console.log("Socket Server Initialized");
  return io;
};
export default function () {
  return io;
}

export const activityCheck = async () => {
  const now = moment.utc();
  let active = 0;
  let total = 0;
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    total++;
    if (socket.lastMessage) {
      if (now.diff(socket.lastMessage) <= 600000) active++;
    }
  }
  return { active, total };
};

export const sendUserList = async () => {
  const userList: any = {};
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    let actions = moderation().users[socket.username];
    socket.muted = false;
    if (typeof actions == "object") {
      for (let action in actions) {
        switch (action) {
          case "Mute":
            socket.muted = true;
          default:
            break;
        }
      }
    }
    userList[socket.id] = {
      username: socket.username ?? socket.id,
      accessLevel: socket.accessLevel ?? -1,
      muted: socket.muted,
    };
  }
  io.emit("connected-users", userList);
};

export const checkVersion = async () => {
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    if (socket.version !== 1.05 && socket.version) {
      console.log("wrong version", socket.username, socket.version);
      socket.emit("alert", { type: "Reload" });
    }
  }
};
