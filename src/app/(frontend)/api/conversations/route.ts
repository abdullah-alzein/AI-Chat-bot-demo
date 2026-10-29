import { appAuth, createSupabaseServerClient } from '@/lib/app-auth'

type StoredMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  complete?: boolean
  attachments?: {
    id: string
    name: string
    type: string
    size: number
  }[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseMessages(value: unknown): StoredMessage[] | null {
  if (!Array.isArray(value) || value.length > 100) return null

  const parsed: StoredMessage[] = []
  for (const entry of value) {
    if (
      !isRecord(entry) ||
      typeof entry.id !== 'string' ||
      !/^[0-9a-f-]{36}$/i.test(entry.id) ||
      (entry.role !== 'user' && entry.role !== 'assistant') ||
      typeof entry.content !== 'string' ||
      entry.content.length > 20_000
    ) {
      return null
    }

    const attachments = Array.isArray(entry.attachments)
      ? entry.attachments.slice(0, 5).flatMap((attachment) => {
          if (!isRecord(attachment)) return []
          if (
            typeof attachment.id !== 'string' ||
            typeof attachment.name !== 'string' ||
            typeof attachment.type !== 'string' ||
            typeof attachment.size !== 'number'
          ) {
            return []
          }
          return [
            {
              id: attachment.id.slice(0, 80),
              name: attachment.name.slice(0, 255),
              type: attachment.type.slice(0, 120),
              size: Math.max(0, Math.min(attachment.size, 100_000_000)),
            },
          ]
        })
      : undefined

    parsed.push({
      id: entry.id,
      role: entry.role,
      content: entry.content,
      complete: entry.complete === true,
      attachments,
    })
  }
  return parsed
}

export async function GET() {
  try {
    const user = await appAuth.currentUser()
    if (!user) return Response.json({ error: 'Please sign in.' }, { status: 401 })

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('conversations')
      .select('id, title, messages, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200)
    if (error) throw error

    return Response.json({
      conversations: data.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        messages: conversation.messages,
        updatedAt: new Date(conversation.updated_at).getTime(),
      })),
    })
  } catch (error) {
    console.error('Could not load Supabase conversations.', error)
    return Response.json(
      {
        error:
          'Could not load conversations. Check that the Supabase database migration has been applied.',
      },
      { status: 503 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await appAuth.currentUser()
    if (!user) return Response.json({ error: 'Please sign in.' }, { status: 401 })

    const body: unknown = await request.json()
    if (!isRecord(body) || typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.id)) {
      return Response.json({ error: 'Invalid conversation.' }, { status: 400 })
    }
    const messages = parseMessages(body.messages)
    if (!messages) {
      return Response.json({ error: 'Invalid conversation messages.' }, { status: 400 })
    }

    const title = messages.find((message) => message.role === 'user')?.content.trim()
    if (!title) {
      return Response.json({ error: 'A conversation needs a user message.' }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.from('conversations').upsert(
      {
        id: body.id,
        user_id: user.id,
        title: title.slice(0, 120),
        messages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error('Could not save Supabase conversation.', error)
    return Response.json(
      {
        error:
          'Could not save this conversation. Check that the Supabase database migration has been applied.',
      },
      { status: 503 },
    )
  }
}
