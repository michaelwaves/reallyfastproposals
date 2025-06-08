"use server"
import { db } from "../db";
import { auth } from "@/auth"

export const withAuditLog = (action: "create" | "update" | "delete" | "read") => {
  return (originalFn: Function) => {
    return async (tableName: string, ...args: any[]) => {
      const session = await auth()
      const userId = session?.user?.id
      const userName = session?.user?.name

      const result = await originalFn(tableName, ...args)

      // Extract record ID
      const recordId = result?.id || args[0] // fallback

      // Optionally capture changes for update
      let changes = action === "update" ? args[1] : args[0]
      changes = action === "read" ? {} : changes

      await db.none(
        `INSERT INTO audit_logs (user_id, action, table_name, record_id, changes, user_name)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, action, tableName, recordId, changes, userName]
      )

      return result
    }
  }
}

const getTotalActions = async () => {
  try {
    return await db.one(`
      SELECT COUNT(*) AS total_actions FROM audit_logs
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching total actions: " + e);
  }
};

const getTotalUniqueUsers = async () => {
  try {
    return await db.one(`
      SELECT COUNT(DISTINCT user_id) AS total_users FROM audit_logs
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching total unique users: " + e);
  }
};

const getMostActiveUser = async () => {
  try {
    return await db.one(`
      SELECT user_id, COUNT(*) AS action_count
      FROM audit_logs
      GROUP BY user_id
      ORDER BY action_count DESC
      LIMIT 1
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching most active user: " + e);
  }
};

const getAvgActionsPerUser = async () => {
  try {
    return await db.one(`
      SELECT AVG(action_count) AS avg_actions_per_user
      FROM (
          SELECT user_id, COUNT(*) AS action_count
          FROM audit_logs
          GROUP BY user_id
      ) sub
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error calculating average actions per user: " + e);
  }
};

const getMostAccessedTable = async () => {
  try {
    return await db.one(`
      SELECT table_name, COUNT(*) AS hits
      FROM audit_logs
      GROUP BY table_name
      ORDER BY hits DESC
      LIMIT 1
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching most accessed table: " + e);
  }
};

const getAvgDailyActions = async () => {
  try {
    return await db.one(`
      SELECT AVG(action_count) AS avg_daily_actions
      FROM (
          SELECT DATE(created_at) AS day, COUNT(*) AS action_count
          FROM audit_logs
          GROUP BY day
      ) sub
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error calculating average daily actions: " + e);
  }
};

const getActivityTimeline = async () => {
  try {
    return await db.any(`
      SELECT DATE(created_at) AS date, COUNT(*) AS actions
      FROM audit_logs
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching activity timeline: " + e);
  }
};



// Exporting all constants for use elsewhere in the app
export {
  getTotalActions,
  getTotalUniqueUsers,
  getMostActiveUser,
  getAvgActionsPerUser,
  getMostAccessedTable,
  getAvgDailyActions,
  getActivityTimeline
};