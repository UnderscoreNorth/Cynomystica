import { db } from "../sqliteDB";
import { Moment } from "moment";
export type actionTypes = "Ignore" | "Ban" | "" | "Mute" | "IP Ban";
export type moderationItem = {
  action: actionTypes;
  byUser: string;
  dateCreated: Moment;
  username: string;
};
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
  static insert = async (
    username: string,
    action: actionTypes,
    byUser: string
  ) => {
    await db
      .prepare(
        `INSERT OR IGNORE INTO userModeration (username, action, byUser) VALUES (@username,@action,@byUser)`
      )
      .run({
        username,
        action,
        byUser,
      });
  };
  static delete = async (
    username: string,
    action: actionTypes,
    byUser: string
  ) => {
    await db
      .prepare(
        `DELETE FROM userModeration WHERE 
        username=@username AND action=@action 
        AND byUser= CASE WHEN @byUser = '' THEN byUser ELSE @byUser END`
      )
      .run({
        username,
        action,
        byUser,
      });
  };
  static clear = async (action: actionTypes, byUser = "") => {
    if (byUser.length > 0) {
      await db
        .prepare(
          `DELETE FROM userModeration WHERE action = 'Ignored' AND byUser=@byUser`
        )
        .run({ byUser });
    } else {
      if (action == "") {
        await db
          .prepare(`DELETE FROM userModeration WHERE action != 'Ignored'`)
          .run({});
      } else {
        await db
          .prepare(`DELETE FROM userModeration WHERE action=@action`)
          .run({
            action,
          });
      }
    }
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
  static getAction = async (action: actionTypes) => {
    return await db
      .prepare(`SELECT * FROM userModeration WHERE action=@action`)
      .all({ action });
  };
  static getByUserAction = async (username: string, action: actionTypes) => {
    return await db
      .prepare(
        `SELECT * FROM userModeration WHERE username=@username AND action=@action`
      )
      .all({ username, action });
  };
  static getAll = async () => {
    return await db.prepare(`SELECT * FROM userModeration`).all({});
  };
  static getIgnores = async (username: string) => {
    console.log(
      await db
        .prepare(
          `SELECT * FROM userModeration WHERE byUser=@username AND action='Ignore'`
        )
        .all({ username }),
      username
    );
    return await db
      .prepare(
        `SELECT * FROM userModeration WHERE byUser=@username AND action='Ignore'`
      )
      .all({ username });
  };
}
