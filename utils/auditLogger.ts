// utils/auditLogger.ts

import { db } from "@/db/drizzle";
import { auditLogs } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2"; // Generates unique IDs

export async function recordAction(userId: string, action: string) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to record action:", error);
  }
}


// utils/auditLogger.ts
/*import { db } from "@/db/drizzle";
import { auditLogs } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";

export const recordAction = async (userId: string, action: string) => {
  await db.insert(auditLogs).values({
    id: createId(),
    userId,
    action,
    timestamp: new Date(),
  });
};*/
