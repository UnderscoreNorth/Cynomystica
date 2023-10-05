export default class {
  static tableName = "queue";
  static tableCreate = `CREATE TABLE 'queue' (
    'username' VARCHAR(20) NOT NULL,
    'title' VARCHAR(512) NOT NULL,
    'url' VARCHAR(512),
    'dateCreated' DATETIME(20) DEFAULT (DATETIME('now'))
);`;
  static init = () => {
    return "";
  };
}
