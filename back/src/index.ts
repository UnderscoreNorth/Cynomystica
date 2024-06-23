import express from "express";
import { Express } from "express";
import config from "../config.json";
import { createServer } from "node:http";
import dbInit from "./init/dbInit";
import ioInit from "./init/ioInit";
import { init, default as IO } from "./server/socket";
import { queueWatchInit } from "./init/queueWatchInit";

let app: Express;
dbInit().then(() => {
  app = express();
  const port = config.PORT;
  const server = createServer(app);
  // @ts-ignore
  init(server);
  ioInit(IO());
  queueWatchInit();
  //let syncPlay = SyncPlay();
  //playlist.queuePlaylist({ playlist: "Commercials", duration: 500 });

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

export default app;
