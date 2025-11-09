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

export const hmos = pgTable("hmos", {
  id: serial("id").primaryKey(),

  // Organization ID from auth schema
  organizationId: varchar("organization_id", { length: 255 })
    .notNull()
    .unique(),

  // Company information
  companyName: varchar("company_name", { length: 200 }).notNull(),
  registrationNumber: varchar("registration_number", { length: 100 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }),
  yearEstablished: integer("year_established"),

  // Address
  headquartersAddress: text("headquarters_address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("Nigeria"),

  // Contact information
  primaryPhone: varchar("primary_phone", { length: 32 }),
  customerServicePhone: varchar("customer_service_phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),

  // Representative
  representativeName: varchar("representative_name", { length: 200 }),
  representativePosition: varchar("representative_position", { length: 100 }),
  representativePhone: varchar("representative_phone", { length: 32 }),
  representativeEmail: varchar("representative_email", { length: 255 }),

  // Coverage
  statesCovered: text("states_covered"), // JSON array of states
  memberCount: integer("member_count"),
  networkSize: integer("network_size"),
  planTypes: text("plan_types"), // JSON array: ['hmo', 'ppo', etc.]

  // Financials
  annualRevenue: varchar("annual_revenue", { length: 50 }),
  claimsProcessed: integer("claims_processed"),
  averageProcessingTime: varchar("average_processing_time", { length: 50 }),

  // Partnerships
  hospitalPartners: text("hospital_partners"), // JSON array
  pharmacyPartners: text("pharmacy_partners"), // JSON array
  laboratoryPartners: text("laboratory_partners"), // JSON array
  specialistPartners: text("specialist_partners"), // JSON array

  // Consents
  consentTerms: boolean("consent_terms").default(false),
  consentDataSharing: boolean("consent_data_sharing").default(false),
  consentVerification: boolean("consent_verification").default(false),

  // Metadata
  metadata: text("metadata").default("{}"),

  ...timestamps,
});

export type HMO = InferModel<typeof hmos>;
export type NewHMO = InferModel<typeof hmos, "insert">;
