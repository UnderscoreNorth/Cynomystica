import { db } from "../sqliteDB";
export default class {
  static tableName = "userSettings";
  static tableCreate = `CREATE TABLE 'userSettings' (
    'username' VARCHAR(20) NOT NULL,
    'useragent' VARCHAR(500) NOT NULL,
    'chatPosition' VARCHAR(10),
    'videoDisplay' INT,
    'danmakuDisplay' VARCHAR(10),
    'chatWidth' INT,
    'syncThreshold' INT,    
    'selectedIcon' VARCHAR(200),
    'dateModified' DATETIME(20) DEFAULT (DATETIME('now')),
    PRIMARY KEY ('username','useragent')
);`;
  static init = () => {
    return "";
  };
  static get = async (username: string, useragent: string) => {
    let e = await db
      .prepare(
        `SELECT * FROM userSettings WHERE username=@username AND useragent=@useragent`
      )
      .get({ username, useragent });
    if (e) {
      return {
        sync: {
          threshold: e.syncThreshold,
        },
        display: {
          danmaku: e.danmakuDisplay,
          chat: e.chatPosition,
          video: e.videoDisplay,
        },
        chat: {
          chatWidth: e.chatWidth,
        },
        icon: e.selectedIcon,
        users: [],
      };
    } else {
      return null;
    }
  };
  static upsert = async (username: string, useragent: string, obj: any) => {
    let send: any = {};
    send.username = username;
    send.useragent = useragent;
    send.chatPosition = obj.display.chat;
    send.videoDisplay = obj.display.video ? 1 : 0;
    send.danmakuDisplay = obj.display.danmaku;
    send.chatWidth = obj.chat.chatWidth;
    send.syncThreshold = obj.sync.threshold;
    send.selectedIcon = obj.icon;
    await db
      .prepare(
        `
              INSERT INTO userSettings
              (username, useragent,chatPosition,videoDisplay,danmakuDisplay,chatWidth,syncThreshold,selectedIcon) 
              VALUES (@username, @useragent,@chatPosition,@videoDisplay,@danmakuDisplay,@chatWidth,@syncThreshold,@selectedIcon)
              ON CONFLICT(username,useragent) DO UPDATE SET
                chatPosition=@chatPosition,
                videoDisplay=@videoDisplay,
                danmakuDisplay=@danmakuDisplay,
                chatWidth=@chatWidth,
                syncThreshold=@syncThreshold,
                selectedIcon=@selectedIcon,
                dateModified = DATETIME('now')`
      )
      .run(send);
  };
}
