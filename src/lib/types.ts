import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type Variables = {
  db: PostgresJsDatabase<typeof schema>;
  user: TUser | null;
  session: TSession | null;

  userId: string;
};
