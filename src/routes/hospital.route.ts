import { factory } from "../lib/factory";
// import { db } from "../lib/db";
import { hospitals } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createHospitalSchema,
  updateHospitalSchema,
  getHospitalsQuerySchema,
  hospitalIdParamSchema,
} from "../lib/validations/hospital.validation";

const hospitalRoute = factory
  .createApp()
  .get("/", zValidator("query", getHospitalsQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");
      const allHospitals = await db.select().from(hospitals);
      return c.json({ success: true, data: allHospitals });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .post("/", zValidator("json", createHospitalSchema), async (c) => {
    try {
      const db = c.get("db");
      const body = c.req.valid("json");
      const newHospital = await db.insert(hospitals).values(body).returning();
      return c.json({ success: true, data: newHospital[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .get("/:id", zValidator("param", hospitalIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const hospital = await db
        .select()
        .from(hospitals)
        .where(eq(hospitals.id, id));
      if (hospital.length === 0) {
        return c.json({ success: false, error: "Hospital not found" }, 404);
      }
      return c.json({ success: true, data: hospital[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .put(
    "/:id",
    zValidator("param", hospitalIdParamSchema),
    zValidator("json", updateHospitalSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const updatedHospital = await db
          .update(hospitals)
          .set(body)
          .where(eq(hospitals.id, id))
          .returning();
        if (updatedHospital.length === 0) {
          return c.json({ success: false, error: "Hospital not found" }, 404);
        }
        return c.json({ success: true, data: updatedHospital[0] });
      } catch (error) {
        return c.json({ success: false, error: error.message }, 500);
      }
    }
  )
  .delete("/:id", zValidator("param", hospitalIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const deletedHospital = await db
        .delete(hospitals)
        .where(eq(hospitals.id, id))
        .returning();
      if (deletedHospital.length === 0) {
        return c.json({ success: false, error: "Hospital not found" }, 404);
      }
      return c.json({ success: true, data: deletedHospital[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });

export default hospitalRoute;
