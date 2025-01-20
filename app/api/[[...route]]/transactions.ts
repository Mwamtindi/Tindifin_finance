import { z } from "zod";
import { Hono } from "hono";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { transactions, insertTransactionSchema, categories, accounts } from "@/db/schema";

//new
import { recordAction } from "@/utils/auditLogger";


const app = new Hono()
  .get("/",
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;

    const data = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      category: categories.name,
      categoryId: transactions.categoryId,
      payee: transactions.payee,
      amount: transactions.amount,
      notes: transactions.notes,
      account: accounts.name,
      accountId: transactions.accountId,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, auth.userId),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate),
      )
    )
    .orderBy(desc(transactions.date));

    // 1 new line
    await recordAction(auth.userId, "Fetched transaction list");

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
        id: transactions.id,
        date: transactions.date,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        accountId: transactions.accountId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        ),
      );

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      // 1 new line
      await recordAction(auth.userId, `Fetched transaction details for ID: ${id}`);

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
      id: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db.insert(transactions).values({
        id: createId(),
        ...values,
      }).returning();
      // 1 new line
      await recordAction(auth.userId, "Created a new transaction");

      return c.json({ data });
    })
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
           values.map((value) => ({
            id: createId(),
            ...value,
           }))
        )
        .returning();

        // 1 new line
        await recordAction(auth.userId, "Bulk created transactions ");

      return c.json({ data });
    },
  )
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

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
          inArray(transactions.id, values.ids),
          eq(accounts.userId, auth.userId),
        )),
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        )
        .returning({
          id: transactions.id,
        });
        //1 new line 
        await recordAction(auth.userId, `Bulk deleted transactions with IDs: ${values.ids.join(", ")}`);

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
      insertTransactionSchema.omit({
        id: true,
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

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db.select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        )),
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
        )
        .returning();


        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }
        //1 new line
        await recordAction(auth.userId, `Updated transaction with ID: ${id}`);

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

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        )),
      );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          ),
        )
        .returning({
          id: transactions.id,
        });

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }
        // 1 new line
        await recordAction(auth.userId, `Deleted transaction with ID: ${id}`);

        return c.json({ data });
    },
  );

export default app;