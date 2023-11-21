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
    let icons = {
      Toradora: [
        ["Taiga", "#000000", "/w/images/3/3a/A_icon.png"],
        ["Ami", "#000000", "/w/images/3/3a/A_icon.png"],
        ["Minori", "#000000", "/w/images/3/3a/A_icon.png"],
        ["Inko", "#000000", "/w/images/3/3a/A_icon.png"],
        ["Ryuuji", "#000000", "/w/images/3/3a/A_icon.png"],
        ["Yasuko", "#000000", "/w/images/3/3a/A_icon.png"],
      ],
    };
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
  static get = (preset: string) => {
    const results = db.prepare(`SELECT * FROM icons WHERE preset=@preset`).all({
      preset,
    });
    let obj = {};
    for (let row of Array.from(results)) {
      // @ts-ignore
      obj[row.id] = { display: row.display, color: row.color, url: row.url };
    }
    return obj;
  };
  static upsert = async (username: string, obj: any) => {};
}
