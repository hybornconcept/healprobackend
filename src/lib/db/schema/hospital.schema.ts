import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { timestamps } from "./utils.schema";

export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),

  // Organization ID from auth schema
  organizationId: varchar("organization_id", { length: 255 })
    .notNull()
    .unique(),

  // Facility information
  facilityName: varchar("facility_name", { length: 200 }).notNull(),
  licenseNumber: varchar("license_number", { length: 100 }).notNull(),
  facilityType: varchar("facility_type", { length: 50 }), // 'hospital', 'clinic', etc.
  taxId: varchar("tax_id", { length: 50 }),
  yearEstablished: integer("year_established"),

  // Address
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("Nigeria"),

  // Contact information
  primaryPhone: varchar("primary_phone", { length: 32 }),
  alternatePhone: varchar("alternate_phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),

  // Representative
  representativeName: varchar("representative_name", { length: 200 }),
  representativePosition: varchar("representative_position", { length: 100 }),
  representativePhone: varchar("representative_phone", { length: 32 }),
  representativeEmail: varchar("representative_email", { length: 255 }),

  // Facility details
  specialties: text("specialties"), // JSON array
  bedCount: integer("bed_count"),
  staffCount: integer("staff_count"),
  acceptedInsurance: text("accepted_insurance"), // JSON array
  certifications: text("certifications"), // JSON array
  servicesOffered: text("services_offered"), // JSON array: ['emergency_care', 'inpatient_care', etc.]

  // Consents
  consentTerms: boolean("consent_terms").default(false),
  consentDataSharing: boolean("consent_data_sharing").default(false),
  consentVerification: boolean("consent_verification").default(false),

  // Metadata
  metadata: text("metadata").default("{}"),

  ...timestamps,
});

export type Hospital = InferModel<typeof hospitals>;
export type NewHospital = InferModel<typeof hospitals, "insert">;
