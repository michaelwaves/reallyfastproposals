'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function SearchForm() {
  const [text, setText] = useState('')
  const [limit, setLimit] = useState(5)
  const [minScore, setMinScore] = useState(0.75)
  const [results, setResults] = useState<{ similarity: number; rfp: any }[]>([])

  async function handleSearch() {
    const params = new URLSearchParams({
      query: text,
      top_k: String(limit),
      // min_score: String(minScore),
    })
    const res = await fetch(`http://localhost:8000/search/rfps?${params.toString()}`)
    const data = await res.json()
    setResults(data)
    console.log(data)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">Semantic Search</h1>

      <div className="space-y-4">
        <Label className="text-green-800">Keywords</Label>
        <Textarea
          className="border-green-300 focus:ring-green-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to search..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-green-800">Limit: {limit}</Label>
        <Slider
          min={1}
          max={50}
          value={[limit]}
          onValueChange={(val) => setLimit(val[0])}
          className="text-green-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-green-800">Min Score: {minScore.toFixed(2)}</Label>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[minScore]}
          onValueChange={(val) => setMinScore(val[0])}
          className="text-green-500"
        />
      </div>

      <Button
        onClick={handleSearch}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Search
      </Button>

      <div className="space-y-4 mt-8">
        {results.map((res, idx) => (
          <Card key={idx} className="border-green-200">
            <CardContent className="p-4">
              <p className="text-green-900 font-medium">Score: {res.similarity.toFixed(4)}</p>
              <p className="text-gray-800 mt-1">{res.rfp.title}</p>
              {res.rfp.href && (
                <a
                  href={res.rfp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline mt-2 block"
                >
                  View Link
                </a>
              )}
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  )
}
