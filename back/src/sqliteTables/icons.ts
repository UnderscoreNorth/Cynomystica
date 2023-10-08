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
    return `INSERT INTO icons (id, display, color, url,preset)
    VALUES ('3','/3/','#33CCCC','/w/images/4/41/3_icon.png','default'),
    ('a','/a/','#FF0099','/w/images/3/3a/A_icon.png','default')`;
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
