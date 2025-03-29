import { atom } from 'jotai'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: string
  createdAt: number
}

export interface ChatSession {
  id: string
  title: string
  model: string
  messages: ChatMessage[]
  createdAt: number
}

export const chatSessionsAtom = atom<ChatSession[]>([])
export const activeSessionIdAtom = atom<string | null>(null)