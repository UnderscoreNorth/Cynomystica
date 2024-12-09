import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
export default class {
  static tableName = "playlistItems";
  static tableCreate = `CREATE TABLE 'playlistItems' (
        'id' varchar(36)  PRIMARY KEY,
        'username' VARCHAR(20) NOT NULL,
        'title' VARCHAR(512),
        'url' VARCHAR(512),
        'duration' INT,
        'playlist' VARCHAR(100),
        'playcount' INT DEFAULT (0),
        'dateCreated' DATETIME(20) DEFAULT (DATETIME('now'))
    );`;
  static init = () => {
    return "";
  };
  static getPlaylist = (
    playlist: string,
    mode: "Random" | "Least Played" | "Add Date"
  ) => {
    let orderBy = "";
    switch (mode) {
      case "Random":
        orderBy = "ORDER BY RANDOM()";
        break;
      case "Least Played":
        orderBy = "ORDER BY playcount, RANDOM()";
        break;
      case "Add Date":
        orderBy = "ORDER BY dateCreated";
        break;
    }
    const results = db
      .prepare(
        `SELECT * FROM playlistItems WHERE playlist = @playlist ${orderBy}`
      )
      .all({
        playlist,
      }) as Array<{
      id: string;
      username: string;
      title: string;
      url: string;
      duration: number;
      playlist: string;
      playcount: number;
    }>;
    return results;
  };
  static updatePlayCount = async (id: string) => {
    await db
      .prepare(
        `UPDATE playlistItems SET playcount = playcount + 1 WHERE id=@id`
      )
      .run({ id });
    await db
      .prepare(
        `DELETE FROM playlistItems 
        WHERE playlist = (SELECT playlist FROM playlistItems WHERE id=@id)
        AND playcount > (SELECT deleteAfter FROM playlists WHERE id=((SELECT playlist FROM playlistItems WHERE id=@id)))
        AND (SELECT deleteAfter FROM playlists WHERE id=((SELECT playlist FROM playlistItems WHERE id=@id))) > 0`
      )
      .run({ id });
  };

  static insert = async (username: string, playlist: string, obj: any) => {
    obj.username = username;
    obj.id = uuidv4();
    obj.playlist = playlist;
    obj.duration = Math.ceil(obj.duration) ?? 0;
    await db
      .prepare(
        `
              INSERT INTO playlistItems
              (id,username,title,url,duration, playlist,playcount) 
              VALUES (@id,@username,@title,@url,@duration, @playlist,0)`
      )
      .run(obj);
  };
}
