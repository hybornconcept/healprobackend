CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"hospital_id" integer NOT NULL,
	"appointment_type" varchar(50) NOT NULL,
	"unit" varchar(100) NOT NULL,
	"reason" text NOT NULL,
	"additional_notes" text,
	"scheduled_date" timestamp NOT NULL,
	"scheduled_time" varchar(20) NOT NULL,
	"duration" integer DEFAULT 30,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"priority" varchar(20) DEFAULT 'normal',
	"hmo_plan" varchar(50),
	"coverage_percentage" integer,
	"estimated_cost" integer,
	"assigned_provider" varchar(200),
	"provider_specialty" varchar(100),
	"check_in_time" timestamp,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"requires_follow_up" boolean DEFAULT false,
	"follow_up_date" timestamp,
	"follow_up_notes" text,
	"metadata" text DEFAULT '{}',
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "clinical_encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"encounter_date" timestamp NOT NULL,
	"encounter_time" varchar(20) NOT NULL,
	"blood_pressure_systolic" integer,
	"blood_pressure_diastolic" integer,
	"heart_rate" integer,
	"temperature" integer,
	"respiratory_rate" integer,
	"oxygen_saturation" integer,
	"weight" integer,
	"height" integer,
	"bmi" integer,
	"chief_complaint" text NOT NULL,
	"history_of_present_illness" text,
	"past_medical_history" text,
	"medications" text,
	"allergies" text,
	"family_history" text,
	"physical_examination" text,
	"primary_diagnosis" text,
	"secondary_diagnoses" text,
	"treatment_plan" text,
	"prescriptions" text,
	"procedures" text,
	"follow_up_instructions" text,
	"referral_to" varchar(200),
	"referral_reason" text,
	"provider_name" varchar(200) NOT NULL,
	"provider_specialty" varchar(100),
	"provider_license" varchar(50),
	"metadata" text DEFAULT '{}',
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	"type" text NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"phone_number" text,
	"phone_number_verified" boolean,
	"user_type" text DEFAULT 'patient',
	CONSTRAINT "user_table_email_unique" UNIQUE("email"),
	CONSTRAINT "user_table_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hmos" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"company_name" varchar(200) NOT NULL,
	"registration_number" varchar(100) NOT NULL,
	"tax_id" varchar(50),
	"year_established" integer,
	"headquarters_address" text,
	"city" varchar(100),
	"state" varchar(100),
	"zip_code" varchar(20),
	"country" varchar(100) DEFAULT 'Nigeria',
	"primary_phone" varchar(32),
	"customer_service_phone" varchar(32),
	"email" varchar(255),
	"website" varchar(255),
	"representative_name" varchar(200),
	"representative_position" varchar(100),
	"representative_phone" varchar(32),
	"representative_email" varchar(255),
	"states_covered" text,
	"member_count" integer,
	"network_size" integer,
	"plan_types" text,
	"annual_revenue" varchar(50),
	"claims_processed" integer,
	"average_processing_time" varchar(50),
	"hospital_partners" text,
	"pharmacy_partners" text,
	"laboratory_partners" text,
	"specialist_partners" text,
	"consent_terms" boolean DEFAULT false,
	"consent_data_sharing" boolean DEFAULT false,
	"consent_verification" boolean DEFAULT false,
	"metadata" text DEFAULT '{}',
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "hmos_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "hospitals" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"facility_name" varchar(200) NOT NULL,
	"license_number" varchar(100) NOT NULL,
	"facility_type" varchar(50),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"zip_code" varchar(20),
	"country" varchar(100) DEFAULT 'Nigeria',
	"primary_phone" varchar(32),
	"email" varchar(255),
	"website" varchar(255),
	"representative_name" varchar(200),
	"representative_position" varchar(100),
	"representative_phone" varchar(32),
	"representative_email" varchar(255),
	"specialties" text,
	"bed_count" integer,
	"staff_count" integer,
	"accepted_insurance" text,
	"certifications" text,
	"consent_terms" boolean DEFAULT false,
	"consent_data_sharing" boolean DEFAULT false,
	"consent_verification" boolean DEFAULT false,
	"metadata" text DEFAULT '{}',
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "hospitals_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(200),
	"phone_number" varchar(32),
	"email" varchar(255),
	"date_of_birth" timestamp,
	"gender" varchar(16),
	"occupation" varchar(128),
	"address" text,
	"emergency_contact_name" varchar(200),
	"emergency_phone" varchar(32),
	"primary_care_physician" varchar(200) NOT NULL,
	"insurance_provider" varchar(200) NOT NULL,
	"insurance_policy_number" varchar(100) NOT NULL,
	"allergies" text NOT NULL,
	"current_medications" text NOT NULL,
	"family_medical_history" text NOT NULL,
	"past_medical_history" text NOT NULL,
	"identification_type" varchar(64),
	"identification_number" varchar(128),
	"id_document_url" text,
	"consent_receive_treatment" boolean,
	"consent_use_disclosure" boolean,
	"consent_privacy_policy" boolean,
	"metadata" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_encounters" ADD CONSTRAINT "clinical_encounters_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_table_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;