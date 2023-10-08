import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../lib/formatDate";
import { format } from "path";
export default class {
  static tableName = "schedule";
  static tableCreate = `CREATE TABLE 'schedule' (
        'id' varchar(36)  PRIMARY KEY,
        'username' VARCHAR(20) NOT NULL,
        'title' VARCHAR(512),
        'url' VARCHAR(512),
        'playTimeUTC' DATETIME(20),
        'leeWayBefore' INT,
        'leeWayAfter' INT,
        'addToPlayList' DATETIME(20),
        'visible' INT,
        'dateCreated' DATETIME(20) DEFAULT (DATETIME('now'))
    );`;
  static init = () => {
    return "";
  };
  static getAll = (past = false) => {
    let date = past
      ? formatDate(new Date("Jan 1 2000"))
      : formatDate(new Date());
    const results = db
      .prepare(
        `SELECT * FROM schedule WHERE playTimeUTC > @date ORDER BY playTimeUTC DESC`
      )
      .all({
        date,
      });
    return results;
  };
  static upsert = async (username: string, obj: any) => {
    obj.username = username ?? "_North";
    obj.leewayBefore = obj.leewayBefore ?? 0;
    obj.leewayAfter = obj.leewayAfter ?? 0;
    obj.id = obj.id ?? uuidv4();
    obj.visible = obj.visible ? 1 : 0;
    obj.title = obj.title ?? "";
    obj.addTo = obj.addTo ?? 60;
    obj.addTo = formatDate(
      new Date(new Date(obj.playtime).getTime() + obj.addTo * 600000)
    );
    obj.playtime = formatDate(new Date(obj.playtime));

    await db
      .prepare(
        `
              INSERT INTO schedule 
              (id,username,title,url,playTimeUTC,leeWayBefore,leeWayAfter,visible,addToPlayList) 
              VALUES (@id,@username,@title,@url,@playtime,@leewayBefore,@leewayAfter,@visible,@addTo)
              ON CONFLICT(id) DO UPDATE SET
                  playTimeUTC = @playtime, addToPlayList=@addTo`
      )
      .run(obj);
  };
}
