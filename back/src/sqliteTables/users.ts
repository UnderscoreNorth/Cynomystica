import bcrypt from "bcryptjs";
import { db } from "../sqliteDB";
import { default as IO, socketInterface } from "../server/socket";
export default class {
  static tableName = "users";
  static tableCreate = `CREATE TABLE 'users' (
		'username' VARCHAR(20) NOT NULL,
		'email' VARCHAR(100),
		'passwordHash' VARCHAR(100) NOT NULL,
		'accessLevel' int,
		'dateCreated' DATETIME(20) DEFAULT (DATETIME('now')),
		PRIMARY KEY ('username')
	);`;
  /*
  Access Levels
  -1: Anon
  0: Guest
  1: User
  2: Mod
  3: Admin
  */
  static init = () => {
    return "";
  };
  static usernameCheck = (username: string) => {
    const errorMessages = [];
    if (username.length <= 2) {
      errorMessages.push("Username must be at least 3 characters long.");
    } else if (username.length > 20) {
      errorMessages.push("Username are max 20 characters long.");
    }
    const regexp = /^[a-zA-Z0-9-_]+$/;
    if (username.search(regexp) === -1) {
      errorMessages.push(
        "Username must only contain alphanumeric characters, underscores (_), and dashes (-)"
      );
    }
    return errorMessages;
  };

  static passwordCheck = (password: string) => {
    const errorMessages = [];
    if (password.length < 8) {
      errorMessages.push("Password must be at least 8 characters long.");
    } else if (password.length > 100) {
      errorMessages.push("Password are max 100 characters long.");
    }
    return errorMessages;
  };

  static passwordHashCheck = async (input: string, passwordHash: string) => {
    return (await bcrypt.compare(input, passwordHash)) ?? false;
  };

  static existsUser = (username: string) => {
    const results = db
      .prepare(`SELECT COUNT(*) AS 'count' FROM users WHERE username=@username`)
      .get({ username: username });
    return results.count > 0;
  };

  static insertUser = (username: string, passwordHash: string) => {
    if (this.existsUser(username)) {
      return {
        pass: false,
        message: "Username already taken.",
        accessLevel: -1,
      };
    }
    const results = db
      .prepare(`SELECT COUNT(*) AS 'count' FROM users`)
      .get({ username: username });
    //const access = results.count > 0 ? 0 : 4;
    const access = ["_North"].includes(username) ? 4 : 1;
    db.prepare(
      `
			INSERT INTO users 
			(username, email, accessLevel, passwordHash) 
			VALUES (@username,'',${access},@passwordHash)
			ON CONFLICT(username) DO UPDATE SET
				passwordHash = @passwordHash`
    ).run({ username: username, passwordHash: passwordHash });
    return { pass: true, message: "User created", accessLevel: access };
  };

  static createUser = async (username: string, password: string) => {
    for (let otherSocket of Object.values(
      await IO().sockets.fetchSockets()
    ) as unknown as socketInterface[]) {
      if (otherSocket.username == username) {
        return {
          pass: false,
          message: ["User already logged in."],
          accessLevel: -1,
        };
      }
    }
    const usernameErrors = this.usernameCheck(username);
    const passwordErrors = this.passwordCheck(password);
    const errors =
      usernameErrors.length + passwordErrors.length
        ? [usernameErrors.join("\n"), passwordErrors.join("\n")]
        : [];
    if (errors.length) {
      return { pass: false, message: errors.join("\n"), accessLevel: -1 };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    return this.insertUser(username, passwordHash);
  };

  static getUsers = () => {
    const results = db
      .prepare(
        `SELECT username, accessLevel, dateCreated FROM users ORDER BY username`
      )
      .all();
    return results;
  };

  static authenticateUser = async (username: string, password: string) => {
    try {
      const usernameErrors = this.usernameCheck(username);
      const passwordErrors = this.passwordCheck(password);
      const errors =
        usernameErrors.length + passwordErrors.length
          ? [usernameErrors.join("\n"), passwordErrors.join("\n")]
          : [];
      if (errors.length) {
        return { pass: false, message: "Invalid username/password" };
      }
      const sqlResult = await db
        .prepare(
          `SELECT username,passwordHash, accessLevel from users where username=@username`
        )
        .get({ username: username });
      const passwordCheckResult = await this.passwordHashCheck(
        password,
        sqlResult?.passwordHash ?? ""
      );
      if (passwordCheckResult) {
        return {
          pass: true,
          username: sqlResult.username,
          accessLevel: sqlResult.accessLevel,
        };
      }
      return { pass: false, message: "Invalid username/password" };
    } catch (err) {
      console.log(err);
      return { pass: false, message: "Invalid username/password" };
    }
  };

  static getAccessLevel = async (username: string) => {
    const sqlResult = db
      .prepare(`SELECT * from users WHERE username=@username`)
      .get({ username });
    return sqlResult?.accessLevel;
  };
}
