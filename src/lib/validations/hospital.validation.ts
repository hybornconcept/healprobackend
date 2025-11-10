import { z } from "zod";

// Hospital creation schema
export const createHospitalSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  facilityName: z.string().min(1, "Facility name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  facilityType: z.string().optional(),
  taxId: z.string().optional(),
  yearEstablished: z.number().int().positive().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("Nigeria"),
  primaryPhone: z.string().optional(),
  alternatePhone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  representativeName: z.string().optional(),
  representativePosition: z.string().optional(),
  representativePhone: z.string().optional(),
  representativeEmail: z.string().email().optional(),
  specialties: z.array(z.string()).optional(),
  bedCount: z.number().int().positive().optional(),
  staffCount: z.number().int().positive().optional(),
  acceptedInsurance: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  servicesOffered: z.array(z.string()).optional(),
  consentTerms: z.boolean().default(false),
  consentDataSharing: z.boolean().default(false),
  consentVerification: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

// Hospital update schema (partial)
export const updateHospitalSchema = createHospitalSchema.partial();

// Query schema for GET requests
export const getHospitalsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

// Params schema for ID-based routes
export const hospitalIdParamSchema = z.object({
  id: z.string().transform(Number),
});
