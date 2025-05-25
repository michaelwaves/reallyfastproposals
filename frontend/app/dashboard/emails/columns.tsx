import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

type Message = {
    id: string
    subject: string
    bodyPreview: string
    receivedDateTime: string
    createdDateTime: string
    sentDateTime: string
    hasAttachments: boolean
    importance: string
}

export const messageColumns: ColumnDef<Message>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return (
                <Link href={`/${id}`} className="text-sky-700 underline hover:text-sky-500">
                    View
                </Link>
            )
        },
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => <div className="font-medium">{row.getValue("subject")}</div>,
    },
    {
        accessorKey: "bodyPreview",
        header: "Body Preview",
        cell: ({ row }) => {
            const preview = row.getValue("bodyPreview") as string
            return <div className="text-muted-foreground line-clamp-2">{preview}</div>
        },
    },
    {
        accessorKey: "receivedDateTime",
        header: "Date Received",
        cell: ({ row }) => {
            const date = new Date(row.getValue("receivedDateTime") as string)
            return <div>{date.toLocaleString()}</div>
        },
    },
    {
        accessorKey: "sentDateTime",
        header: "Date Sent",
        cell: ({ row }) => {
            const date = new Date(row.getValue("sentDateTime") as string)
            return <div>{date.toLocaleString()}</div>
        },
    },
    {
        accessorKey: "createdDateTime",
        header: "Created",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdDateTime") as string)
            return <div>{date.toLocaleString()}</div>
        },
    },
    {
        accessorKey: "hasAttachments",
        header: "Attachments",
        cell: ({ row }) => {
            const has = row.getValue("hasAttachments") as boolean
            return <div>{has ? "Yes" : "No"}</div>
        },
    },
    {
        accessorKey: "importance",
        header: "Importance",
        cell: ({ row }) => <div className="capitalize">{row.getValue("importance")}</div>,
    },
]
