import { db } from "../sqliteDB";
import { v4 as uuidv4 } from "uuid";
import playlistItems from "./playlistItems";
export default class {
  static tableName = "playlists";
  static tableCreate = `CREATE TABLE 'playlists' (
        'id' varchar(36)  PRIMARY KEY,
        'username' VARCHAR(20) NOT NULL,
        'name' VARCHAR(50) NOT NULL,
        'description' VARCHAR(512) NOT NULL,
        'mode' VARCHAR(10) NOT NULL,
        'durationLimit' INT NOT NULL,
        'itemLimit' INT NOT NULL,
        'deleteAfter' INT NOT NULL,
        'minAccessLevel' INT NOT NULL,
        'allowDuplicates' INT NOT NULL
    );`;
  static init = () => {
    return "";
  };
  static getPlaylists = async () => {
    let returnObj = {};
    const results = db.prepare(`SELECT * FROM playlists`).all();
    for (let row of results) {
      row.owner = row.username;
      delete row.username;
      row.items = await playlistItems.getPlaylist(row.id, "Add Date");
      returnObj[row.id] = row;
    }
    return returnObj;
  };
  static getPlaylist = async (id: string) => {
    const returnObj = db.prepare(`SELECT * FROM playlists WHERE id=@id`).get({
      id,
    });
    returnObj.owner = returnObj.username;
    delete returnObj.username;
    returnObj.items = await playlistItems.getPlaylist(returnObj.id, "Add Date");
    return returnObj;
  };
  static getPlaylistMeta = async (id: string) => {
    const returnObj = db.prepare(`SELECT * FROM playlists WHERE id=@id`).get({
      id,
    });
    returnObj.owner = returnObj.username;
    delete returnObj.username;
    returnObj.items = [];
    return returnObj;
  };
  static delete = async (id: string) => {
    await db
      .prepare(
        `
        DELETE FROM playlists WHERE id=@id`
      )
      .run({ id });
  };

  static upsert = async (username: string, obj: any) => {
    obj.username = username;
    obj.id = obj.id ?? uuidv4();
    obj.name = obj.title ?? "New Playlist";
    obj.description = obj.description ?? "";
    obj.mode = obj.mode ?? "Random";
    obj.durationLimit = obj.durationLimit ?? -1;
    obj.itemLimit = obj.itemLimit ?? -1;
    obj.allowDuplicates = obj.allowDuplicates ? 1 : 0;
    obj.deleteAfter = obj.deleteAfter ?? -1;
    obj.minAccessLevel = obj.minAccessLevel ?? 3;

    await db
      .prepare(
        `
        INSERT INTO playlists 
        (id,username,name,description,mode,durationLimit,itemLimit,deleteAfter,minAccessLevel,allowDuplicates) 
        VALUES (@id,@username,@name,@description,@mode,@durationLimit,@itemLimit,@deleteAfter,@minAccessLevel,@allowDuplicates)
        ON CONFLICT(id) DO UPDATE SET
        name=@name,
        description=@description,
        mode=@mode,
        durationLimit=@durationLimit,
        itemLimit=@itemLimit,
        deleteAfter=@deleteAfter,
        minAccessLevel=@minAccessLevel,
        allowDuplicates=@allowDuplicates`
      )
      .run(obj);
  };
}
