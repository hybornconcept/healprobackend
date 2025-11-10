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
  insuranceLicenseUploadSchema,
  financialStatementUploadSchema,
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
  })
  // Upload insurance license document
  .post(
    "/:id/upload-insurance-license",
    zValidator("param", hmoIdParamSchema),
    zValidator("form", insuranceLicenseUploadSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const { file } = c.req.valid("form");

        // Verify HMO exists
        const hmo = await db.select().from(hmos).where(eq(hmos.id, id));

        if (hmo.length === 0) {
          return c.json({ success: false, error: "HMO not found" }, 404);
        }

        // Delete existing insurance license if it exists
        if (hmo[0].insuranceLicenseUrl) {
          try {
            const oldFilename = hmo[0].insuranceLicenseUrl.split("/").pop();
            if (oldFilename) {
              await c.env.BUCKET.delete(oldFilename);
            }
          } catch (error) {
            console.error("Error deleting old insurance license:", error);
          }
        }

        // Upload new insurance license
        const fileBuffer = await file.arrayBuffer();
        const filename = `hmo-${id}-insurance-license-${Date.now()}-${
          file.name
        }`;
        await c.env.BUCKET.put(filename, fileBuffer, {
          httpMetadata: { contentType: file.type },
        });

        const documentUrl = `${c.env.R2_PUBLIC_URL}/${filename}`;

        // Update HMO record with new document URL
        const updatedHmo = await db
          .update(hmos)
          .set({ insuranceLicenseUrl: documentUrl })
          .where(eq(hmos.id, id))
          .returning();

        return c.json({
          success: true,
          message: "Insurance license uploaded successfully",
          data: { url: documentUrl },
        });
      } catch (error) {
        console.error("Error uploading insurance license:", error);
        return c.json(
          {
            success: false,
            message: "Failed to upload insurance license",
          },
          500
        );
      }
    }
  )
  // Upload financial statement document
  .post(
    "/:id/upload-financial-statement",
    zValidator("param", hmoIdParamSchema),
    zValidator("form", financialStatementUploadSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const { file } = c.req.valid("form");

        // Verify HMO exists
        const hmo = await db.select().from(hmos).where(eq(hmos.id, id));

        if (hmo.length === 0) {
          return c.json({ success: false, error: "HMO not found" }, 404);
        }

        // Delete existing financial statement if it exists
        if (hmo[0].financialStatementUrl) {
          try {
            const oldFilename = hmo[0].financialStatementUrl.split("/").pop();
            if (oldFilename) {
              await c.env.BUCKET.delete(oldFilename);
            }
          } catch (error) {
            console.error("Error deleting old financial statement:", error);
          }
        }

        // Upload new financial statement
        const fileBuffer = await file.arrayBuffer();
        const filename = `hmo-${id}-financial-statement-${Date.now()}-${
          file.name
        }`;
        await c.env.BUCKET.put(filename, fileBuffer, {
          httpMetadata: { contentType: file.type },
        });

        const documentUrl = `${c.env.R2_PUBLIC_URL}/${filename}`;

        // Update HMO record with new document URL
        const updatedHmo = await db
          .update(hmos)
          .set({ financialStatementUrl: documentUrl })
          .where(eq(hmos.id, id))
          .returning();

        return c.json({
          success: true,
          message: "Financial statement uploaded successfully",
          data: { url: documentUrl },
        });
      } catch (error) {
        console.error("Error uploading financial statement:", error);
        return c.json(
          {
            success: false,
            message: "Failed to upload financial statement",
          },
          500
        );
      }
    }
  );

export default hmoRoute;
