import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../lib/formatDate";
import parseURL from "../lib/parseURL";

export interface ScheduleItem {
  id: string;
  username: string;
  title: string;
  url: string;
  playTimeUTC: string;
  finishTimeUTC: string;
  visible: boolean;
  duration: number;
  minutes: number;
  playlist: string;
  selection: string;
  dateCreated: string;
}

export default class {
  static tableName = "schedule";
  static tableCreate = `CREATE TABLE 'schedule' (
        'id' varchar(36)  PRIMARY KEY,
        'username' VARCHAR(20) NOT NULL,
        'title' VARCHAR(512),
        'url' VARCHAR(512),
        'playTimeUTC' DATETIME(20),
        'finishTimeUTC' DATETIME(20),
        'visible' INT,
        'duration' INT,
        'minutes' INT,
			  'playlist' VARCHAR(512),
			  'selection' VARCHAR(20),
        'dateCreated' DATETIME(20) DEFAULT (DATETIME('now'))
    );`;
  static init = () => {
    return `DELETE FROM schedule`;
  };
  static getAll = (date = new Date()) => {
    let dateString = formatDate(date);
    const results = db
      .prepare(
        `SELECT * FROM schedule WHERE playTimeUTC > @date ORDER BY playTimeUTC ASC`
      )
      .all({
        date: dateString,
      });
    return results as Array<ScheduleItem>;
  };
  static delete = async (id: string) => {
    await db
      .prepare(
        `
              DELETE FROM schedule 
              WHERE id=@id`
      )
      .run({ id });
  };
  static upsert = async (username: string, obj: any) => {
    if (obj.url.includes(" ")) return;
    if (!obj.playtime) return;
    if (!obj.url) return;
    if (obj.freq >= 1) {
      let urls = obj.url.split(/,|\n/g);
      let placeholder = obj.title;
      let num = 1;
      for (let url of urls) {
        if (url.trim().length == 0) continue;
        obj.url = url.trim();
        obj.id = uuidv4();
        obj.title = "";
        if (placeholder) {
          obj.title = placeholder.replace(/\|n\|/g, num);
        }
        await subSert(obj);
        do {
          obj.playtime = new Date(
            new Date(obj.playtime).getTime() + obj.freq * 1000 * 60
          ).toString();
        } while (!obj.dow[new Date(obj.playtime).getDay()][1]);
        num++;
      }
    } else {
      await subSert(obj);
    }
    async function subSert(obj: any) {
      await parseURL(obj.url).then((playlistItem) => {
        obj.title = obj.title || playlistItem.name;
        obj.duration = Math.ceil(playlistItem.duration);
      });

      obj.username = username ?? "SCHEDULER";
      obj.id = obj.id ?? uuidv4();
      obj.visible = obj.visible ? 1 : 0;
      obj.startTime = formatDate(new Date(obj.playtime));
      obj.finishTime = formatDate(
        new Date(new Date(obj.playtime).getTime() + obj.duration * 1000)
      );
      let conflict = await db
        .prepare(
          `
    SELECT 
      COUNT(*) AS c 
    FROM 
      schedule 
    WHERE 
      (@start >= playTimeUTC AND @start <= finishTimeUTC)
      OR
      (@finish >= playTimeUTC AND @finish <= finishTimeUTC)`
        )
        .get({ start: obj.startTime, finish: obj.finishTime });
      if (conflict.c >= 0) {
        await db
          .prepare(
            `
              INSERT INTO schedule 
              (id,username,title,url,playTimeUTC,visible,finishTimeUTC,duration,minutes,playlist,selection) 
              VALUES (@id,@username,@title,@url,@startTime,@visible,@finishTime,@duration,@minutes,@playlist,@selection)
              ON CONFLICT(id) DO UPDATE SET
                  url=@url,
                  playTimeUTC = @startTime, 
                  finishTimeUTC=@finishTime, 
                  title=@title,
                  duration=@duration,
                  minutes=@minutes,
                  selection=@selection,
                  playlist=@playlist`
          )
          .run(obj);
      } else {
        console.log(obj.title, conflict.c);
      }
    }
  };
}
