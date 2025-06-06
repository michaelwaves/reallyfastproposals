"use server"
import { auth } from "@/auth"
import { db, helpers } from "../db"
import { withAuditLog } from "../audit"


if (!helpers) {
    throw new Error("Helpers not defined")
}

const { insert, update } = helpers

const createOne = withAuditLog("create")(async (tableName: string, data: any) => {
    const session = await auth()
    const orgId = session?.organization
    const userId = session?.user?.id
    const fullData = {
        ...data,
        created_by: userId,
        organization_id: orgId
    }
    const res = await db.one(insert(fullData, null, tableName) + " RETURNING id")
    return res
})

const selectOne = withAuditLog("read")(async (tableName: string, id: string) => {
    const res = await db.oneOrNone(`SELECT * FROM ${tableName} WHERE id=$2`, [tableName, id])
    return res
})

const updateOne = withAuditLog("update")(async (tableName: string, id: string | number, data: any) => {
    const res = await db.oneOrNone(update(data, null, tableName) + " WHERE id=$1 RETURNING id", [id])
    return res
})

const deleteOne = withAuditLog("delete")(async (tableName: string, id: string) => {
    const res = await db.oneOrNone(`DELETE FROM ${tableName} WHERE id=$2 RETURNING id`, [tableName, id])
    return res
})

export { createOne, selectOne, updateOne, deleteOne }