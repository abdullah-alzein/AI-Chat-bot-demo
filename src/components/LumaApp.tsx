'use client'

import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AppUser } from '@/lib/app-auth'

type IconProps = { className?: string }
type Phase = 'idle' | 'thinking' | 'answering' | 'paused'
type Rating = 'up' | 'down' | null
type Attachment = {
  id: string
  name: string
  type: string
  size: number
  preview?: string
}
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  rating?: Rating
  complete?: boolean
  attachments?: Attachment[]
}
type Conversation = {
  id: string
  title: string
  updatedAt: number
  messages: Message[]
}

const Icon = ({ children, className = 'h-5 w-5' }: { children: ReactNode; className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const PlusIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
const ChatIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
  </Icon>
)
const SparkleIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3Z" />
    <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
  </Icon>
)
const CompassIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-2 4-4 2 2-4Z" />
  </Icon>
)
const ImageIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="2" />
    <path d="m21 15-4-4L7 20" />
  </Icon>
)
const MoreIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="5" cy="12" r=".7" fill="currentColor" />
    <circle cx="12" cy="12" r=".7" fill="currentColor" />
    <circle cx="19" cy="12" r=".7" fill="currentColor" />
  </Icon>
)
const MenuIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)
const PaperclipIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="m20.5 11.5-8.8 8.8a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.7 3.7 0 0 1 5.2 5.2l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.3-8.3" />
  </Icon>
)
const ArrowIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
  </Icon>
)
const ChevronIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="m8 10 4 4 4-4" />
  </Icon>
)
const PauseIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M9 5v14M15 5v14" />
  </Icon>
)
const PlayIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="m8 5 11 7-11 7Z" />
  </Icon>
)
const RetryIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M20 7v5h-5M4 17v-5h5" />
    <path d="M6.1 8a7 7 0 0 1 11.5-1L20 12M4 12l2.4 5a7 7 0 0 0 11.5-1" />
  </Icon>
)
const CopyIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect x="8" y="8" width="11" height="11" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </Icon>
)
const ThumbUpIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3ZM7 20h9.5a2 2 0 0 0 1.9-1.4l2.2-7A2 2 0 0 0 18.7 9H14l.7-3.3A2.2 2.2 0 0 0 12.5 3L7 10Z" />
  </Icon>
)
const ThumbDownIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M17 14V3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3ZM17 4H7.5a2 2 0 0 0-1.9 1.4l-2.2 7A2 2 0 0 0 5.3 15H10l-.7 3.3a2.2 2.2 0 0 0 2.2 2.7l5.5-7Z" />
  </Icon>
)
const CheckIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="m5 12 4 4L19 6" />
  </Icon>
)
const CloseIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
)
const DownloadIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </Icon>
)
const FileIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
    <path d="M14 3v6h6M8 14h8M8 17h5" />
  </Icon>
)

const starterPrompts = [
  {
    label: 'Create a project plan',
    detail: 'Turn an idea into clear next steps',
    prompt: 'Create a practical project plan for launching a personal portfolio website.',
    tone: 'bg-violet-100 text-violet-700',
  },
  {
    label: 'Help me write',
    detail: 'Draft, refine, and find the right tone',
    prompt: 'Help me write a warm and concise launch announcement for a new product.',
    tone: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Explore an idea',
    detail: 'Brainstorm from a fresh perspective',
    prompt: 'Brainstorm five creative ways to make a remote team feel more connected.',
    tone: 'bg-cyan-100 text-cyan-700',
  },
]

const followUps = [
  'Make it more concise',
  'Give me a concrete example',
  'Turn this into an action plan',
]

const imagePrompts = [
  'A quiet glass cabin in a misty pine forest at dawn',
  'Editorial product photo of a translucent citrus perfume bottle',
  'A playful clay-style robot tending a rooftop garden',
]

const createArtwork = (prompt: string, variation: number) => {
  const palettes = [
    ['#f0a46b', '#693b68', '#17242c', '#f5d6a8'],
    ['#a8d8c9', '#557c93', '#20273f', '#f3dca4'],
    ['#d8a7d8', '#7a72b5', '#26334a', '#f0bd79'],
    ['#b8d978', '#3c7c73', '#19313a', '#f1c27d'],
  ]
  const hash = [...prompt].reduce((total, letter) => total + letter.charCodeAt(0), variation)
  const palette = palettes[hash % palettes.length]
  const sunX = 220 + (hash % 480)
  const sunY = 150 + (hash % 160)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette[0]}"/><stop offset=".55" stop-color="${palette[1]}"/><stop offset="1" stop-color="${palette[2]}"/></linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="45"/></filter>
      <filter id="grain"><feTurbulence baseFrequency=".8" numOctaves="3" seed="${hash % 40}" result="n"/><feBlend in="SourceGraphic" in2="n" mode="soft-light"/></filter>
    </defs>
    <rect width="1200" height="900" fill="url(#sky)"/>
    <circle cx="${sunX}" cy="${sunY}" r="130" fill="${palette[3]}" opacity=".82" filter="url(#blur)"/>
    <circle cx="${sunX}" cy="${sunY}" r="76" fill="${palette[3]}" opacity=".9"/>
    <path d="M0 620 Q210 420 430 610 T820 540 T1200 570 V900 H0Z" fill="${palette[2]}" opacity=".55"/>
    <path d="M0 715 Q190 540 390 700 T760 650 T1200 690 V900 H0Z" fill="${palette[2]}" opacity=".78"/>
    <path d="M0 790 Q250 660 500 790 T900 750 T1200 790 V900 H0Z" fill="#111b24" opacity=".7"/>
    <rect width="1200" height="900" opacity=".16" filter="url(#grain)"/>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export default function LumaApp({ user }: { user: AppUser }) {
  const router = useRouter()
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentId, setCurrentId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [chatError, setChatError] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [pausedFrom, setPausedFrom] = useState<Exclude<Phase, 'idle' | 'paused'>>('thinking')
  const [progress, setProgress] = useState(0)
  const [activePrompt, setActivePrompt] = useState('')
  const [fullAnswer, setFullAnswer] = useState('')
  const [wordCursor, setWordCursor] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [model, setModel] = useState('Luma · Gemini 3.5 Flash')
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<'chat' | 'chats' | 'discover' | 'image'>('chat')
  const [chatSearch, setChatSearch] = useState('')
  const [discoverCategory, setDiscoverCategory] = useState('All')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageProgress, setImageProgress] = useState(0)
  const [imageStatus, setImageStatus] = useState<'idle' | 'generating' | 'complete'>('idle')
  const [generatedImage, setGeneratedImage] = useState('')
  const [variation, setVariation] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    void fetch('/api/conversations')
      .then(async (response) => {
        const result = (await response.json()) as {
          conversations?: Conversation[]
          error?: string
        }
        if (!response.ok) throw new Error(result.error || 'Could not load conversations.')
        return result.conversations || []
      })
      .then((history) => {
        if (!active) return
        setConversations(history)
        setCurrentId(history[0]?.id || crypto.randomUUID())
        setMessages(history[0]?.messages || [])
      })
      .catch((error: unknown) => {
        if (!active) return
        setChatError(error instanceof Error ? error.message : 'Could not load conversations.')
        setCurrentId(crypto.randomUUID())
      })
      .finally(() => {
        if (active) setHistoryLoaded(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!messages.length) return
    setConversations((previous) => {
      const firstPrompt = messages.find((item) => item.role === 'user')?.content || 'New chat'
      const conversation = {
        id: currentId,
        title: firstPrompt.slice(0, 34),
        updatedAt: Date.now(),
        messages,
      }
      return [conversation, ...previous.filter((item) => item.id !== currentId)]
    })
  }, [messages, currentId])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, phase])

  useEffect(() => {
    if (phase === 'thinking') {
      const timer = window.setInterval(() => {
        setProgress((value) => {
          return Math.min(value + 1, 30)
        })
      }, 250)
      return () => window.clearInterval(timer)
    }

    if (phase === 'answering') {
      const words = fullAnswer.split(' ')
      const timer = window.setInterval(() => {
        setWordCursor((cursor) => {
          const next = Math.min(cursor + 1, words.length)
          const content = words.slice(0, next).join(' ')
          setMessages((items) =>
            items.map((item, index) =>
              index === items.length - 1 && item.role === 'assistant'
                ? { ...item, content, complete: next === words.length }
                : item,
            ),
          )
          setProgress(35 + Math.round((next / words.length) * 65))
          if (next === words.length) setPhase('idle')
          return next
        })
      }, 38)
      return () => window.clearInterval(timer)
    }
  }, [phase, fullAnswer])

  useEffect(() => {
    if (imageStatus !== 'generating') return
    const timer = window.setInterval(() => {
      setImageProgress((value) => {
        const next = Math.min(value + 4, 100)
        if (next === 100) {
          setGeneratedImage(createArtwork(imagePrompt, variation))
          setImageStatus('complete')
        }
        return next
      })
    }, 90)
    return () => window.clearInterval(timer)
  }, [imageStatus, imagePrompt, variation])

  const startResponse = async (prompt: string, addUser = true, files: Attachment[] = []) => {
    if (!historyLoaded || phase !== 'idle') return
    setChatError('')
    setActivePrompt(prompt)
    setFullAnswer('')
    setWordCursor(0)
    setProgress(5)
    setPhase('thinking')
    setCopied(false)
    const previousMessages = messages.filter((item) => item.complete !== false)
    if (!addUser && previousMessages.at(-1)?.role === 'assistant') {
      previousMessages.pop()
    }
    const newUserMessages: Message[] = addUser
      ? [
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: prompt,
            complete: true,
            attachments: files,
          },
        ]
      : []
    const newMessages: Message[] = [
      ...previousMessages,
      ...newUserMessages,
      { id: crypto.randomUUID(), role: 'assistant', content: '', complete: false },
    ]
    setMessages(newMessages)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: (() => {
            const history = newMessages.slice(0, addUser ? -2 : -1)
            if (!addUser && history.at(-1)?.role === 'user') history.pop()
            return history.map(({ role, content }) => ({ role, content }))
          })(),
          images: files.flatMap((file) => (file.preview ? [{ dataUrl: file.preview }] : [])),
        }),
      })
      const result = (await response.json()) as { answer?: string; error?: string }
      if (!response.ok || !result.answer) {
        throw new Error(result.error || 'The AI service could not answer right now.')
      }

      const completeMessages = newMessages.map((item, index) =>
        index === newMessages.length - 1
          ? { ...item, content: result.answer!, complete: true }
          : item,
      )
      const storedMessages = completeMessages.map(
        ({ id, role, content, complete, attachments: attached }) => ({
          id,
          role,
          content,
          complete,
          attachments: attached?.map(({ id: attachmentId, name, type, size }) => ({
            id: attachmentId,
            name,
            type,
            size,
          })),
        }),
      )
      const saveResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentId, messages: storedMessages }),
      })
      const saveResult = (await saveResponse.json()) as { error?: string }
      if (!saveResponse.ok) {
        setChatError(saveResult.error || 'Your answer was generated but could not be saved.')
      }

      const conversation: Conversation = {
        id: currentId,
        title: (completeMessages.find((item) => item.role === 'user')?.content || prompt).slice(
          0,
          34,
        ),
        updatedAt: Date.now(),
        messages: completeMessages,
      }
      setConversations((items) => [conversation, ...items.filter((item) => item.id !== currentId)])
      setFullAnswer(result.answer)
      setProgress(35)
      setPhase('answering')
    } catch (error) {
      setMessages((items) => items.filter((item) => item.complete !== false))
      setChatError(
        error instanceof Error ? error.message : 'The AI service could not answer right now.',
      )
      setPhase('idle')
      setProgress(0)
    }
  }

  const submitMessage = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = message.trim()
    if ((!trimmed && !attachments.length) || phase !== 'idle' || !historyLoaded) return
    const prompt = trimmed || 'Please review the attached file.'
    setMessage('')
    startResponse(prompt, true, attachments)
    setAttachments([])
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    ;[...files].slice(0, 4 - attachments.length).forEach((file) => {
      if (
        !['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type) ||
        file.size > 1_500_000
      ) {
        setChatError('Attach PNG, JPEG, GIF, or WebP images under 1.5 MB each.')
        return
      }
      setChatError('')
      const base = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
      }
      const reader = new FileReader()
      reader.onload = () =>
        setAttachments((items) => [...items, { ...base, preview: String(reader.result) }])
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const generateImage = (event?: FormEvent) => {
    event?.preventDefault()
    if (!imagePrompt.trim() || imageStatus === 'generating') return
    setImageProgress(3)
    setGeneratedImage('')
    setImageStatus('generating')
  }

  const newChat = () => {
    if (phase !== 'idle') return
    setChatError('')
    setCurrentId(crypto.randomUUID())
    setMessages([])
    setActivePrompt('')
    setProgress(0)
    setSidebarOpen(false)
    setView('chat')
  }

  const openConversation = (conversation: Conversation) => {
    if (phase !== 'idle') return
    setChatError('')
    setCurrentId(conversation.id)
    setMessages(conversation.messages)
    const lastPrompt = [...conversation.messages].reverse().find((item) => item.role === 'user')
    setActivePrompt(lastPrompt?.content || '')
    setSidebarOpen(false)
    setView('chat')
  }

  const useDiscoverPrompt = (prompt: string, image = false) => {
    if (phase !== 'idle') return
    if (image) {
      setImagePrompt(prompt)
      setView('image')
    } else {
      newChat()
      setMessage(prompt)
    }
  }

  const retry = () => {
    if (!activePrompt || phase !== 'idle') return
    void startResponse(activePrompt, false)
  }

  const setRating = (rating: Rating) => {
    setMessages((items) =>
      items.map((item, index) =>
        index === items.length - 1 && item.role === 'assistant'
          ? { ...item, rating: item.rating === rating ? null : rating }
          : item,
      ),
    )
  }

  const lastAssistant = [...messages].reverse().find((item) => item.role === 'assistant')
  const isWorking = phase === 'thinking' || phase === 'answering' || phase === 'paused'
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const logout = async () => {
    setLoggingOut(true)
    const response = await fetch('/api/app-auth/logout', { method: 'POST' })
    if (!response.ok) {
      setLoggingOut(false)
      setChatError('Could not sign out. Please try again.')
      return
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f5f4ef] text-[#171817] selection:bg-[#d8f43c] selection:text-black">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-black/[0.07] bg-[#edebe5] px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-[11px] bg-[#171817] text-[#d8f43c]">
              <SparkleIcon className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[18px] font-semibold tracking-[-0.04em]">Luma</span>
          </div>
          <button
            aria-label="Close sidebar"
            className="grid h-8 w-8 place-items-center rounded-lg text-black/55 hover:bg-black/[0.06] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={newChat}
          disabled={isWorking || !historyLoaded}
          className="mt-7 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#171817] text-[14px] font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-40"
        >
          <PlusIcon className="h-[18px] w-[18px]" /> New chat
        </button>

        <nav className="mt-6 space-y-1">
          {[
            { label: 'Chats', icon: ChatIcon, target: 'chats' as const },
            { label: 'Discover', icon: CompassIcon, target: 'discover' as const },
            { label: 'Create image', icon: ImageIcon, target: 'image' as const },
          ].map(({ label, icon: ItemIcon, target }) => (
            <button
              key={label}
              onClick={() => {
                setView(target)
                setSidebarOpen(false)
              }}
              aria-current={target === view ? 'page' : undefined}
              className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[14px] transition ${target === view || (target === 'chats' && view === 'chat') ? 'bg-white/70 font-medium shadow-[0_1px_0_rgba(0,0,0,.03)]' : 'text-black/55 hover:bg-white/50 hover:text-black'}`}
            >
              <ItemIcon className="h-[18px] w-[18px]" /> {label}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-black/35">
          History
        </div>
        <div className="mt-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto">
          {!historyLoaded && (
            <p className="px-3 py-3 text-[12px] leading-relaxed text-black/35">
              Loading conversations…
            </p>
          )}
          {historyLoaded && conversations.length === 0 && (
            <p className="px-3 py-3 text-[12px] leading-relaxed text-black/35">
              Your conversations will appear here.
            </p>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => openConversation(conversation)}
              className={`group flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-[13px] transition ${currentId === conversation.id ? 'bg-white/60 font-medium text-black' : 'text-black/55 hover:bg-white/50 hover:text-black'}`}
            >
              <span className="truncate">{conversation.title}</span>
              <MoreIcon className="h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <div className="relative mt-4">
          {profileOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-full rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl shadow-black/10">
              <div className="border-b border-black/[0.06] px-3 py-2.5">
                <div className="truncate text-[11px] text-black/40">{user.email}</div>
              </div>
              <button
                className="mt-1 flex h-10 w-full items-center rounded-xl px-3 text-left text-[12px] font-medium text-black/60 hover:bg-black/[0.04] hover:text-black disabled:opacity-50"
                disabled={loggingOut}
                onClick={logout}
              >
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          )}
          <button
            className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-white/50"
            onClick={() => setProfileOpen((value) => !value)}
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#d8f43c] text-[12px] font-bold">
              {initials}
            </div>
            <div className="min-w-0 text-left">
              <div className="truncate text-[13px] font-medium">{user.name}</div>
              <div className="text-[11px] text-black/40">Free plan</div>
            </div>
            <MoreIcon className="ml-auto h-4 w-4 text-black/35" />
          </button>
        </div>
      </aside>

      <main className="flex h-screen flex-col lg:ml-[272px]">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-black/[0.05] px-4 sm:px-7">
          <button
            aria-label="Open sidebar"
            className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white/60 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="relative ml-auto lg:ml-0">
            <button
              className="flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium hover:bg-black/[0.04]"
              onClick={() => setModelOpen(!modelOpen)}
            >
              <span className="grid h-5 w-5 place-items-center rounded-md bg-[#171817] text-[#d8f43c]">
                <SparkleIcon className="h-3.5 w-3.5" />
              </span>
              {view === 'image'
                ? 'Image demo'
                : view === 'chats'
                  ? 'Your chats'
                  : view === 'discover'
                    ? 'Discover'
                    : model}
              {view === 'chat' && <ChevronIcon className="h-4 w-4 text-black/40" />}
            </button>
            {modelOpen && view === 'chat' && (
              <div className="absolute left-0 top-11 z-20 w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl shadow-black/10">
                {['Luma · Gemini 3.5 Flash'].map((item) => (
                  <button
                    key={item}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-[13px] hover:bg-black/[0.04] ${item === model ? 'font-semibold' : 'text-black/60'}`}
                    onClick={() => {
                      setModel(item)
                      setModelOpen(false)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            aria-label="New conversation"
            onClick={newChat}
            className="grid h-10 w-10 place-items-center rounded-xl text-black/60 hover:bg-black/[0.05]"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </header>

        {view === 'chats' ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/35">
                    Your workspace
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight">
                    Every conversation, one place.
                  </h1>
                  <p className="mt-3 text-sm text-black/45">
                    Pick up a thought right where you left it.
                  </p>
                </div>
                <button
                  disabled={isWorking}
                  onClick={newChat}
                  className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-40"
                >
                  <PlusIcon className="h-4 w-4" /> New chat
                </button>
              </div>
              <label className="mt-8 flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                <ChatIcon className="h-5 w-5 text-black/35" />
                <input
                  aria-label="Search conversations"
                  value={chatSearch}
                  onChange={(event) => setChatSearch(event.target.value)}
                  placeholder="Search titles or messages…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
                />
              </label>
              <div className="mb-3 mt-7 flex items-center justify-between text-xs text-black/40">
                <span>
                  {conversations.length}{' '}
                  {conversations.length === 1 ? 'conversation' : 'conversations'} · saved to your
                  account
                </span>
                <span>Most recent first</span>
              </div>
              <div className="space-y-3">
                {[...conversations]
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .filter((chat) =>
                    `${chat.title} ${chat.messages.map((item) => item.content).join(' ')}`
                      .toLowerCase()
                      .includes(chatSearch.toLowerCase().trim()),
                  )
                  .map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => openConversation(chat)}
                      disabled={isWorking}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-black/10 bg-white/50 p-5 text-left transition hover:border-black/20 hover:bg-white disabled:opacity-50"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/5">
                        <ChatIcon className="h-5 w-5 text-black/50" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{chat.title}</span>
                        <span className="mt-1 block truncate text-xs text-black/45">
                          {chat.messages.at(-1)?.content || 'Open this conversation'}
                        </span>
                        <span className="mt-3 block text-xs text-black/35">
                          {new Date(chat.updatedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          · {chat.messages.length} messages
                        </span>
                      </span>
                      <span className="text-xs font-medium text-black/40 group-hover:text-black">
                        Open →
                      </span>
                    </button>
                  ))}
                {!conversations.some((chat) =>
                  `${chat.title} ${chat.messages.map((item) => item.content).join(' ')}`
                    .toLowerCase()
                    .includes(chatSearch.toLowerCase().trim()),
                ) && (
                  <div className="rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
                    <ChatIcon className="mx-auto h-8 w-8 text-black/25" />
                    <h2 className="mt-4 text-lg font-semibold">
                      {conversations.length
                        ? 'No matching conversations'
                        : 'Your next great idea starts here'}
                    </h2>
                    <p className="mt-2 text-sm text-black/45">
                      {conversations.length
                        ? 'Try a different word or clear your search.'
                        : 'Start a chat and it will appear here, ready to revisit.'}
                    </p>
                    <button
                      onClick={() => (conversations.length ? setChatSearch('') : newChat())}
                      className="mt-5 rounded-xl bg-black px-4 py-2.5 text-sm text-white"
                    >
                      {conversations.length ? 'Clear search' : 'Start your first chat'}
                    </button>
                  </div>
                )}
              </div>
              {isWorking && (
                <p role="status" className="mt-4 text-xs text-black/45">
                  An answer is still in progress. Finish or resume it before opening another chat.
                </p>
              )}
            </section>
          </div>
        ) : view === 'discover' ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/35">
                A little inspiration
              </p>
              <h1 className="text-4xl font-semibold tracking-tight">Find your next spark.</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/45">
                You don’t need the perfect question. Explore a possibility, choose a prompt, and
                make it your own.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  disabled={isWorking}
                  onClick={() =>
                    useDiscoverPrompt(
                      'Help me turn a rough idea into a practical project plan. Ask me a few questions to get started.',
                    )
                  }
                  className="rounded-2xl bg-stone-900 p-6 text-left text-white transition hover:bg-black disabled:opacity-40"
                >
                  <SparkleIcon className="mb-7 h-7 w-7 text-lime-300" />
                  <span className="block text-xl font-semibold tracking-tight">
                    Think it through, together.
                  </span>
                  <span className="mt-2 block text-sm text-white/50">
                    From a first thought to a clear next step.
                  </span>
                  <span className="mt-5 block text-xs font-medium text-lime-300">
                    Explore with Luma →
                  </span>
                </button>
                <button
                  disabled={isWorking}
                  onClick={() => useDiscoverPrompt(imagePrompts[0], true)}
                  className="rounded-2xl border border-black/10 bg-lime-100 p-6 text-left transition hover:bg-lime-200 disabled:opacity-40"
                >
                  <ImageIcon className="mb-7 h-7 w-7 text-black/60" />
                  <span className="block text-xl font-semibold tracking-tight">
                    Give your imagination a canvas.
                  </span>
                  <span className="mt-2 block text-sm text-black/50">
                    Explore the image creation demo with a sample scene.
                  </span>
                  <span className="mt-5 block text-xs font-medium">Try image creation →</span>
                </button>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  A starting point for anything
                </h2>
                <span className="text-xs text-black/35">Curated sample prompts</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Prompt categories">
                {['All', 'Writing', 'Productivity', 'Learning', 'Creative'].map((category) => (
                  <button
                    key={category}
                    aria-pressed={category === discoverCategory}
                    onClick={() => setDiscoverCategory(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${category === discoverCategory ? 'border-black bg-black text-white' : 'border-black/10 bg-white/40 text-black/50 hover:bg-white'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    category: 'Writing',
                    title: 'Find the right words',
                    detail: 'Draft something that sounds like you.',
                    prompt:
                      'Help me write a warm and concise launch announcement for a new product.',
                  },
                  {
                    category: 'Productivity',
                    title: 'Make a plan that sticks',
                    detail: 'Turn an ambitious goal into small steps.',
                    prompt:
                      'Create a practical project plan for launching a personal portfolio website.',
                  },
                  {
                    category: 'Learning',
                    title: 'Make the complex feel simple',
                    detail: 'Learn a new concept, one layer at a time.',
                    prompt:
                      'Explain how machine learning works to a beginner, using everyday examples.',
                  },
                  {
                    category: 'Creative',
                    title: 'Look at it differently',
                    detail: 'Find fresh directions for familiar challenges.',
                    prompt:
                      'Brainstorm five creative ways to make a remote team feel more connected.',
                  },
                  {
                    category: 'Writing',
                    title: 'Polish your first draft',
                    detail: 'Clearer, sharper, and easier to read.',
                    prompt:
                      'Help me make a piece of writing more concise. Ask me to paste my draft.',
                  },
                  {
                    category: 'Learning',
                    title: 'Build a learning habit',
                    detail: 'A little progress, every single day.',
                    prompt:
                      'Create a four-week learning plan for a new skill with 20 minutes of practice a day. Ask me which skill first.',
                  },
                ]
                  .filter(
                    (item) => discoverCategory === 'All' || item.category === discoverCategory,
                  )
                  .map((item) => (
                    <button
                      key={item.title}
                      disabled={isWorking}
                      onClick={() => useDiscoverPrompt(item.prompt)}
                      className="group rounded-2xl border border-black/10 bg-white/50 p-5 text-left transition hover:-translate-y-0.5 hover:bg-white disabled:translate-y-0 disabled:opacity-40"
                    >
                      <span className="text-xs font-medium text-black/35">{item.category}</span>
                      <span className="mt-4 block text-base font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm text-black/45">{item.detail}</span>
                      <span className="mt-5 block text-xs font-medium text-black/50 group-hover:text-black">
                        Use this prompt →
                      </span>
                    </button>
                  ))}
              </div>
              {isWorking && (
                <p role="status" className="mt-4 text-xs text-black/45">
                  Finish the current answer before starting something new.
                </p>
              )}
              <p className="mt-8 text-xs leading-relaxed text-black/35">
                Prompts open as editable drafts. Chat responses and image creation are currently
                simulated.
              </p>
            </section>
          </div>
        ) : view === 'image' ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <section className="mx-auto w-full max-w-[1040px] px-5 py-10 sm:px-8 sm:py-14">
              <div className="mb-9 max-w-2xl">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#171817] text-[#d8f43c] shadow-[0_8px_24px_rgba(0,0,0,.12)]">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.055em] sm:text-[50px]">
                  Create what you imagine.
                  <span className="block text-black/35">Describe it in your own words.</span>
                </h1>
              </div>

              <div className="grid items-start gap-5 lg:grid-cols-[.82fr_1.18fr]">
                <div className="rounded-[24px] border border-black/[0.08] bg-white/60 p-4 shadow-[0_12px_35px_rgba(34,34,25,.05)]">
                  <form onSubmit={generateImage}>
                    <label
                      htmlFor="image-prompt"
                      className="mb-2.5 block text-[12px] font-semibold"
                    >
                      Describe your image
                    </label>
                    <textarea
                      id="image-prompt"
                      rows={6}
                      className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white px-3.5 py-3 text-[14px] leading-relaxed outline-none placeholder:text-black/25 focus:border-black/20"
                      placeholder="A serene cabin surrounded by wildflowers, soft morning light, editorial photography…"
                      value={imagePrompt}
                      onChange={(event) => setImagePrompt(event.target.value)}
                    />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-black/[0.035] px-3 py-2.5">
                        <div className="text-[10px] uppercase tracking-[0.1em] text-black/30">
                          Style
                        </div>
                        <div className="mt-1 text-[12px] font-medium">Cinematic</div>
                      </div>
                      <div className="rounded-xl bg-black/[0.035] px-3 py-2.5">
                        <div className="text-[10px] uppercase tracking-[0.1em] text-black/30">
                          Format
                        </div>
                        <div className="mt-1 text-[12px] font-medium">4:3 landscape</div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!imagePrompt.trim() || imageStatus === 'generating'}
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171817] text-[13px] font-semibold text-white transition hover:bg-black disabled:bg-black/10 disabled:text-black/25"
                    >
                      <SparkleIcon className="h-4 w-4" />
                      {imageStatus === 'generating'
                        ? 'Creating…'
                        : generatedImage
                          ? 'Create another'
                          : 'Create image'}
                    </button>
                  </form>

                  <div className="mt-6">
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-black/30">
                      Try a prompt
                    </p>
                    <div className="space-y-1.5">
                      {imagePrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setImagePrompt(prompt)}
                          className="w-full rounded-xl border border-transparent px-3 py-2.5 text-left text-[12px] leading-relaxed text-black/50 transition hover:border-black/[0.06] hover:bg-white hover:text-black"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#e9e7e0] shadow-[0_16px_45px_rgba(34,34,25,.08)]">
                  <div className="relative aspect-[4/3]">
                    {generatedImage ? (
                      <img
                        src={generatedImage}
                        alt={imagePrompt}
                        className="h-full w-full object-cover"
                      />
                    ) : imageStatus === 'generating' ? (
                      <div className="absolute inset-0 overflow-hidden bg-[#252c36]">
                        <div className="image-shimmer absolute inset-0" />
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="w-64 text-center text-white">
                            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                              <SparkleIcon className="h-6 w-6 text-[#d8f43c]" />
                            </div>
                            <div className="text-[14px] font-medium">
                              Bringing your idea to life
                            </div>
                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                              <div
                                className="h-full rounded-full bg-[#d8f43c] transition-all duration-200"
                                style={{ width: `${imageProgress}%` }}
                              />
                            </div>
                            <div className="mt-2 text-[11px] text-white/45">
                              {imageProgress < 35
                                ? 'Interpreting your prompt'
                                : imageProgress < 75
                                  ? 'Building composition and light'
                                  : 'Adding final details'}{' '}
                              · {imageProgress}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#eeece5_45%,#dedbd2_100%)]">
                        <div className="max-w-[250px] text-center">
                          <ImageIcon className="mx-auto h-9 w-9 text-black/20" />
                          <p className="mt-4 text-[13px] font-medium text-black/45">
                            Your image will appear here
                          </p>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-black/30">
                            Describe a scene, mood, subject, or style to begin.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {generatedImage && (
                    <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] bg-white/70 px-4 py-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold">Image-generation demo</div>
                        <div className="mt-0.5 truncate text-[10px] text-black/35">
                          {imagePrompt}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          onClick={() => {
                            setVariation((value) => value + 1)
                            setImageProgress(3)
                            setImageStatus('generating')
                            setGeneratedImage('')
                          }}
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-2.5 text-[11px] font-medium hover:bg-black/[0.03]"
                        >
                          <RetryIcon className="h-3.5 w-3.5" /> Variation
                        </button>
                        <a
                          href={generatedImage}
                          download="luma-creation.svg"
                          aria-label="Download image"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-[#171817] text-white hover:bg-black"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <section className="mx-auto flex min-h-full w-full max-w-[820px] flex-col justify-center px-5 py-12 sm:px-8">
                  <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-[#171817] text-[#d8f43c] shadow-[0_8px_24px_rgba(0,0,0,.12)]">
                    <SparkleIcon className="h-6 w-6" />
                  </div>
                  <h1 className="max-w-xl text-[38px] font-semibold leading-[1.08] tracking-[-0.055em] sm:text-[50px]">
                    Where should we start?
                    <span className="block text-black/35">Ask, create, or explore.</span>
                  </h1>
                  <div className="mt-10 grid gap-2.5 sm:grid-cols-3">
                    {starterPrompts.map((item, index) => (
                      <button
                        key={item.label}
                        onClick={() => startResponse(item.prompt)}
                        className="group min-h-[132px] rounded-2xl border border-black/[0.07] bg-white/45 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,.05)]"
                      >
                        <div
                          className={`mb-5 grid h-7 w-7 place-items-center rounded-lg text-[12px] font-bold ${item.tone}`}
                        >
                          {index + 1}
                        </div>
                        <div className="text-[14px] font-semibold">{item.label}</div>
                        <div className="mt-1 text-[12px] leading-relaxed text-black/40">
                          {item.detail}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="mx-auto w-full max-w-[820px] px-5 py-10 sm:px-8 sm:py-14">
                  <div className="space-y-9">
                    {messages.map((item, index) => (
                      <div key={item.id}>
                        {item.role === 'user' ? (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#171817] px-4 py-3 text-[14px] leading-relaxed text-white sm:max-w-[70%]">
                              {!!item.attachments?.length && (
                                <div className="mb-3 grid gap-2">
                                  {item.attachments.map((file) => (
                                    <div
                                      key={file.id}
                                      className="flex items-center gap-2.5 rounded-xl bg-white/10 p-2"
                                    >
                                      {file.preview ? (
                                        <img
                                          src={file.preview}
                                          alt=""
                                          className="h-10 w-10 rounded-lg object-cover"
                                        />
                                      ) : (
                                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                                          <FileIcon className="h-5 w-5 text-white/70" />
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <div className="truncate text-[11px] font-medium">
                                          {file.name}
                                        </div>
                                        <div className="mt-0.5 text-[9px] text-white/40">
                                          {Math.max(1, Math.round(file.size / 1024))} KB
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {item.content}
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3.5">
                            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#171817] text-[#d8f43c]">
                              <SparkleIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              {!item.content && index === messages.length - 1 && (
                                <div className="py-1">
                                  <div className="mb-2 flex items-center gap-2 text-[13px] font-medium">
                                    <span className="flex gap-1">
                                      <i className="thinking-dot" />
                                      <i className="thinking-dot" />
                                      <i className="thinking-dot" />
                                    </span>
                                    Thinking through your request
                                  </div>
                                  <p className="text-[12px] text-black/40">
                                    Considering context and shaping a useful response…
                                  </p>
                                </div>
                              )}
                              {item.content && (
                                <div className="answer-content whitespace-pre-wrap text-[15px] leading-[1.78] text-black/80">
                                  {item.content}
                                  {!item.complete && index === messages.length - 1 && (
                                    <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-full bg-black/50 align-middle" />
                                  )}
                                </div>
                              )}

                              {item.complete && (
                                <div className="mt-4 flex items-center gap-1 text-black/35">
                                  <button
                                    aria-label="Copy answer"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.content)
                                      setCopied(true)
                                    }}
                                    className="grid h-8 w-8 place-items-center rounded-lg hover:bg-black/[0.05] hover:text-black"
                                  >
                                    {copied && index === messages.length - 1 ? (
                                      <CheckIcon className="h-4 w-4" />
                                    ) : (
                                      <CopyIcon className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    aria-label="Good answer"
                                    onClick={() => setRating('up')}
                                    className={`grid h-8 w-8 place-items-center rounded-lg hover:bg-black/[0.05] hover:text-black ${item.rating === 'up' ? 'bg-[#d8f43c]/50 text-black' : ''}`}
                                  >
                                    <ThumbUpIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    aria-label="Poor answer"
                                    onClick={() => setRating('down')}
                                    className={`grid h-8 w-8 place-items-center rounded-lg hover:bg-black/[0.05] hover:text-black ${item.rating === 'down' ? 'bg-rose-100 text-rose-700' : ''}`}
                                  >
                                    <ThumbDownIcon className="h-4 w-4" />
                                  </button>
                                  {index === messages.length - 1 && (
                                    <button
                                      onClick={retry}
                                      className="ml-1 flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium hover:bg-black/[0.05] hover:text-black"
                                    >
                                      <RetryIcon className="h-3.5 w-3.5" /> Retry
                                    </button>
                                  )}
                                  {item.rating && (
                                    <span className="ml-2 text-[11px] text-black/35">
                                      Thanks for the feedback
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isWorking && (
                    <div className="ml-0 mt-7 rounded-2xl border border-black/[0.07] bg-white/60 p-3.5 sm:ml-[46px]">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative grid h-8 w-8 shrink-0 place-items-center">
                            <svg className="-rotate-90" viewBox="0 0 32 32">
                              <circle
                                cx="16"
                                cy="16"
                                r="13"
                                fill="none"
                                stroke="rgba(0,0,0,.08)"
                                strokeWidth="3"
                              />
                              <circle
                                cx="16"
                                cy="16"
                                r="13"
                                fill="none"
                                stroke="#171817"
                                strokeWidth="3"
                                strokeDasharray="82"
                                strokeDashoffset={82 - (82 * progress) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-200"
                              />
                            </svg>
                            <span className="absolute text-[8px] font-bold">{progress}%</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold">
                              {phase === 'paused'
                                ? 'Response paused'
                                : phase === 'thinking'
                                  ? 'Understanding your request'
                                  : 'Writing the answer'}
                            </div>
                            <div className="mt-0.5 truncate text-[11px] text-black/35">
                              {phase === 'paused'
                                ? 'Continue whenever you’re ready'
                                : phase === 'thinking'
                                  ? 'Reviewing context and planning'
                                  : 'Generating section by section'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (phase === 'paused') setPhase(pausedFrom)
                            else {
                              setPausedFrom(phase as 'thinking' | 'answering')
                              setPhase('paused')
                            }
                          }}
                          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 text-[11px] font-medium hover:bg-black/[0.03]"
                        >
                          {phase === 'paused' ? (
                            <>
                              <PlayIcon className="h-3.5 w-3.5" /> Continue
                            </>
                          ) : (
                            <>
                              <PauseIcon className="h-3.5 w-3.5" /> Pause
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {phase === 'idle' && lastAssistant?.complete && (
                    <div className="ml-0 mt-8 sm:ml-[46px]">
                      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-black/30">
                        Continue the conversation
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {followUps.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => startResponse(prompt)}
                            className="rounded-xl border border-black/[0.08] bg-white/50 px-3 py-2 text-[12px] text-black/60 transition hover:border-black/15 hover:bg-white hover:text-black"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </section>
              )}
            </div>

            <footer className="shrink-0 bg-gradient-to-t from-[#f5f4ef] via-[#f5f4ef] to-transparent px-4 pb-4 pt-3 sm:px-7 sm:pb-5">
              <form onSubmit={submitMessage} className="mx-auto max-w-[820px]">
                <div className="rounded-[22px] border border-black/[0.09] bg-white p-2.5 shadow-[0_14px_40px_rgba(34,34,25,.08)] focus-within:border-black/20">
                  {!!attachments.length && (
                    <div className="flex gap-2 overflow-x-auto px-2 pb-2">
                      {attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex max-w-[190px] shrink-0 items-center gap-2 rounded-xl bg-black/[0.045] p-1.5 pr-2"
                        >
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt=""
                              className="h-9 w-9 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white">
                              <FileIcon className="h-4 w-4 text-black/45" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="truncate text-[10px] font-medium">{file.name}</div>
                            <div className="text-[9px] text-black/35">
                              {Math.max(1, Math.round(file.size / 1024))} KB
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${file.name}`}
                            onClick={() =>
                              setAttachments((items) => items.filter((item) => item.id !== file.id))
                            }
                            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-black/35 hover:bg-black/[0.06] hover:text-black"
                          >
                            <CloseIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    aria-label="Message Luma"
                    rows={messages.length ? 1 : 2}
                    className="max-h-36 min-h-[42px] w-full resize-none bg-transparent px-2.5 py-2 text-[14px] leading-relaxed outline-none placeholder:text-black/30"
                    placeholder={
                      phase === 'paused' ? 'Resume the answer to keep chatting…' : 'Message Luma…'
                    }
                    value={message}
                    disabled={isWorking}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        event.currentTarget.form?.requestSubmit()
                      }
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      onChange={(event) => addFiles(event.target.files)}
                    />
                    <button
                      type="button"
                      aria-label="Attach file"
                      disabled={isWorking || attachments.length >= 4}
                      onClick={() => fileInputRef.current?.click()}
                      className="grid h-9 w-9 place-items-center rounded-xl text-black/40 hover:bg-black/[0.05] hover:text-black disabled:opacity-30"
                    >
                      <PaperclipIcon className="h-[18px] w-[18px]" />
                    </button>
                    <button
                      type="submit"
                      aria-label="Send message"
                      disabled={(!message.trim() && !attachments.length) || isWorking}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-[#171817] text-white transition hover:scale-[1.03] disabled:bg-black/10 disabled:text-black/25"
                    >
                      <ArrowIcon className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>
                {chatError && (
                  <p
                    aria-live="polite"
                    className="mx-auto mt-2 max-w-[820px] rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700"
                  >
                    {chatError}
                  </p>
                )}
                <p className="mt-2 text-center text-[10px] text-black/25">
                  Luma can make mistakes. Check important information.
                </p>
              </form>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
