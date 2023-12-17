import net, { Socket } from "net";
import CONFIG from "../../config.json";
export class SyncPlay {
  client: Socket;
  constructor() {
    this.client = net.createConnection(
      {
        host: CONFIG.SYNCPLAY.SERVER,
        port: CONFIG.SYNCPLAY.PORT,
      },
      () => {
        console.log("Connected to Syncplay");
        this.client.write(
          JSON.stringify({
            Set: {
              user: {
                YFDFDSFD: {
                  room: { name: CONFIG.SYNCPLAY.ROOM },
                  event: { joined: true },
                },
              },
            },
          }),
          (err) => {
            console.log("yeah", err);
          }
        );
      }
    );
    this.client.on("data", (data) => {
      console.log(31 + data.toString());
    });
    this.client.on("connect", () => {
      console.log("connected to Syncplay again");
      this.client.emit("data", "data");
    });
    this.client.write(
      JSON.stringify({
        Hello: {
          username: "SERVER_BOT",
          room: { name: CONFIG.SYNCPLAY.ROOM },
          version: "1.7.0",
        },
      })
    );
    this.client.on("drain", () => {
      console.log("drain");
    });

    this.client.on("end", () => {
      console.log("disconnected from server");
    });
    this.client.on("ready", () => {
      console.log("ready");

      this.client.write(
        JSON.stringify({
          Hello: {
            username: "SERVER_BOT",
            room: { name: CONFIG.SYNCPLAY.ROOM },
            version: "1.7.0",
          },
        })
      );
    });
    this.client.on("error", (e) => {
      console.log(e);
    });
    this.client.on("timeout", () => {
      console.log("timeout");
    });
  }
}
let syncPlay = new SyncPlay();
export default function () {
  return syncPlay;
}
