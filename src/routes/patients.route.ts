import { factory } from "../lib/factory";
import { patients, appointments } from "../lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
  patientIdParamSchema,
} from "../lib/validations/patients.validation";

const patientRoute = factory
  .createApp()
  // Get all patients (admin functionality)
  .get("/", zValidator("query", getPatientsQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");

      const limit = query.limit || 50;
      const offset = query.page ? (query.page - 1) * limit : 0;

      const patientList = await db
        .select()
        .from(patients)
        .orderBy(desc(patients.createdAt))
        .limit(limit)
        .offset(offset);

      return c.json({ success: true, data: patientList });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  // Create new patient
  .post("/", zValidator("json", createPatientSchema), async (c) => {
    try {
      const db = c.get("db");
      const body = c.req.valid("json");

      const newPatient = await db
        .insert(patients)
        .values(body)
        .returning();

      return c.json({ success: true, data: newPatient[0] }, 201);
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  // Get patient dashboard data (for logged-in patient)
  .get("/dashboard", async (c) => {
    try {
      const db = c.get("db");
      // In a real app, you'd get the patient ID from the authenticated user
      // For now, we'll assume it's passed as a query param or from auth
      const patientId = c.req.query("patientId");

      if (!patientId) {
        return c.json({ success: false, error: "Patient ID required" }, 400);
      }

      // Get patient profile
      const patient = await db
        .select()
        .from(patients)
        .where(eq(patients.id, parseInt(patientId)))
        .limit(1);

      if (patient.length === 0) {
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      // Get patient's appointments
      const patientAppointments = await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, parseInt(patientId)))
        .orderBy(desc(appointments.scheduledDate));

      // Format data for frontend (matching HealPro structure)
      const dashboardData = {
        userProfile: {
          name: patient[0].fullName,
          email: patient[0].email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient[0].fullName)}&background=random`,
          stats: {
            past: patientAppointments.filter(apt => apt.status === 'completed').length,
            upcoming: patientAppointments.filter(apt => ['pending', 'confirmed', 'waiting'].includes(apt.status)).length
          }
        },
        personalDetails: [
          { label: "Full Name", value: patient[0].fullName },
          { label: "Date of Birth", value: patient[0].dateOfBirth?.toISOString().split('T')[0] || "Not provided" },
          { label: "Gender", value: patient[0].gender || "Not provided" },
          { label: "Phone Number", value: patient[0].phoneNumber },
          { label: "Occupation", value: patient[0].occupation || "Not provided" },
          { label: "Address", value: patient[0].address || "Not provided" }
        ],
        contactDetails: [
          { label: "Emergency Contact", value: patient[0].emergencyContactName || "Not provided" },
          { label: "Emergency Phone", value: patient[0].emergencyPhone || "Not provided" },
          { label: "Primary Care Physician", value: patient[0].primaryCarePhysician },
          { label: "Insurance Provider", value: patient[0].insuranceProvider },
          { label: "Policy Number", value: patient[0].insurancePolicyNumber }
        ],
        appointments: patientAppointments.map(apt => ({
          date: apt.scheduledDate.toISOString().split('T')[0],
          time: apt.scheduledTime,
          facility: "General Hospital Lagos", // This would come from hospital table
          unit: apt.unit,
          type: apt.appointmentType,
          coverage: apt.coveragePercentage || 0,
          claimStatus: apt.status === 'completed' ? 'Approved' : 'In-Review'
        })),
        hospitalInfo: {
          name: "General Hospital Lagos",
          address: "Victoria Island, Lagos State",
          phone: "+234 123 456 7890",
          email: "info@generalhospitallagos.ng"
        },
        serviceTimeline: [
          {
            title: "Check lab",
            date: "23 Nov 2024 • 5:23 PM",
            details: "Blood test, urine analysis, cholesterol screening",
            status: "completed"
          },
          {
            title: "Control of lab results",
            date: "18 Nov 2024 • 5:23 PM",
            details: "Review blood work, discuss findings with physician",
            status: "pending"
          }
        ]
      };

      return c.json({ success: true, data: dashboardData });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  // Get specific patient by ID
  .get("/:id", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      const patient = await db
        .select()
        .from(patients)
        .where(eq(patients.id, id));

      if (patient.length === 0) {
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      return c.json({ success: true, data: patient[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  // Update patient
  .put("/:id", zValidator("param", patientIdParamSchema), zValidator("json", updatePatientSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      const updatedPatient = await db
        .update(patients)
        .set(body)
        .where(eq(patients.id, id))
        .returning();

      if (updatedPatient.length === 0) {
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      return c.json({ success: true, data: updatedPatient[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  // Delete patient
  .delete("/:id", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      const deletedPatient = await db
        .delete(patients)
        .where(eq(patients.id, id))
        .returning();

      if (deletedPatient.length === 0) {
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      return c.json({ success: true, data: deletedPatient[0] });
  // Get patient appointment statistics
  .get("/:id/stats", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      const patientAppointments = await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, id));

      const stats = {
        total: patientAppointments.length,
        completed: patientAppointments.filter(apt => apt.status === 'completed').length,
        upcoming: patientAppointments.filter(apt => ['pending', 'confirmed', 'waiting'].includes(apt.status)).length,
        cancelled: patientAppointments.filter(apt => apt.status === 'cancelled').length,
        noShow: patientAppointments.filter(apt => apt.status === 'no-show').length
      };

      return c.json({ success: true, data: stats });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  // Get patient medical history/timeline
  .get("/:id/history", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      // Get completed appointments with clinical encounters
      const patientAppointments = await db
        .select()
        .from(appointments)
        .where(and(
          eq(appointments.patientId, id),
          eq(appointments.status, 'completed')
        ))
        .orderBy(desc(appointments.completedAt));

      // For now, return appointment-based history
      // In a full implementation, this would include clinical encounters
      const history = patientAppointments.map(apt => ({
        id: apt.id,
        type: apt.appointmentType,
        date: apt.completedAt?.toISOString().split('T')[0] || apt.scheduledDate.toISOString().split('T')[0],
        time: apt.scheduledTime,
        facility: "General Hospital Lagos", // Would come from hospital table
        unit: apt.unit,
        reason: apt.reason,
        status: 'completed'
      }));

      return c.json({ success: true, data: history });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });

export default patientRoute;
