import { Server, Socket } from "socket.io";
import chat from "./chat";
const errorDelay = 100;

export interface socketInterface extends Socket {
  username: string;
  uuid: string;
  accessLevel: number;
  lastQueue: Date;
  lastMessage: Date;
  version: number;
}

let io: Server | undefined;

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
  const now = new Date();
  let active = 0;
  let total = 0;
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    total++;
    if (socket.lastMessage) {
      if (now.getTime() - socket.lastMessage.getTime() <= 600000) active++;
    }
  }
  return { active, total };
};

export const sendUserList = async () => {
  const userList: any = {};
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    userList[socket.id] = {
      username: socket.username ?? socket.id,
      accessLevel: socket.accessLevel ?? -1,
    };
  }
  io.emit("connected-users", userList);
};

export const checkVersion = async () => {
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    if (socket.version !== 1.01 && socket.version) {
      console.log("wrong version", socket.username, socket.version);
      socket.emit("alert", { type: "Reload" });
    }
  }
};
