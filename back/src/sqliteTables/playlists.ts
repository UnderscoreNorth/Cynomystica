import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
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
    return "";
  };
  static getPlaylist = (playlist: string) => {
    const results = db
      .prepare(
        `SELECT * FROM playlists WHERE playlist = @playlist ORDER BY playcount, RANDOM() `
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
              (id,username,title,url,duration, playlist,playcount) 
              VALUES (@id,@username,@title,@url,@duration, @playlist,0)`
      )
      .run(obj);
  };
}
