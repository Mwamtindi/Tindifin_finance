import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
//new
import { recordAction } from "@/utils/auditLogger";

const app = new Hono()
  .get("/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

    const data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));

    //log the action 1 new line
    await recordAction(auth.userId, "Fetched account list");

   return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if ( !id ) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const [data] = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id)
        ),
      );

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      //Log the action 1 new line
      await recordAction(auth.userId, `Fetched account details for ID: ${id}`);

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({
      name: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db.insert(accounts).values({
        id: createId(),
        userId: auth.userId,
        ...values,
      }).returning();

      // Log the action 1 new line
      await recordAction(auth.userId, "Created a new account");

      return c.json({ data });
    })
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

        // Log the action 1 new line
        await recordAction(auth.userId, `Bulk deleted accounts with IDs: ${values.ids.join(", ")}`);

        return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unautorized" }, 401);
      }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id),
          ),
        )
        .returning();

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        // Log the action 1 new line 
        await recordAction(auth.userId, `Updated account with ID: ${id}`);

        return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unautorized" }, 401);
      }

      const [data] = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id),
          ),
        )
        .returning({
          id: accounts.id,
        });

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        // Log the action
        await recordAction(auth.userId, `Deleted account with ID: ${id}`);

        return c.json({ data });
    },
  );

export default app;