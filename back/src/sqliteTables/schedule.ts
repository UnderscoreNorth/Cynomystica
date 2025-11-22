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

const bulkEpisodeOffset = /\|n\+(\d+)\|/gi

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
      for (let url of urls) {
        if (url.trim().length == 0) continue;
        obj.url = url.trim();
        obj.id = uuidv4();
        obj.title = "";
        if (placeholder) {
          if(bulkEpisodeOffset.test(placeholder) === true){
            bulkEpisodeOffset.exec(placeholder)
            const offset = parseInt(bulkEpisodeOffset.exec(placeholder)[1]);
            obj.title = placeholder.replace(bulkEpisodeOffset, (num + offset).toString());
          } else {
            obj.title = placeholder.replace(/\|n\|/g, (num).toString());
          }
        }
        await subSert(obj, true);
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
    async function subSert(obj: SubsertObj, checkConflict = false) {
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
// Check for conflicts and handle them (for bulk inserts)
      let conflict = await db
        .prepare(
          `
    SELECT
      COUNT(*) AS c
    FROM
      schedule
    WHERE
      ((@start > playTimeUTC AND @start < finishTimeUTC)
      OR
      (@finish > playTimeUTC AND @finish < finishTimeUTC))
      AND id != @id`
        )
        .get({ start: obj.startTime, finish: obj.finishTime, id:obj.id });

      if (conflict.c > 0 && checkConflict) {
        // There's a conflict - for bulk inserts, skip to next day and try again
        // Only apply this logic if we're in bulk insert mode (freq >= 1)
        if (obj.freq >= 1) {
          let maxAttempts = 365; // Prevent infinite loops
          let attemptCount = 0;

          while (conflict.c > 0 && attemptCount < maxAttempts) {
            // Move to the next day
            obj.playtime.add(1, "days");

            // Check if this day is allowed based on dow (day of week)
            if (obj.dow && !obj.dow[obj.playtime.day()][1]) {
              attemptCount++;
              continue; // Skip to next day if not allowed
            }

            // Recalculate start and finish times
            obj.startTime = formatDate(obj.playtime);
            obj.finishTime = formatDate(
              obj.playtime.clone().add(obj.duration, "seconds")
            );

            // Check for conflicts again
            conflict = await db
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

            attemptCount++;
          }

          if (attemptCount >= maxAttempts) {
            console.log(`Could not find non-conflicting slot for: ${obj.title}`);
            return; // Skip this item
          }
        } else {
          // For non-bulk inserts, just skip if there's a conflict
          console.log(`Conflict detected for: ${obj.title}`);
          return;
        }
      }
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

      // No conflict, insert the item
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
    }
  };
}
