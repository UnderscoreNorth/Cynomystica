import * as fs from "fs";
import type { Messages } from "../server/chat";
import * as csv from "csv";

export const writeChatToLog = (messages: Messages) => {
  if (messages.length) {
    const date = messages[0].time;
    const path = `./chatlogs/${date.getFullYear()}/${date.getMonth() + 1}/`;
    const fileName = `${date.getDate()}.csv`;
    createFolder(path);
    csv.stringify(messages, { header: false }, (err, output) => {
      fs.appendFile(path + fileName, output, (err) => {
        if (err) throw err;
        messages.splice(0, messages.length);
      });
    });
  }
};
export const createFolder = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

const processFile = async (file: string) => {
  const records = [];
  const parser = fs.createReadStream(file).pipe(
    csv.parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push({
      username: record[0],
      message: record[1],
      icon: record[2],
      time: new Date(parseInt(record[3])),
    });
  }
  return records;
};

export const getChatFromLog = async () => {
  let tries = 0;
  const date = new Date();
  let logFile: string;
  try {
    do {
      logFile = `./chatlogs/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}.csv`;
      console.log(logFile);
      tries++;
      date.setDate(date.getDate() - 1);
    } while (tries < 10 && !fs.existsSync(logFile));
    if (logFile) {
      return await processFile(logFile);
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};
