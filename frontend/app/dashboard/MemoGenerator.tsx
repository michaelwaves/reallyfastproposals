'use client'

import { useState } from 'react'

interface Result {
    score: number
    text: string
    link: string
}

interface MemoGeneratorProps {
    context: string
    results: Result[]
    onClose: () => void
}

export default function MemoGenerator({ context, results, onClose }: MemoGeneratorProps) {
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full">
                <h2 className="text-xl font-semibold mb-4">Management Memo</h2>
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={12}
                    className="w-full p-3 border rounded-md font-mono"
                />
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Close</button>
                    <button
                        onClick={handleGenerateMemo}
                        className="px-4 py-2 rounded bg-blue-500 text-white"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Memo'}
                    </button>
                    <button
                        onClick={handleSendEmail}
                        className="px-4 py-2 rounded bg-green-600 text-white"
                        disabled={!memo}
                    >
                        {sent ? 'Sent!' : 'Send Email to Management'}
                    </button>
                </div>
            </div>
        </div>
    )
}
