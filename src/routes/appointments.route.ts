import { factory } from "../lib/factory";
import { appointments } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
  appointmentIdParamSchema,
} from "../lib/validations/appointments.validation";

const appointmentRoute = factory
  .createApp()
  .get("/", zValidator("query", getAppointmentsQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");
      const allAppointments = await db.select().from(appointments);
      return c.json({ success: true, data: allAppointments });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .post("/", zValidator("json", createAppointmentSchema), async (c) => {
    try {
      const db = c.get("db");
      const body = c.req.valid("json");
      const appointmentData = {
        ...body,
        scheduledDate: new Date(body.scheduledDate),
        followUpDate: body.followUpDate
          ? new Date(body.followUpDate)
          : undefined,
        metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
      };
      const newAppointment = await db
        .insert(appointments)
        .values(appointmentData)
        .returning();
      return c.json({ success: true, data: newAppointment[0] });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .get("/:id", zValidator("param", appointmentIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const appointment = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id));
      if (appointment.length === 0) {
        return c.json({ success: false, error: "Appointment not found" }, 404);
      }
      return c.json({ success: true, data: appointment[0] });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .put(
    "/:id",
    zValidator("param", appointmentIdParamSchema),
    zValidator("json", updateAppointmentSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const updateData = {
          ...body,
          scheduledDate: body.scheduledDate
            ? new Date(body.scheduledDate)
            : undefined,
          followUpDate: body.followUpDate
            ? new Date(body.followUpDate)
            : undefined,
          metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
        };
        const updatedAppointment = await db
          .update(appointments)
          .set(updateData)
          .where(eq(appointments.id, id))
          .returning();
        if (updatedAppointment.length === 0) {
          return c.json(
            { success: false, error: "Appointment not found" },
            404
          );
        }
        return c.json({ success: true, data: updatedAppointment[0] });
      } catch (error) {
        return c.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  .delete("/:id", zValidator("param", appointmentIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const deletedAppointment = await db
        .delete(appointments)
        .where(eq(appointments.id, id))
        .returning();
      if (deletedAppointment.length === 0) {
        return c.json({ success: false, error: "Appointment not found" }, 404);
      }
      return c.json({ success: true, data: deletedAppointment[0] });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  });

export default appointmentRoute;
