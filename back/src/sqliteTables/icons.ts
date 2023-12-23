import { db } from "../sqliteDB";
export default class {
  static tableName = "icons";
  static tableCreate = `CREATE TABLE 'icons' (
        'id' varchar(20)  NOT NULL,
        'display' VARCHAR(20) NOT NULL,
        'color' VARCHAR(7),
        'url' VARCHAR(512),
        'preset' VARCHAR(50),
        PRIMARY KEY ('id','preset')
    );`;
  static init = () => {
    let icons = {};
    let insertText =
      "INSERT INTO icons (id, display, color, url,preset) VALUES";
    let insertRows = [];
    for (let preset in icons) {
      for (let row of icons[preset]) {
        insertRows.push(
          `('${row[0]}','${row[0]}','${row[1]}','${row[2]}','${preset}') `
        );
      }
    }
    return insertText + insertRows.join(",");
  };
  static get = (preset: string | null = null) => {
    const results =
      preset === null
        ? db.prepare(`SELECT * FROM icons`).all({
            preset,
          })
        : db.prepare(`SELECT * FROM icons WHERE preset=@preset`).all({
            preset,
          });
    let obj = {};
    for (let row of Array.from(results) as any) {
      // @ts-ignore
      obj[row.preset + "-" + row.id] = {
        display: row.display,
        color: row.color,
        url: row.url,
        preset: row.preset,
      };
    }
    return obj;
  };
  static upsert = async (obj: any) => {
    if (Object.keys(obj).length > 0) {
      //@ts-ignore
      let preset = Object.values(obj)[0].preset;
      await db
        .prepare(
          `
            DELETE FROM icons
            WHERE preset=@preset`
        )
        .run({ preset });
      for (let iconID in obj) {
        let iconObj = obj[iconID];
        iconObj.id = iconObj.display;
        await db
          .prepare(
            `
            INSERT INTO icons
            (id, display, color, url, preset) 
            VALUES (@id,@display,@color,@url,@preset)
            ON CONFLICT(id, preset) DO UPDATE SET
                display=@display,
                color=@color,
                url=@url`
          )
          .run(iconObj);
      }
    }
  };
}
