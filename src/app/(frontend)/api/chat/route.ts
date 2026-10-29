import { appAuth } from '@/lib/app-auth'

const MAX_PROMPT_LENGTH = 12_000
const MAX_HISTORY_MESSAGES = 20
const MAX_IMAGE_BYTES = 1_500_000

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } }

type GeminiContent = {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function POST(request: Request) {
  const user = await appAuth.currentUser()
  if (!user) return Response.json({ error: 'Please sign in to chat.' }, { status: 401 })

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json(
      {
        error:
          'AI chat is not configured yet. Add the server-only GOOGLE_GEMINI_API_KEY environment variable.',
      },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid chat request.' }, { status: 400 })
  }
  if (!isRecord(body) || typeof body.prompt !== 'string') {
    return Response.json({ error: 'Enter a message to send.' }, { status: 400 })
  }

  const prompt = body.prompt.trim()
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return Response.json(
      { error: `Messages must be between 1 and ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 },
    )
  }

  const history: ChatMessage[] = []
  if (Array.isArray(body.history)) {
    let historyCharacters = 0
    for (const item of body.history.slice(-MAX_HISTORY_MESSAGES).reverse()) {
      if (
        isRecord(item) &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string' &&
        item.content.length <= MAX_PROMPT_LENGTH &&
        historyCharacters + item.content.length <= 32_000
      ) {
        history.unshift({ role: item.role, content: item.content })
        historyCharacters += item.content.length
      }
    }
  }

  const images: { mimeType: string; data: string }[] = []
  if (Array.isArray(body.images)) {
    for (const image of body.images.slice(0, 4)) {
      if (!isRecord(image) || typeof image.dataUrl !== 'string') {
        return Response.json({ error: 'Invalid image attachment.' }, { status: 400 })
      }
      const match = /^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/=]+)$/.exec(
        image.dataUrl,
      )
      if (!match || (match[2].length * 3) / 4 > MAX_IMAGE_BYTES) {
        return Response.json(
          { error: 'Attach PNG, JPEG, GIF, or WebP images under 1.5 MB each.' },
          { status: 400 },
        )
      }
      images.push({ mimeType: match[1], data: match[2] })
    }
  }

  const contents: GeminiContent[] = history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }],
  }))
  contents.push({
    role: 'user',
    parts: [
      { text: prompt },
      ...images.map((image) => ({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      })),
    ],
  })

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'You are Luma, a helpful, thoughtful assistant. Be clear, accurate, and concise. If you are unsure, say so.',
              },
            ],
          },
          contents,
          generationConfig: { maxOutputTokens: 1200 },
        }),
        signal: AbortSignal.timeout(45_000),
      },
    )

    if (!response.ok) {
      console.error('Gemini chat request failed.', response.status)
      return Response.json(
        { error: 'The AI service could not answer right now. Please try again.' },
        { status: response.status === 429 ? 429 : 502 },
      )
    }

    const result: unknown = await response.json()
    if (!isRecord(result) || !Array.isArray(result.candidates)) {
      throw new Error('Gemini returned an invalid response.')
    }
    const candidate = result.candidates[0]
    if (
      !isRecord(candidate) ||
      !isRecord(candidate.content) ||
      !Array.isArray(candidate.content.parts)
    ) {
      throw new Error('Gemini returned no answer.')
    }
    const answer = candidate.content.parts
      .flatMap((part) => (isRecord(part) && typeof part.text === 'string' ? [part.text] : []))
      .join('')
    if (!answer) throw new Error('Gemini returned an empty answer.')

    return Response.json({ answer })
  } catch (error) {
    console.error('Gemini chat request could not be completed.', error)
    return Response.json(
      { error: 'Could not reach the AI service. Please try again.' },
      { status: 502 },
    )
  }
}
