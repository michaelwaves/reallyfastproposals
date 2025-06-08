"use server"
import { auth } from "@/auth"
import { db, helpers } from "../db"
import { revalidatePath } from "next/cache";

const insert = helpers?.insert
const batchCreate = async (data: any[], tableName: string) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!insert) {
        throw new Error("insert helper from pg-promise not defined");
    }

    if (data.length === 0) return;

    try {
        const fullData = data.map(d => ({
            ...d,
            created_by: userId,
        }));

        const res = await db.task("insert multiple records", t => {
            const queries = fullData.map(d => {
                return t.oneOrNone(insert(d, null, tableName) + " ON CONFLICT DO NOTHING RETURNING id");
            })
            return t.batch(queries)
        })
        return res
    } catch (e: any) {
        console.error(e);
        throw new Error(JSON.stringify(e.getErrors?.() || e.message));
    }
};


const batchDelete = async (ids: string[] | number[], tableName: string, idDataType?: string) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error("Unauthorized");
    if (ids.length === 0) return;

    if (idDataType == "uuid") {
        await db.none(
            `DELETE FROM ${tableName} WHERE id = ANY($1::UUID[])`,
            [ids]
        );
    } else {
        await db.none(
            `DELETE FROM ${tableName} WHERE id = ANY($1)`,
            [ids]
        );
    }

    revalidatePath("/dashboard")

};

const batchSelect = async (ids: string[], tableName: string) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (ids.length === 0) return [];

    return await db.any(
        `SELECT * FROM ${tableName} WHERE id = ANY($1) AND userId = $2`,
        [ids, userId]
    );
};

const selectAll = async (tableName: string) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized: No organization found");
    }
    return await db.any(`SELECT * FROM ${tableName} WHERE userId = $1`, [userId]);
};

const selectAllNoOrgId = async (tableName: string) => {
    return await db.any(`SELECT * FROM ${tableName}`,);
};


export { batchCreate, batchDelete, batchSelect, selectAll, selectAllNoOrgId }