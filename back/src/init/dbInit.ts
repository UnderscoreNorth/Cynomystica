import { db } from "../sqliteDB";
import users from "../sqliteTables/users";
import userSettings from "../sqliteTables/userSettings";
import userModeration from "../sqliteTables/userModeration";
import schedule from "../sqliteTables/schedule";
import permissions from "../sqliteTables/permissions";
import icons from "../sqliteTables/icons";
import refreshTokens from "../sqliteTables/refreshTokens";
import playlists from "../sqliteTables/playlists";

import { xml2js, xml2json } from "xml-js";
import parseURL from "../lib/parseURL";
import { v4 as uuidv4 } from "uuid";

export default function dbInit() {
  const tableList = [
    users,
    userSettings,
    userModeration,
    schedule,
    permissions,
    icons,
    refreshTokens,
    playlists,
  ];
  //console.log(db.prepare(`SELECT * FROM sqlite_master`).all());

  for (const table of tableList) {
    const result = db
      .prepare(
        `SELECT COUNT(*) as 'count' FROM sqlite_master WHERE name='${table.tableName}'`
      )
      .get();
    if (result.count == 0) {
      try {
        db.prepare(table.tableCreate).run();
        if (table.init()) db.prepare(table.init()).run();
        console.log(table.tableName + " created");
      } catch (err) {
        console.log(table.tableName);
        throw err;
      }
    }
    let init = false;
    if (table.tableName == "schedule" && init) {
      db.prepare(table.init()).run();
      const cdn = "https://cynomystica.nyc3.cdn.digitaloceanspaces.com/";
      fetch(cdn).then(async (res) => {
        let json = JSON.parse(xml2json(await res.text())).elements[0].elements;
        for (let row of json) {
          if (row?.elements?.[0]?.name != "Key") continue;
          let fileName = row.elements[0].elements[0].text as string;
          if (!fileName.match(/^.*\.mp4$/)) continue;
          if (fileName.indexOf("Commercials/") == 0) continue;
          let obj = (await parseURL(cdn + fileName)) as any;
          obj.id = uuidv4();
          obj.title = obj.name.replaceAll(/\[[^\]]*\]/g, "");
          console.log(fileName);
          if (fileName.indexOf("Ichigo_Marshmallow/") == 0) {
            let ep = parseInt(fileName.substring(43, 45));
            obj.playtime = new Date(`Dec ${ep} 2023 19:50:00`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("El_Cazador/") == 0) {
            obj.title = obj.title.replaceAll(".", " ");
            let ep = parseInt(fileName.substring(45, 47));
            let time = ep == 13 ? "19:50:00" : "20:15:00";
            let day = ep > 13 ? ep - 1 : ep;
            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Binchou-tan/") == 0) {
            let ep = parseInt(fileName.substring(20, 22));
            let time = ep > 6 ? "22:20:00" : "22:25:00";
            let day = ep;
            if (ep <= 1) {
              day = ep;
            } else if (ep <= 6) {
              day = ep + 2;
            } else if (ep <= 11) {
              day = ep + 4;
            } else {
              day = 19;
            }
            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
        }
      });
    }
  }
}
