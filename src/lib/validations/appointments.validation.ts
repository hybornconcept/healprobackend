import { z } from "zod";

// Appointment creation schema
export const createAppointmentSchema = z.object({
  patientId: z.number().int().positive("Patient ID is required"),
  hospitalId: z.number().int().positive("Hospital ID is required"),
  appointmentType: z.enum([
    "consultation",
    "follow-up",
    "emergency",
    "routine-checkup",
    "specialist-referral",
  ]),
  unit: z.string().min(1, "Unit/Specialty is required"),
  reason: z.string().min(1, "Reason for appointment is required"),
  additionalNotes: z.string().optional(),
  scheduledDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  scheduledTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/i, {
      message: "Time must be in format HH:MM AM/PM",
    }),
  duration: z.number().int().min(15).max(480).default(30), // 15 min to 8 hours
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  hmoPlan: z.enum(["Gold", "Silver", "Platinum"]).optional(),
  coveragePercentage: z.number().int().min(0).max(100).optional(),
  estimatedCost: z.number().int().min(0).optional(),
  assignedProvider: z.string().optional(),
  providerSpecialty: z.string().optional(),
  requiresFollowUp: z.boolean().default(false),
  followUpDate: z.string().optional(),
  followUpNotes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Appointment update schema
export const updateAppointmentSchema = z.object({
  appointmentType: z
    .enum([
      "consultation",
      "follow-up",
      "emergency",
      "routine-checkup",
      "specialist-referral",
    ])
    .optional(),
  unit: z.string().min(1).optional(),
  reason: z.string().min(1).optional(),
  additionalNotes: z.string().optional(),
  scheduledDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  scheduledTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/i, {
      message: "Time must be in format HH:MM AM/PM",
    })
    .optional(),
  duration: z.number().int().min(15).max(480).optional(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "waiting",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
    ])
    .optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  hmoPlan: z.enum(["Gold", "Silver", "Platinum"]).optional(),
  coveragePercentage: z.number().int().min(0).max(100).optional(),
  estimatedCost: z.number().int().min(0).optional(),
  assignedProvider: z.string().optional(),
  providerSpecialty: z.string().optional(),
  cancellationReason: z.string().optional(),
  requiresFollowUp: z.boolean().optional(),
  followUpDate: z.string().optional(),
  followUpNotes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Status update schema (for facilities to update appointment status)
export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "waiting",
    "in-progress",
    "completed",
    "cancelled",
    "no-show",
  ]),
  cancellationReason: z.string().optional(),
});

// Clinical encounter creation schema
export const createClinicalEncounterSchema = z.object({
  appointmentId: z.number().int().positive("Appointment ID is required"),
  encounterDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  encounterTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/i, {
      message: "Time must be in format HH:MM AM/PM",
    }),

  // Vital signs
  bloodPressureSystolic: z.number().int().min(60).max(250).optional(),
  bloodPressureDiastolic: z.number().int().min(40).max(150).optional(),
  heartRate: z.number().int().min(40).max(200).optional(),
  temperature: z.number().int().min(3500).max(4200).optional(), // Celsius * 100
  respiratoryRate: z.number().int().min(8).max(60).optional(),
  oxygenSaturation: z.number().int().min(70).max(100).optional(),
  weight: z.number().int().min(1000).max(300000).optional(), // grams
  height: z.number().int().min(30).max(250).optional(), // cm
  bmi: z.number().int().min(1000).max(6000).optional(), // BMI * 100

  // Assessment
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  historyOfPresentIllness: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  familyHistory: z.string().optional(),

  // Physical examination
  physicalExamination: z.string().optional(),

  // Diagnosis and treatment
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()).optional(),
  treatmentPlan: z.string().optional(),
  prescriptions: z
    .array(
      z.object({
        medication: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string(),
      })
    )
    .optional(),
  procedures: z.array(z.string()).optional(),

  // Follow-up and referrals
  followUpInstructions: z.string().optional(),
  referralTo: z.string().optional(),
  referralReason: z.string().optional(),

  // Provider information
  providerName: z.string().min(1, "Provider name is required"),
  providerSpecialty: z.string().optional(),
  providerLicense: z.string().optional(),

  metadata: z.record(z.any()).optional(),
});

// Query schemas for GET requests
export const getAppointmentsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "waiting",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
    ])
    .optional(),
  patientId: z.string().transform(Number).optional(),
  hospitalId: z.string().transform(Number).optional(),
  date: z.string().optional(), // YYYY-MM-DD format
  unit: z.string().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
});

// Params schema for ID-based routes
export const appointmentIdParamSchema = z.object({
  id: z.string().transform(Number),
});

// Clinical encounter params
export const clinicalEncounterIdParamSchema = z.object({
  id: z.string().transform(Number),
});
