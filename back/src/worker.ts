import express from "express";
import { Express } from "express";
import config from "../config.json";
import { createServer } from "node:http";
import parseURL from "./lib/parseURL";

let app: Express;
app = express();
app.use(express.json({ limit: "50mb" }));
const port = config.WORKER_PORT;
const server = createServer(app);
// @ts-ignore
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
app.post("/processVideo", async (req, res) => {
  await parseURL(req.body.url, req.body.allowMultiple)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

export default app;
