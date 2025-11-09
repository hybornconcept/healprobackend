import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { timestamps } from "./utils.schema";
import { patients } from "./patients.schema";
import { hospitals } from "./hospital.schema";

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),

  // Patient reference
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),

  // Facility reference
  hospitalId: integer("hospital_id")
    .notNull()
    .references(() => hospitals.id, { onDelete: "cascade" }),

  // Appointment details
  appointmentType: varchar("appointment_type", { length: 50 }).notNull(), // 'consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist-referral'
  unit: varchar("unit", { length: 100 }).notNull(), // 'Cardiology', 'Pediatrics', 'Dermatology', etc.
  reason: text("reason").notNull(), // Chief complaint or reason for visit
  additionalNotes: text("additional_notes"), // Additional comments/notes

  // Scheduling
  scheduledDate: timestamp("scheduled_date", { mode: "date" }).notNull(),
  scheduledTime: varchar("scheduled_time", { length: 20 }).notNull(), // '10:00 AM', '14:30 PM', etc.
  duration: integer("duration").default(30), // Duration in minutes

  // Status and priority
  status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'confirmed', 'waiting', 'in-progress', 'completed', 'cancelled', 'no-show'
  priority: varchar("priority", { length: 20 }).default("normal"), // 'low', 'normal', 'high', 'urgent'

  // Insurance/HMO details
  hmoPlan: varchar("hmo_plan", { length: 50 }), // 'Gold', 'Silver', 'Platinum'
  coveragePercentage: integer("coverage_percentage"), // 0-100
  estimatedCost: integer("estimated_cost"), // In Naira (smallest unit)

  // Assigned healthcare provider (optional)
  assignedProvider: varchar("assigned_provider", { length: 200 }), // Doctor/Physician name
  providerSpecialty: varchar("provider_specialty", { length: 100 }),

  // Check-in and completion
  checkInTime: timestamp("check_in_time"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),

  // Follow-up
  requiresFollowUp: boolean("requires_follow_up").default(false),
  followUpDate: timestamp("follow_up_date", { mode: "date" }),
  followUpNotes: text("follow_up_notes"),

  // Metadata
  metadata: text("metadata").default("{}"),

  ...timestamps,
});
export const clinicalEncounters = pgTable("clinical_encounters", {
  id: serial("id").primaryKey(),

  // Link to appointment
  appointmentId: integer("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),

  // Encounter details
  encounterDate: timestamp("encounter_date").notNull(),
  encounterTime: varchar("encounter_time", { length: 20 }).notNull(),

  // Vital signs
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  heartRate: integer("heart_rate"),
  temperature: integer("temperature"), // Temperature in Celsius * 100
  respiratoryRate: integer("respiratory_rate"),
  oxygenSaturation: integer("oxygen_saturation"),
  weight: integer("weight"), // In grams
  height: integer("height"), // In cm
  bmi: integer("bmi"), // BMI * 100

  // Assessment
  chiefComplaint: text("chief_complaint").notNull(),
  historyOfPresentIllness: text("history_of_present_illness"),
  pastMedicalHistory: text("past_medical_history"),
  medications: text("medications"),
  allergies: text("allergies"),
  familyHistory: text("family_history"),

  // Physical examination findings
  physicalExamination: text("physical_examination"),

  // Diagnosis and treatment
  primaryDiagnosis: text("primary_diagnosis"),
  secondaryDiagnoses: text("secondary_diagnoses"), // JSON array
  treatmentPlan: text("treatment_plan"),
  prescriptions: text("prescriptions"), // JSON array
  procedures: text("procedures"), // JSON array

  // Follow-up and referrals
  followUpInstructions: text("follow_up_instructions"),
  referralTo: varchar("referral_to", { length: 200 }),
  referralReason: text("referral_reason"),

  // Provider information
  providerName: varchar("provider_name", { length: 200 }).notNull(),
  providerSpecialty: varchar("provider_specialty", { length: 100 }),
  providerLicense: varchar("provider_license", { length: 50 }),

  // Metadata
  metadata: text("metadata").default("{}"),

  ...timestamps,
});
