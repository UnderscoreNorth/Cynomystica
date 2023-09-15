import { db } from "../sqliteDB";
import users from "../sqliteTables/users";
import userSettings from "../sqliteTables/userSettings";
import userModeration from "../sqliteTables/userModeration";
import schedule from "../sqliteTables/schedule";
export default function dbInit() {
  const tableList = [users, userSettings, userModeration, schedule];
  //console.log(db.prepare(`SELECT * FROM sqlite_master`).all());
  for (const table of tableList) {
    const result = db
      .prepare(
        `SELECT COUNT(*) as 'count' FROM sqlite_master WHERE name='${table.tableName}'`
      )
      .get();
    if (result.count == 0) {
      db.prepare(table.tableCreate).run();
      console.log(table.tableName + " created");
    }
  }
}
