import { db } from "../sqliteDB";
import users from "../sqliteTables/users";
import userSettings from "../sqliteTables/userSettings";
import userModeration from "../sqliteTables/userModeration";
import schedule from "../sqliteTables/schedule";
import permissions from "../sqliteTables/permissions";
import icons from "../sqliteTables/icons";
import refreshTokens from "../sqliteTables/refreshTokens";
export default function dbInit() {
  const tableList = [
    users,
    userSettings,
    userModeration,
    schedule,
    permissions,
    icons,
    refreshTokens,
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
  }
}
