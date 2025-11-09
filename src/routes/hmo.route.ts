import { factory } from "../lib/factory";
// import { db } from "../lib/db";
import { hmos } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createHmoSchema,
  updateHmoSchema,
  getHmosQuerySchema,
  hmoIdParamSchema,
} from "../lib/validations/hmo.validation";

const hmoRoute = factory
  .createApp()
  .get("/", zValidator("query", getHmosQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");
      const allHmos = await db.select().from(hmos);
      return c.json({ success: true, data: allHmos });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .post("/", zValidator("json", createHmoSchema), async (c) => {
    try {
      const db = c.get("db");
      const body = c.req.valid("json");
      const newHmo = await db.insert(hmos).values(body).returning();
      return c.json({ success: true, data: newHmo[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .get("/:id", zValidator("param", hmoIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const hmo = await db.select().from(hmos).where(eq(hmos.id, id));
      if (hmo.length === 0) {
        return c.json({ success: false, error: "HMO not found" }, 404);
      }
      return c.json({ success: true, data: hmo[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .put(
    "/:id",
    zValidator("param", hmoIdParamSchema),
    zValidator("json", updateHmoSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const updatedHmo = await db
          .update(hmos)
          .set(body)
          .where(eq(hmos.id, id))
          .returning();
        if (updatedHmo.length === 0) {
          return c.json({ success: false, error: "HMO not found" }, 404);
        }
        return c.json({ success: true, data: updatedHmo[0] });
      } catch (error) {
        return c.json({ success: false, error: error.message }, 500);
      }
    }
  )
  .delete("/:id", zValidator("param", hmoIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const deletedHmo = await db
        .delete(hmos)
        .where(eq(hmos.id, id))
        .returning();
      if (deletedHmo.length === 0) {
        return c.json({ success: false, error: "HMO not found" }, 404);
      }
      return c.json({ success: true, data: deletedHmo[0] });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });

export default hmoRoute;
