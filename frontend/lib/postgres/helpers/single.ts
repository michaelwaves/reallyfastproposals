"use server"
import { auth } from "@/auth"
import { db, helpers } from "../db"
import { withAuditLog } from "./audit"

if (!helpers) {
    throw new Error("Helpers not defined")
}

const { insert, update } = helpers

const createOne = async (tableName: string, data: any) => {
    const fullData = {
        ...data,
    }
    const res = await db.one(insert(fullData, null, tableName) + " RETURNING id")
    return res
}

const selectOne = async (tableName: string, id: string) => {
    const res = await db.oneOrNone(`SELECT * FROM ${tableName} WHERE id=$2`, [tableName, id])
    return res
}

const updateOne = async (tableName: string, id: string | number, data: any) => {
    const res = await db.oneOrNone(update(data, null, tableName) + " WHERE id=$1 RETURNING id", [id])
    return res
}

const deleteOne = async (tableName: string, id: string) => {
    const res = await db.oneOrNone(`DELETE FROM ${tableName} WHERE id=$2 RETURNING id`, [tableName, id])
    return res
}

const upsertOne = async (tableName: string, data: any) => {
    const cs = new helpers.ColumnSet(Object.keys(data), { table: tableName })
    const query = helpers.insert(data, cs) + `
    ON CONFLICT (id) DO UPDATE SET
    ${cs.assignColumns({ from: 'EXCLUDED', skip: ['id'] })}
    `
    return db.one(query)
}

export { createOne, selectOne, updateOne, deleteOne, upsertOne }