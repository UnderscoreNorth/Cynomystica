import { db } from "../sqliteDB";
export default class {
  static tableName = "settings";
  static tableCreate = `CREATE TABLE 'settings' (
        'setting' varchar(50)  NOT NULL,
        'value' VARCHAR(500) NOT NULL,
        PRIMARY KEY ('setting')
    );`;
  static init = () => {
    return "";
  };
  static get = async () => {
    let res = await db.prepare(`SELECT * FROM settings`).all({});
    let obj = {};
    for (let row of res) {
      obj[row.setting] = row.value;
    }
    return obj;
  };
  static upsert = async (obj: any) => {
    if (typeof obj == "object") {
      for (let setting in obj) {
        let value = obj[setting];
        await db
          .prepare(
            `
            INSERT INTO settings (setting, value) VALUES(@setting,@value) ON CONFLICT(setting) DO UPDATE SET value=@value
            `
          )
          .run({ setting, value });
      }
    }
  };
}
