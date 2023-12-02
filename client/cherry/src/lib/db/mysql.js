import mysql from "mysql2/promise";

let mysqlconn = null;

export function mysqlconnFn() {
  if (!mysqlconn) {
    mysqlconn = mysql.createConnection({
      host: "db",
      user: "admin",
      password: "toor",
      database: "project",
    });
  }

  return mysqlconn;
}