import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../lib/formatDate";
import { xml2js, xml2json } from "xml-js";
import parseURL from "../lib/parseURL";
export default class {
  static tableName = "playlists";
  static tableCreate = `CREATE TABLE 'playlists' (
        'id' varchar(36)  PRIMARY KEY,
        'username' VARCHAR(20) NOT NULL,
        'title' VARCHAR(512),
        'url' VARCHAR(512),
        'duration' INT,
        'playlist' VARCHAR(100),
        'playcount' INT,
        'dateCreated' DATETIME(20) DEFAULT (DATETIME('now'))
    );`;
  static init = () => {
    const cdn = "https://cynomystica.nyc3.cdn.digitaloceanspaces.com/";
    fetch(cdn).then(async (res) => {
      let json = JSON.parse(xml2json(await res.text())).elements[0].elements;
      for (let row of json) {
        if (row?.elements?.[0]?.name != "Key") continue;
        let fileName = row.elements[0].elements[0].text as string;
        if (!fileName.match(/^.*\.mp4$/)) continue;
        if (fileName.indexOf("Commercials") != 0) continue;
        this.insert(
          "_North",
          "Commercials",
          await parseURL(cdn + encodeURI(fileName))
        );
      }
    });
    return "";
  };
  static getPlaylist = (playlist: string) => {
    const results = db
      .prepare(
        `SELECT * FROM playlists WHERE playlist = @playlist ORDER BY playcount, id `
      )
      .all({
        playlist,
      });
    return results;
  };
  static updatePlayCount = async (id: string) => {
    await db
      .prepare(`UPDATE playlists SET playcount = playcount + 1 WHERE id=@id`)
      .run({ id });
  };

  static insert = async (username: string, playlist: string, obj: any) => {
    obj.username = username ?? "_North";
    obj.id = uuidv4();
    obj.title = obj.title ?? "";
    obj.playlist = playlist;
    obj.duration = Math.ceil(obj.duration) ?? 0;
    await db
      .prepare(
        `
              INSERT INTO playlists
              (id,username,title,url,duration, playlist) 
              VALUES (@id,@username,@title,@url,@duration, @playlist)`
      )
      .run(obj);
  };
}
