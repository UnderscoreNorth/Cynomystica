import { db } from "../sqliteDB";
export default class {
  static tableName = "emotes";
  static tableCreate = `CREATE TABLE 'emotes' (
        'text' varchar(20)  NOT NULL,
        'url' VARCHAR(512),
        'preset' VARCHAR(50),
        PRIMARY KEY ('text')
    );`;
  static init = () => {
    return "";
  };
  static get = (preset: string | null = null) => {
    const results =
      preset === null
        ? db.prepare(`SELECT * FROM emotes`).all({
            preset,
          })
        : db.prepare(`SELECT * FROM emotes WHERE preset=@preset`).all({
            preset,
          });
    let obj = {};
    for (let row of Array.from(results) as any) {
      // @ts-ignore
      obj[row.text] = row.url;
    }
    return obj;
  };
  static upsert = async (username: string, obj: any) => {};
}
