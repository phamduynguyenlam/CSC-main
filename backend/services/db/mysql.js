import dotenv from 'dotenv';

dotenv.config();

let pool;
let mysqlModulePromise;

function getDbConfig() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'customer_care_db',
  };
}

export function isDbConfigured() {
  const config = getDbConfig();
  return Boolean(config.host && config.user && config.database);
}

async function loadMysqlModule() {
  if (!mysqlModulePromise) {
    mysqlModulePromise = import('mysql2/promise').catch(() => null);
  }

  return mysqlModulePromise;
}

export async function getPool() {
  if (pool) {
    return pool;
  }

  if (!isDbConfigured()) {
    throw new Error('Database connection is not configured. Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.');
  }

  const mysql = await loadMysqlModule();
  if (!mysql) {
    throw new Error('Missing mysql2 dependency. Run npm install in backend after adding mysql2.');
  }

  const config = getDbConfig();
  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function query(sql, params = []) {
  const activePool = await getPool();
  const [rows] = await activePool.execute(sql, params);
  return rows;
}

export default {
  getPool,
  isDbConfigured,
  query,
};
