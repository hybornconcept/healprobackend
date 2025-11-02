import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "cloudflare:workers";
export const createDb = (connectionString: string) => {
  const sql = postgres(connectionString);
  return drizzle({ schema, casing: "snake_case", client: sql });
};
