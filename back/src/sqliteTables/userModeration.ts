import { db } from "../sqliteDB";
export default class {
  static tableName = "userModeration";
  static tableCreate = `CREATE TABLE 'userModeration' (
    'username' VARCHAR(20) NOT NULL,
    'action' INT NOT NULL,
    'byUser' VARCHAR(20) NOT NULL,
    'dateCreated' DATETIME(20) DEFAULT (DATETIME('now')),
    PRIMARY KEY ('username','action','byUser')
);`;
  static init = () => {
    return "";
  };
  static insert = async (username: string, action: string, byUser: string) => {
    await db
      .prepare(
        `INSERT INTO userModeration (username, action, byUser) VALUES (@username,@action,@byUser)`
      )
      .run({
        username,
        action,
        byUser,
      });
  };
  static delete = async (username: string, action: string, byUser: string) => {
    await db
      .prepare(
        `DELETE FROM userModeration WHERE username=@username AND action=@action AND byUser=@byUser`
      )
      .run({
        username,
        action,
        byUser,
      });
  };
  static getUser = async (username: string) => {
    return await db
      .prepare(`SELECT * FROM userModeration WHERE username=@username`)
      .all({ username });
  };
  static getByUser = async (byUser: string) => {
    return await db
      .prepare(`SELECT * FROM userModeration WHERE byUser=@byUser`)
      .all({ byUser });
  };
  static getAction = async (action: string) => {
    return await db
      .prepare(`SELECT * FROM userModeration WHERE action=@action`)
      .all({ action });
  };
}
