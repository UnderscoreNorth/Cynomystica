import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../lib/formatDate";
import moment, { Moment } from "moment";
import { parseURLWorker } from "../lib/parseURLWorker";

export interface ScheduleItem {
  id: string;
  username: string;
  title: string;
  url: string;
  playTimeUTC: string;
  finishTimeUTC: string;
  visible: boolean | number;
  duration: number;
  playlist: string;
  selection: string;
  dateCreated: string;
  leeway: number;
  prequeueMinutes: number;
  hsl: string;
}
export type SubsertObj = {
  playtime: Moment;
  url: string;
  freq: number;
  playlist: string;
  id: string;
  title: string;
  dow: number[];
  duration: number;
  username: string;
  visible: boolean | number;
  leeway: number;
  startTime: string;
  finishTime: string;
  snap: "before" | "after";
  hsl: string;
};

const bulkEpisodeOffset = /\|n\+(\d+)\|/i

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
			  'playlist' VARCHAR(512),
			  'selection' VARCHAR(20),
        'leeway' INT,
        'prequeueMinutes' INT,
        'dateCreated' DATETIME(20) DEFAULT (DATETIME('now')),
        "hsl"	VARCHAR(500) DEFAULT '0,0,0'
    );`;
  static init = () => {
    return `DELETE FROM schedule`;
  };
  static getAll = async (date = moment.utc()) => {
    let dateString = formatDate(date);
    /*let dateStringUpper = formatDate(date.clone().add(2, "months"));
    const results = await db
      .prepare(
        `SELECT * FROM schedule WHERE         
        playTimeUTC > @date AND playtimeUTC <= @upper ORDER BY playTimeUTC ASC`
      )
      .all({
        date: dateString,
        upper: dateStringUpper,
      });*/
    const results = await db
      .prepare(
        `SELECT * FROM schedule WHERE         
        playTimeUTC > @date ORDER BY playTimeUTC ASC`
      )
      .all({
        date: dateString,
      });
    return results as Array<ScheduleItem>;
  };
  static delete = async (id: string) => {
    console.log("delete", id);
    await db
      .prepare(
        `
              DELETE FROM schedule 
              WHERE id=@id`
      )
      .run({ id });
  };
  static recheck = async () => {
    const results = (await db
      .prepare(
        `SELECT * FROM schedule WHERE         
        playTimeUTC > DATE('now') ORDER BY playTimeUTC ASC`
      )
      .all()) as Array<
      ScheduleItem & {
        playtime: Moment;
        finishTime: string;
        startTime: string;
        freq: number;
        dow: number[];
        snap: "before" | "after";
      }
    >;
    for (const result of results) {
      result.playtime = moment.utc(result.playTimeUTC);
      result.finishTime = result.finishTimeUTC;
      await this.upsert(result.username, result);
    }
  };
  static upsert = async (username: string, obj: SubsertObj) => {
    if (!obj.playtime) return;
    if (!obj.url && !obj.playlist) return;
    obj.playtime = moment.utc(obj.playtime);
    if (obj.freq >= 1) {
      let urls = obj.url.split(/,|\n/g);
      let placeholder = obj.title;
      let num = 1;
      let freq = 0;
      let jump = 0;
      let start = obj.playtime.clone();
      let offset = 0;
      for (let url of urls) {
        if (url.trim().length == 0) continue;
        obj.url = url.trim();
        obj.id = uuidv4();
        obj.title = "";
        if (placeholder) {
          if(bulkEpisodeOffset.test(placeholder)){
            offset = parseInt(bulkEpisodeOffset.exec(placeholder)[1]);
          }
          obj.title = placeholder.replace(/\|n\|/g, (num + offset).toString());
        }
        await subSert(obj);
        let prevDuration = await parseURLWorker(obj.url).then(
          (playlistItem) => {
            return Math.ceil(playlistItem[0].duration);
          }
        );
        let attempts = 0;
        freq++;
        if (freq == obj.freq) {
          jump++;
          freq = 0;
          obj.playtime = start.clone();
          obj.playtime.add(jump, "days");
          while (!obj.dow[obj.playtime.day()][1] && attempts < 1000) {
            obj.playtime.add(1, "days");
            jump++;
            attempts++;
          }
          if (attempts == 1000) return;
        } else {
          obj.playtime.add(prevDuration, "seconds");
        }
        num++;
      }
    } else {
      await subSert(obj);
    }
    async function subSert(obj: SubsertObj) {
      await parseURLWorker(obj.url).then((playlistItem) => {
        obj.title = obj.title || playlistItem[0].name;
        obj.duration = Math.ceil(playlistItem[0].duration);
      });

      obj.username = username ?? "SCHEDULER";
      obj.id = obj.id ?? uuidv4();
      obj.visible = obj.visible ? 1 : 0;
      obj.leeway = obj.leeway || 0;
      obj.startTime = formatDate(obj.playtime);
      obj.finishTime = formatDate(
        obj.playtime.clone().add(obj.duration, "seconds")
      );

      if (obj.snap == "before") {
        let adjItem = await db
          .prepare(
            `SELECT * FROM schedule WHERE playTimeUTC >= @finish ORDER BY playTimeUTC LIMIT 1`
          )
          .get({ finish: obj.finishTime });
        if (adjItem) {
          obj.finishTime = formatDate(moment.utc(adjItem.playTimeUTC));
          obj.startTime = formatDate(
            moment.utc(adjItem.playTimeUTC).subtract(obj.duration, "seconds")
          );
        }
      } else if (obj.snap == "after") {
        let adjItem = await db
          .prepare(
            `SELECT * FROM schedule WHERE finishTimeUTC <= @start ORDER BY playTimeUTC DESC LIMIT 1`
          )
          .get({ start: obj.startTime });
        if (adjItem) {
          obj.finishTime = formatDate(
            moment.utc(adjItem.finishTimeUTC).add(obj.duration, "seconds")
          );
          obj.startTime = formatDate(moment.utc(adjItem.finishTimeUTC));
        }
      }
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
              (id,username,title,url,playTimeUTC,visible,finishTimeUTC,duration,playlist,selection,leeway,prequeueMinutes,hsl) 
              VALUES (@id,@username,@title,@url,@startTime,@visible,@finishTime,@duration,@playlist,@selection,@leeway,@prequeueMinutes,@hsl)
              ON CONFLICT(id) DO UPDATE SET
                  url=@url,
                  playTimeUTC = @startTime, 
                  finishTimeUTC=@finishTime, 
                  title=@title,
                  duration=@duration,
                  selection=@selection,
                  playlist=@playlist,
                  visible=@visible,
                  leeway=@leeway,
                  prequeueMinutes=@prequeueMinutes,
                  hsl=@hsl`
          )
          .run(obj);
      } else {
        //console.log(obj.title, conflict.c);
      }
    }
  };
}
