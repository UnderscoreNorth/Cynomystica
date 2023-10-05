import { db } from "../sqliteDB";
export default class {
  static tableName = "permissions";
  static tableCreate = `CREATE TABLE 'permissions' (
      'permission' VARCHAR(512) NOT NULL,
      'level' INT NOT NULL,
      PRIMARY KEY ('permission')
  );`;
  static init = () => {
    let initPerms = {
      toggleSpam: 2,
      schedule: 2,
      queueSongs: 1,
      chat: 0,
      createPoll: 2,
      postImage: 1,
      ignore: 0,
      pm: 0,
      userMod: 2,
      togglePlaylist: 2,
    };
    let insertArr = [];
    for (let p in initPerms) {
      insertArr.push(` ('${p}',${initPerms[p]})`);
    }
    if (insertArr.length) {
      return `INSERT INTO permissions (permission, level) VALUES ${insertArr.join(
        ", "
      )}`;
    } else {
      return "";
    }
  };
  static get = async (permission: string) => {
    return await db
      .prepare("SELECT level from permissions WHERE permission=@permission")
      .get({ permission })?.level;
  };
}
