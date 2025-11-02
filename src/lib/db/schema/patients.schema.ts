import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { timestamps } from "./utils.schema";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),

  // Personal information (TS: camelCase, SQL: snake_case) - REQUIRED
  fullName: varchar("full_name", { length: 200 }),
  phoneNumber: varchar("phone_number", { length: 32 }),
  email: varchar("email", { length: 255 }),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  gender: varchar("gender", { length: 16 }),
  occupation: varchar("occupation", { length: 128 }),
  address: text("address"),
  emergencyContactName: varchar("emergency_contact_name", { length: 200 }),
  emergencyPhone: varchar("emergency_phone", { length: 32 }),

  // Medical information - notNull
  primaryCarePhysician: varchar("primary_care_physician", {
    length: 200,
  }).notNull(),
  insuranceProvider: varchar("insurance_provider", { length: 200 }).notNull(),
  insurancePolicyNumber: varchar("insurance_policy_number", {
    length: 100,
  }).notNull(),
  allergies: text("allergies").notNull(),
  currentMedications: text("current_medications").notNull(),
  familyMedicalHistory: text("family_medical_history").notNull(),
  pastMedicalHistory: text("past_medical_history").notNull(),

  // Identification / verification - REQUIRED
  identificationType: varchar("identification_type", { length: 64 }),
  identificationNumber: varchar("identification_number", { length: 128 }),
  idDocumentUrl: text("id_document_url"),

  // Consent (kept default false)
  consentReceiveTreatment: boolean("consent_receive_treatment").$default(false),
  consentUseDisclosure: boolean("consent_use_disclosure").$default(false),
  consentPrivacyPolicy: boolean("consent_privacy_policy").$default(false),

  // Free-form metadata (stored as JSON string)
  metadata: text("metadata").$default("{}"),

  // created_at / updated_at from utils.schema.ts (TS: createdAt/updatedAt -> SQL: created_at/updated_at)
  ...timestamps,
});

export type Patient = InferModel<typeof patients>;
export type NewPatient = InferModel<typeof patients, "insert">;
