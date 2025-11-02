import { createFactory } from "hono/factory";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { Variables } from "./types";
import * as schema from "./db";
import { createAuth } from "./auth";
import { env } from "cloudflare:workers";

// Our factory with environment and variables types
export const factory = createFactory<{
  Variables: Variables;
}>({
  initApp: (app) => {
    // Global middleware for database
    app.use(async (c, next) => {
      const client = postgres(env.HYPERDRIVE.connectionString, {
        max: 5,
      });

      const db = drizzle({ schema, casing: "snake_case", client });
      c.set("db", db);

      const auth = await createAuth(db);

      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
      }

      c.set("user", session.user);
      c.set("session", session.session);
      return next();
    });

    // Global error handler
    // app.onError((err, c) => {
    //   console.error(Error occurred:, err);
    //   return c.json({ success: false, message: "Internal server error, check your console" }, 500);
    // });
  },
});
