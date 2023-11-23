export default class {
  static tableName = "userSettings";
  static tableCreate = `CREATE TABLE 'userSettings' (
    'username' VARCHAR(20) NOT NULL,
    'useragent' VARCHAR(200) NOT NULL,
    'dateCreated' DATETIME(20) DEFAULT (DATETIME('now')),
    'syncThreshold' INT,    
    PRIMARY KEY ('username','useragent')
);`;
  static init = () => {
    return "";
  };
}
