import sql from "better-sqlite3";

export const db = new sql("sqlite.db");
db.pragma("journal_mode = WAL");

console.log("Sqlite init");
