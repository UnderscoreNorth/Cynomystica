import { db } from "../sqliteDB";
const types = ["icons", "emotes"];
export default class {
  static tableName = "presets";
  static tableCreate = `CREATE TABLE 'presets' (
        'type' varchar(50)  NOT NULL,
        'preset' VARCHAR(500) NOT NULL,
        PRIMARY KEY ('type','preset')
    );`;
  static init = () => {
    return "";
  };
  static get = async () => {
    let res = await db.prepare(`SELECT * FROM presets`).all({});
    let obj = {
      icons: {},
      emotes: {},
    };
    for (let row of res) {
      if (types.includes(row.type)) obj[row.type][row.preset] = true;
    }
    return obj;
  };
  static upsert = async (presets: Record<string, Record<string, boolean>>) => {
    for (let type in presets) {
      if (types.includes(type)) {
        for (let preset in presets[type]) {
          let value = presets[type][preset];
          if (value) {
            await db
              .prepare(
                `
            INSERT OR IGNORE INTO presets (type, preset) VALUES(@type,@preset)
            `
              )
              .run({ type, preset });
          } else {
            await db
              .prepare(
                `
            DELETE FROM presets WHERE type=@type AND preset=@preset
            `
              )
              .run({ type, preset });
          }
        }
      }
    }
  };
}
