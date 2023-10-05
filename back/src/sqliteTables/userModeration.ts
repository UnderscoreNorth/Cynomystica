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
}
