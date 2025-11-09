import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema";
export type TUser = typeof schema.userTable.$inferSelect;
export type Variables = {
  db: PostgresJsDatabase<typeof schema>;
  user: TUser | null;
  session: TSession | null;

  userId: string;
};
