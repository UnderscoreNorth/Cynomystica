import * as fs from "fs";
import type { Messages } from "../server/chat";
import * as csv from "csv";
import { Moment } from "moment";
import moment from "moment";
import formatDate from "./formatDate";

export const writeToLog = (type: string, messages: Array<any>) => {
  if (messages.length) {
    const date: Moment = messages[0].time;
    const path = `./logs/${type}/${date.year()}/${date.month() + 1}/`;
    const fileName = `${date.date()}.csv`;
    createFolder(path);
    csv.stringify(
      messages.map((x) => {
        if (x.time) {
          return {...x, time: formatDate(x.time)};
        }
        return x;
      }),
      { header: false },
      (err, output) => {
        fs.appendFileSync(path + fileName, output);
        messages.splice(0, messages.length);
      }
    );
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
      time: moment.utc(record[3]),
    });
  }
  return records;
};

export const getFromLog = async (type: string) => {
  let tries = 0;
  const date = moment.utc();
  let logFile: string;
  try {
    do {
      logFile = `./logs/${type}/${date.year()}/${
        date.month() + 1
      }/${date.date()}.csv`;
      console.log(logFile);
      tries++;
      date.subtract(1, "day");
    } while (tries < 10 && !fs.existsSync(logFile));
    if (fs.existsSync(logFile)) {
      return await processFile(logFile);
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};
