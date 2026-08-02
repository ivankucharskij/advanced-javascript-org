import { Driver } from "@ydbjs/core";
import { query, type QueryClient } from "@ydbjs/query";

import { getEnv } from "../config/env.js";
import { selectDbHealth } from "./db.sql.js";

let dbDriver: Driver | null = null;
let dbQueryClient: QueryClient | null = null;

const localDbHosts = new Set(["localhost", "127.0.0.1", "host.docker.internal"]);

const getDbDriverOptions = (connectionString: string) => {
  const { hostname } = new URL(connectionString);

  if (localDbHosts.has(hostname)) {
    return { "ydb.sdk.enable_discovery": false } as const;
  }

  return undefined;
};

export const getDbDriver = async () => {
  if (dbDriver) {
    return dbDriver;
  }

  const connectionString = getEnv().DB_CONNECTION_STRING;
  dbDriver = new Driver(connectionString, getDbDriverOptions(connectionString));
  await dbDriver.ready();

  return dbDriver;
};

export const getDb = async () => {
  if (dbQueryClient) {
    return dbQueryClient;
  }

  dbQueryClient = query(await getDbDriver());

  return dbQueryClient;
};

export const checkDbHealth = async () => {
  const sql = await getDb();
  const row = await selectDbHealth(sql);

  if (row?.one !== 1) {
    throw new Error("Database health query returned an unexpected result");
  }
};

export const closeDb = () => {
  dbQueryClient = null;
  dbDriver?.close();
  dbDriver = null;
};
