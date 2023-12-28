import { db } from "../sqliteDB";
export default class {
  static tableName = "emotes";
  static tableCreate = `CREATE TABLE 'emotes' (
        'text' varchar(20)  NOT NULL,
        'url' VARCHAR(512),
        'preset' VARCHAR(50),
        PRIMARY KEY ('text','preset')
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
      obj[row.preset + "-" + row.text] = row;
    }
    return obj;
  };
  static upsert = async (obj: any) => {
    if (obj.preset) {
      //@ts-ignore
      let preset = obj.preset;
      await db
        .prepare(
          `
            DELETE FROM emotes
            WHERE preset=@preset`
        )
        .run({ preset });
      for (let emoteID in obj.emotes) {
        let emoteObj = obj.emotes[emoteID];
        await db
          .prepare(
            `
            INSERT INTO emotes
            (text, url, preset) 
            VALUES (@text,@url,@preset)
            ON CONFLICT(text, preset) DO UPDATE SET
                url=@url`
          )
          .run(emoteObj);
      }
    }
  };
}
