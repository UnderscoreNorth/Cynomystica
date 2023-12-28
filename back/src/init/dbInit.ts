import { db } from "../sqliteDB";
import users from "../sqliteTables/users";
import userSettings from "../sqliteTables/userSettings";
import userModeration from "../sqliteTables/userModeration";
import schedule from "../sqliteTables/schedule";
import permissions from "../sqliteTables/permissions";
import icons from "../sqliteTables/icons";
import refreshTokens from "../sqliteTables/refreshTokens";
import playlists from "../sqliteTables/playlists";
import emotes from "../sqliteTables/emotes";
import settings from "../sqliteTables/settings";
import presets from "../sqliteTables/presets";

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
    emotes,
    settings,
    presets,
  ];
  //console.log(db.prepare(`SELECT * FROM sqlite_master`).all());

  for (const table of tableList) {
    const result = await db
      .prepare(
        `SELECT COUNT(*) as 'count' FROM sqlite_master WHERE name='${table.tableName}'`
      )
      .get();
    if (result.count == 0) {
      try {
        await db.prepare(table.tableCreate).run();
        if (table.init()) await db.prepare(table.init()).run();
        console.log(table.tableName + " created");
      } catch (err) {
        console.log(table.tableName);
        throw err;
      }
    }
  }
}
