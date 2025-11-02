import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { env } from "node:process";
dotenv.config();
export default defineConfig({
  schema: "./src/lib/db/schema",
  verbose: true,
  strict: false,
  dialect: "postgresql",
  out: "./drizzle/migrations",
  breakpoints: true,
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
