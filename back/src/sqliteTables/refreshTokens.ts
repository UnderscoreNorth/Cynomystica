import { db } from "../sqliteDB";
export default class {
  static tableName = "refreshTokens";
  static tableCreate = `CREATE TABLE 'refreshTokens' (
      'token' VARCHAR(200) NOT NULL,
      'username' INT NOT NULL,
      'dateCreated' DATETIME(20) DEFAULT (DATETIME('now')),
      'dateExpires' DATETIME(20) NOT NULL,
      'dateRevoked' DATETIME(20) DEFAULT NULL
      PRIMARY KEY ('token')
  );`;
  static init = () => {
    return "";
  };
  static check = async (token: string) => {
    return await db
      .prepare(
        `SELECT token from refreshTokens 
      WHERE token=@token AND dateRevoked IS NULL AND dateExpires > DATETIME('now')`
      )
      .get({ token })?.token;
  };
  static insert = async (username: string, token: string, expires: string) => {
    await db
      .prepare(
        `INSERT INTO refreshTokens (token,username,dateExpires) 
            VALUES (@token,@username,@expires)`
      )
      .run({ username, token, expires });
  };
  static revoke = async (username: string, token: string) => {
    await db
      .prepare(
        `UPDATE refreshTokens 
          SET dateRevoked = DATETIME('now') 
          WHERE username=@username AND token = @token`
      )
      .run({ username, token });
  };
}
