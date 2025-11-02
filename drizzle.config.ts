import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config();

export default defineConfig({
  schema: "./src/lib/db/schema",
  dbCredentials: {
    url: env.PROD_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  dialect: "postgresql",
  out: "./drizzle/migrations",
  casing: "snake_case",
});
