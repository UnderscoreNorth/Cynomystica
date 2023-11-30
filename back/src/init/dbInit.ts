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

export default async function dbInit() {
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
        await db.prepare(table.tableCreate).run();
        if (table.init()) db.prepare(table.init()).run();
        console.log(table.tableName + " created");
      } catch (err) {
        console.log(table.tableName);
        throw err;
      }
    }
    let init = true;
    if (table.tableName == "schedule" && init) {
      db.prepare(table.init()).run();
      const cdn = "https://cynomystica.nyc3.cdn.digitaloceanspaces.com/";
      fetch(cdn).then(async (res) => {
        let json = JSON.parse(xml2json(await res.text())).elements[0].elements;
        let seinfeldC = 1;
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
          if (fileName.indexOf("Popotan/") == 0) {
            let ep = parseInt(fileName.substring(26, 28));
            obj.playtime = new Date(`Dec ${ep + 13} 2023 19:50:00`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Ninin_ga_Shinobu/") == 0) {
            let ep = parseInt(fileName.substring(38, 40));
            obj.title = `Ninin ga Shinobu Ep ${ep}`;
            obj.playtime = new Date(`Dec ${ep} 2023 20:40:00`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("School_Days/") == 0) {
            let ep = parseInt(fileName.substring(37, 39));
            obj.title = `School Days Ep ${ep}`;
            obj.playtime = new Date(`Dec ${ep + 12} 2023 20:40:00`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Toradora/") == 0) {
            let ep = parseInt(fileName.substring(36, 38));
            obj.title = `Toradora Ep ${ep}`;
            obj.playtime = new Date(`Dec ${ep} 2023 19:00:00`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("El_Cazador/") == 0) {
            let ep = parseInt(fileName.substring(45, 47));
            obj.title = `El Cazador De La Bruja Ep ${ep}`;
            let time = ep == 13 ? "19:50:00" : "20:15:00";
            let day = ep > 13 ? ep - 1 : ep;
            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Binchou-tan/") == 0) {
            let ep = parseInt(fileName.substring(20, 22));
            obj.title = `Binchou-tan Ep ${ep}`;
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
          if (fileName.indexOf("Kino_No_Tabi/") == 0) {
            let ep = parseInt(fileName.substring(26, 28));
            let time = "21:05:00";
            let day = ep;
            if (ep <= 1) {
              day = ep;
            } else if (ep <= 6) {
              day = ep + 2;
            } else if (ep <= 11) {
              day = ep + 4;
            } else {
              day = ep + 7;
            }
            if (ep >= 9) {
              time = "21:05:45";
            }
            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Seinfeld/") == 0) {
            let ep = seinfeldC;
            let time = "21:30:00";
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
            seinfeldC++;
          }
          if (fileName.indexOf("Nuku_Nuku/") == 0) {
            let ep = parseInt(fileName.substring(73, 75));
            obj.title = `Bannou Bunka Neko-Musume Ep ${ep}`;
            let time = "21:55:00";
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
          if (fileName.indexOf("FLCL/") == 0) {
            let ep = parseInt(fileName.substring(10, 12));
            obj.title = `FLCL Ep ${ep}`;
            let time = "21:55:00";
            let day = ep + 10;
            if (ep == 6) {
              day = 19;
            }
            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Sunred/") == 0) {
            let ep = parseInt(fileName.substring(35, 37));
            obj.title = `Astro Fighter Sunred Ep ${ep}`;
            let time = "22:40:00";
            let day = ep;
            if ([2, 3, 9, 10, 16, 17, 19, 22, 24, 25].includes(ep)) {
              time = "22:50:00";
            }
            if ([11, 12, 13, 14, 15, 18, 21].includes(ep)) {
              time = "22:35:00";
            }
            if ([20].includes(ep)) {
              time = "22:20:00";
            }
            if ([26].includes(ep)) {
              time = "22:25";
              day = 25;
            }
            if ([18, 19].includes(ep)) {
              day = 19;
            }
            if ([20, 21, 22].includes(ep)) {
              day = 20;
            }

            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Di_Gi_Charat/") == 0) {
            let ep = parseInt(fileName.substring(37, 39));
            let time = "22:55:00";
            let day = ep;
            if (ep > 1) {
              day += 2;
            }
            if (ep > 6) {
              day += 2;
            }
            if ([7, 9, 11, 13, 15].includes(ep)) {
              time = "22:50:00";
              day = 11 + (ep - 7) / 2;
            }
            if ([8, 10, 12, 14, 16].includes(ep)) {
              time = "22:54:00";
              day = 11 + (ep - 8) / 2;
            }

            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
          if (fileName.indexOf("Pugyuru/") == 0) {
            let ep = parseInt(fileName.substring(18, 20));
            obj.title = `Pugyuru Ep ${ep}`;
            let time = "23:00:00";
            let day = ep;
            if (ep > 1) {
              day += 2;
            }
            if (ep > 6) {
              day += 2;
            }
            if (ep > 11) {
              day += 5;
            }

            obj.playtime = new Date(`Dec ${day} 2023 ${time}`);
            schedule.upsert("_North", obj);
          }
        }
      });
      let nana = [
        "https://www.youtube.com/watch?v=JNqdWjYVyL8",
        "https://www.youtube.com/watch?v=N3kQ2BcDakg",
        "https://www.youtube.com/watch?v=nxWiI7kGqYU",
        "https://www.youtube.com/watch?v=Do3sR5M5NF0",
        "https://www.youtube.com/watch?v=7Zcjt6mPZm8",
        "https://www.youtube.com/watch?v=-WmnZRj5oJE",
        "https://www.youtube.com/watch?v=qcPmIusci30",
        "https://www.youtube.com/watch?v=L1sELDI-gTs",
        "https://www.youtube.com/watch?v=hyjzCcSHyMU",
        "https://www.youtube.com/watch?v=mWK-lZrRMLE",
        "https://www.youtube.com/watch?v=bGli38VXkcU",
        "https://www.youtube.com/watch?v=SAII13Mkcy0",
        "https://www.youtube.com/watch?v=O2Z7haBH44I",
        "https://www.youtube.com/watch?v=02CX4CxGekU",
        "https://www.youtube.com/watch?v=eSXunCYcdnE",
        "https://www.youtube.com/watch?v=_UbqDMY3D-E",
        "https://www.youtube.com/watch?v=lkXOAOpAvIU",
        "https://www.youtube.com/watch?v=XFN4IHjKS94",
        "https://www.youtube.com/watch?v=anP0S71mcnw",
        "https://www.youtube.com/watch?v=QChbuUrGLho",
        "https://www.youtube.com/watch?v=o_CjScMhjeU",
        "https://www.youtube.com/watch?v=KaHFXZWkX1A",
        "https://www.youtube.com/watch?v=DYxFZlFaoO0",
        "https://www.youtube.com/watch?v=eOsNfygRrD0",
        "https://www.youtube.com/watch?v=n-MKr2X8sxA",
        "https://www.youtube.com/watch?v=TWK20pLpcqU",
      ];
      for (let i = 0; i <= 25; i++) {
        console.log(nana[i]);
        let obj = (await parseURL(nana[i])) as any;
        obj.url = nana[i];
        obj.id = uuidv4();
        obj.title = obj.name.replaceAll(/\[[^\]]*\]/g, "");
        let ep = i + 1;
        obj.playtime = new Date(`Dec ${ep} 2023 19:25:00`);
        if (i == 25) {
          obj.playtime = new Date(`Dec 20 2023 21:55:00`);
        } else if (i == 0) {
          obj.playtime = new Date(`Dec 1 2023 19:26:00`);
        }
        obj.title = `Shichinin no Nana Ep ${ep}`;
        schedule.upsert("_North", obj);
      }
    }
  }
}
