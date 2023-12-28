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
      toggleSpam: 0,
      schedule: 4,
      chat: 0,
      createPoll: 3,
      postImage: 2,
      pm: 0,
      userMod: 3,
      queuePlaylist: 0,
      managePlaylist: 2,
      togglePlaylist: 2,
      manageSchedule: 4,
      managePolls: 4,
      manageEmotes: 4,
      manageIcons: 4,
      managePermissions: 5,
      queueRaw: 1,
      manageUsers: 4,
      manageSettings: 5,
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
  static getAll = async () => {
    let res = await db.prepare("SELECT * FROM permissions").all();
    let obj = {};
    for (let row of res) {
      obj[row.permission] = row.level;
    }
    return obj;
  };
  static upsert = async (permission: string, level: number) => {
    return await db
      .prepare(
        `
    INSERT INTO permissions
    (permission, level) 
    VALUES (@permission, @level)
    ON CONFLICT(permission) DO UPDATE SET
        level=@level`
      )
      .run({ permission, level });
  };
}
