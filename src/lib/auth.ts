import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema";
// import { createDb } from "./db";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Variables } from "./types";

import { env } from "cloudflare:workers";

// export const createAuth = async (db: PostgresJsDatabase<typeof schema>) => {
//   return betterAuth({
//     database: drizzleAdapter(db, {
//       provider: "pg",
//     }),
//     user: {
//       changeEmail: {
//         enabled: true,
//       },
//       modelName: "userTable",
//     },
//     emailAndPassword: {
//       enabled: true,
//       requireEmailVerification: false,
//       async afterSignUp(user, request) {
//         // Don't send welcome email here - will be sent after profile completion
//         console.log(
//           `📧 [AUTH-SIGNUP] User signed up: ${user.email} - Welcome email will be sent after profile completion`
//         );
//       },
//     },
//     advanced: {
//       defaultCookieAttributes: {
//         sameSite: "none",
//         secure: true,
//       },
//     },
//     trustedOrigins: [], // Allow any origin
//   });
// };

// export const createAuth = async (db: PostgresJsDatabase<typeof schema>) => {
//   return betterAuth({
//     database: drizzleAdapter(db, {
//       provider: "pg",
//     }),
//     user: {
//       changeEmail: {
//         enabled: true,
//       },
//       modelName: "userTable",
//     },
//     emailAndPassword: {
//       enabled: true,
//       requireEmailVerification: false,
//       async afterSignUp(user, request) {
//         // Don't send welcome email here - will be sent after profile completion
//         console.log(
//           `📧 [AUTH-SIGNUP] User signed up: ${user.email} - Welcome email will be sent after profile completion`
//         );
//       },
//     },
//     advanced: {
//       defaultCookieAttributes: {
//         sameSite: "none",
//         secure: true,
//       },
//     },
//     trustedOrigins: [], // Allow any origin
//   });
// };

export const auth = betterAuth({
  database: drizzleAdapter("db", {
    provider: "pg",
  }),
  user: {
    changeEmail: {
      enabled: true,
    },
    modelName: "userTable",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async afterSignUp(user, request) {
      // Don't send welcome email here - will be sent after profile completion
      console.log(
        `📧 [AUTH-SIGNUP] User signed up: ${user.email} - Welcome email will be sent after profile completion`
      );
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  trustedOrigins: [], // Allow any origin
});
