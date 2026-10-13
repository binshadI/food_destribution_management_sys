import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=").map((part) => part.trim())),
);

const password = process.argv[2] ?? "password123";
const hash = await bcrypt.hash(password, 10);

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

const [result] = await conn.query("UPDATE users SET password_hash = ?", [hash]);
console.log(`Updated ${result.affectedRows} users with password "${password}"`);
await conn.end();
