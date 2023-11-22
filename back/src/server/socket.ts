import { Server, Socket } from "socket.io";
const errorDelay = 100;

export interface socketInterface extends Socket {
  username: string;
  uuid: string;
  accessLevel: number;
}

let io: Server | undefined;

export const init = (server: Server) => {
  //@ts-ignore
  io = new Server(server, { path: "/ws" });
  console.log("Socket Server Initialized");
  return io;
};
export default function () {
  return io;
}

export const sendUserList = async () => {
  const userList: any = {};
  for (let socket of Object.values(
    await io.sockets.fetchSockets()
  ) as unknown as socketInterface[]) {
    userList[socket.id] = {
      username: socket.username ?? socket.id,
      accessLevel: socket.accessLevel ?? 0,
    };
  }
  io.emit("connected-users", userList);
};
