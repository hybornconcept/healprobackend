import { z } from "zod";

// Patient creation schema
export const createPatientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  primaryCarePhysician: z.string().min(1, "Primary care physician is required"),
  insuranceProvider: z.string().min(1, "Insurance provider is required"),
  insurancePolicyNumber: z
    .string()
    .min(1, "Insurance policy number is required"),
  allergies: z.string().min(1, "Allergies information is required"),
  currentMedications: z
    .string()
    .min(1, "Current medications information is required"),
  familyMedicalHistory: z.string().min(1, "Family medical history is required"),
  pastMedicalHistory: z.string().min(1, "Past medical history is required"),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  idDocumentUrl: z.string().url().optional(),
  consentReceiveTreatment: z.boolean().default(false),
  consentUseDisclosure: z.boolean().default(false),
  consentPrivacyPolicy: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

// Patient update schema (partial)
export const updatePatientSchema = createPatientSchema.partial();

// Query schema for GET requests
export const getPatientsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

// Params schema for ID-based routes
export const patientIdParamSchema = z.object({
  id: z.string().transform(Number),
});
