'use server'

import { GoogleGenAI } from '@google/genai'

export async function draftEmailToManagement({
    context,
    results,
}: {
    context: string
    results: { score: number; text: string; link: string }[]
}): Promise<string> {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

    const formattedResults = results
        .map(
            (r, i) =>
                `Result ${i + 1}:\nScore: ${r.score.toFixed(2)}\nText: ${r.text}\nLink: ${r.link}`
        )
        .join('\n\n')

    const prompt = `
You are writing an internal email to management.

Our company focuses on:
${context}

Below are the top opportunities returned from our relevance engine:

${formattedResults}

Write a clear, persuasive email summarizing why these opportunities are relevant to our business. Use professional tone, bullet points if helpful, and highlight strategic alignment.
  `.trim()

    const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
    })

    return result.text ?? ""
}
