'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"

interface Result {
    score: number
    text: string
    link: string
}

interface MemoGeneratorProps {
    context: string
    results: Result[]
}

export default function MemoGenerator({ context, results }: MemoGeneratorProps) {
    const [memo, setMemo] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleGenerateMemo = async () => {
        setLoading(true)
        const res = await fetch('/api/generate-memo', {
            method: 'POST',
            body: JSON.stringify({ context, results }),
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.text()
        setMemo(data)
        setLoading(false)
    }

    const handleSendEmail = async () => {
        await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify({ memo }),
            headers: { 'Content-Type': 'application/json' },
        })
        setSent(true)
    }

    return (
        <Dialog>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Management Memo</DialogTitle>
                </DialogHeader>

                <Textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={10}
                    placeholder="Memo will appear here after generation..."
                    className="font-mono"
                />

                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button onClick={handleGenerateMemo} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Memo'}
                    </Button>
                    <Button onClick={handleSendEmail} disabled={!memo}>
                        {sent ? 'Sent!' : 'Send Email to Management'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
