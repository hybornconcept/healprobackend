import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema";
// import { createDb } from "./db";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Variables } from "./types";
import {
  openAPI,
  organization,
  phoneNumber,
  admin,
  bearer,
} from "better-auth/plugins";
// import { env } from "cloudflare:workers";
import { emailService } from "./services/email.service";

export const createAuth = async (db: PostgresJsDatabase<typeof schema>) => {
  return betterAuth({
    database: drizzleAdapter(db, {
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
    trustedOrigins: ["*"], // Allow any origin
    plugins: [
      organization({
        schema: {
          organization: {
            modelName: "organization",
            fields: {
              type: "type", // Add type field
            },
          },
        },
        async sendInvitationEmail(data) {
          const inviteLink = `${env.CLIENT_URL}/accept-invitation/${data.id}`;
          try {
            await emailService.sendEmail({
              to: data.email,
              subject: `Invitation to join ${data.organization.name}`,
              html: `
                <div>You have been invited to join <strong>${data.organization.name}</strong>.</div>
                <br>
                <div><a href="${inviteLink}" style="display: inline-block; background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accept Invitation</a></div>
                <br>
                <div>Invitation Link: ${inviteLink}</div>
                <div>This invitation expires in 7 days.</div>
              `,
            });
            console.log(`Invitation email sent to ${data.email}`);
          } catch (error) {
            console.error(
              `Failed to send invitation email to ${data.email}:`,
              error
            );
          }
        },
      }),
      openAPI(),
      admin({
        // Replace with the actual user ID
      }),
      phoneNumber({
        sendOTP: async ({ phoneNumber, code }, request) => {
          console.log("🚀 ~ sendOTP: ~ code:", code);
          try {
            await emailService.sendEmail({
              to: `${phoneNumber}@my-site.com`,
              subject: "Your OTP Code",
              html: `Your verification code is: ${code}`,
            });
          } catch (error) {
            console.error("Failed to send OTP via Email:", error);
            throw error;
          }
        },
        sendPasswordResetOTP: async ({ phoneNumber, code }, request) => {
          console.log("🚀 ~ sendPasswordResetOTP: ~ code:", code);
          try {
            await emailService.sendEmail({
              to: `${phoneNumber}@my-site.com`,
              subject: "Your Password Reset OTP",
              html: `Your password reset code is: ${code}`,
            });
          } catch (error) {
            console.error(
              "Failed to send password reset OTP via Email:",
              error
            );
            throw error;
          }
        },
        signUpOnVerification: {
          getTempEmail: (phoneNumber) => {
            return `${phoneNumber}@my-site.com`;
          },
          //optionally, you can also pass `getTempName` function to generate a temporary name for the user
          getTempName: (phoneNumber) => {
            return phoneNumber; //by default, it will use the phone number as the name
          },
        },
        callbackOnVerification(data, request) {
          console.log("🚀 ~ Phone verification callback:", {
            userId: data.user.id,
            phoneNumber: data.user.phoneNumber,
            email: data.user.email,
            isNewUser: data.isNewUser,
            isTemporaryEmail: data.user.email?.includes("@my-site.com"),
          });

          // Don't send welcome email here - will be sent after profile completion
          // when user provides real email during profile setup
          console.log(
            `📧 [PHONE-VERIFY] Phone verified for user: ${data.user.phoneNumber} - Welcome email will be sent after profile completion`
          );
        },
      }),

      bearer(),
    ],
  });
};

// export const auth = betterAuth({
//   database: drizzleAdapter("db", {
//     provider: "pg",
//   }),
//   user: {
//     changeEmail: {
//       enabled: true,
//     },
//     modelName: "userTable",
//   },
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false,
//     async afterSignUp(user, request) {
//       // Don't send welcome email here - will be sent after profile completion
//       console.log(
//         `📧 [AUTH-SIGNUP] User signed up: ${user.email} - Welcome email will be sent after profile completion`
//       );
//     },
//   },
//   advanced: {
//     defaultCookieAttributes: {
//       sameSite: "none",
//       secure: true,
//     },
//   },
//   trustedOrigins: [], // Allow any origin
//   plugins: [
//     organization({
//       async sendInvitationEmail(data) {
//         const inviteLink = `${"CLIENT_URL"}/accept-invitation/${data.id}`;
//       },
//     }),
//     openAPI(),
//     admin({
//       // Replace with the actual user ID
//     }),
//     phoneNumber({
//       sendOTP: async ({ phoneNumber, code }, request) => {
//         console.log("🚀 ~ sendOTP: ~ code:", code);
//       },
//       sendPasswordResetOTP: async ({ phoneNumber, code }, request) => {
//         console.log("🚀 ~ sendPasswordResetOTP: ~ code:", code);
//       },
//       signUpOnVerification: {
//         getTempEmail: (phoneNumber) => {
//           return `${phoneNumber}@my-site.com`;
//         },
//         //optionally, you can also pass `getTempName` function to generate a temporary name for the user
//         getTempName: (phoneNumber) => {
//           return phoneNumber; //by default, it will use the phone number as the name
//         },
//       },
//       callbackOnVerification(data, request) {
//         console.log("🚀 ~ Phone verification callback:", {
//           userId: data.user.id,
//           phoneNumber: data.user.phoneNumber,
//           email: data.user.email,
//           isNewUser: data.isNewUser,
//           isTemporaryEmail: data.user.email?.includes("@my-site.com"),
//         });

//         // Don't send welcome email here - will be sent after profile completion
//         // when user provides real email during profile setup
//         console.log(
//           `📧 [PHONE-VERIFY] Phone verified for user: ${data.user.phoneNumber} - Welcome email will be sent after profile completion`
//         );
//       },
//     }),

//     bearer(),
//   ],
// });
