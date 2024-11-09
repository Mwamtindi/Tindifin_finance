// app/api/[[...route]]/audit-logs.ts

/*import { db } from "@/db/drizzle";
import { auditLogs } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { desc } from "drizzle-orm";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);
    res.status(500).json({ message: "Failed to retrieve audit logs" });
  }
}*/


import { Hono } from 'hono';  // Import Hono
import { db } from "@/db/drizzle";
import { auditLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp));

    return c.json(logs); // Return JSON response in Hono format
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);
    return c.json({ message: "Failed to retrieve audit logs" }, 500);  // Return error response in Hono format
  }
});

export default app;
