import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

export const pool =
  globalForDb.pool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

type QueryParams = Parameters<typeof pool.execute>[1];

export async function query<T = unknown>(sql: string, params: QueryParams = []) {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}