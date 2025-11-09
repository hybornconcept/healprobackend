import { z } from "zod";

// HMO creation schema
export const createHmoSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  companyName: z.string().min(1, "Company name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  taxId: z.string().optional(),
  yearEstablished: z.number().int().positive().optional(),
  headquartersAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("Nigeria"),
  primaryPhone: z.string().optional(),
  customerServicePhone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  representativeName: z.string().optional(),
  representativePosition: z.string().optional(),
  representativePhone: z.string().optional(),
  representativeEmail: z.string().email().optional(),
  statesCovered: z.array(z.string()).optional(),
  memberCount: z.number().int().positive().optional(),
  networkSize: z.number().int().positive().optional(),
  planTypes: z.array(z.string()).optional(),
  annualRevenue: z.string().optional(),
  claimsProcessed: z.number().int().nonnegative().optional(),
  averageProcessingTime: z.string().optional(),
  hospitalPartners: z.array(z.string()).optional(),
  pharmacyPartners: z.array(z.string()).optional(),
  laboratoryPartners: z.array(z.string()).optional(),
  specialistPartners: z.array(z.string()).optional(),
  consentTerms: z.boolean().default(false),
  consentDataSharing: z.boolean().default(false),
  consentVerification: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

// HMO update schema (partial)
export const updateHmoSchema = createHmoSchema.partial();

// Query schema for GET requests
export const getHmosQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

// Params schema for ID-based routes
export const hmoIdParamSchema = z.object({
  id: z.string().transform(Number),
});
