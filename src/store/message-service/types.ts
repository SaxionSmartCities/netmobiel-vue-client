import { emptyPage } from '@/store/storeHelper'
import { Page } from '@/store/types'

export class MessageState {
  actualConversations: Page<Conversation> = emptyPage
  archivedConversations: Page<Conversation> = emptyPage
  conversation: Conversation | null = null
  messages: Page<Message> = emptyPage
  user: CommunicatorUser | null = null
}

export interface Message {
  body: string | null
  context: string
  createdTime: string | null
  deliveryMode: string
  envelopes?: Envelope[]
  id?: number
  sender: CommunicatorUser | null
  senderContext?: string | null
  senderConversationRef?: string
}

export interface Envelope {
  ackTime: string | null
  pushTime: string | null
  context: string
  recipient: CommunicatorUser
  conversationRef?: string
}

export interface Conversation {
  archivedTime?: string
  contexts: string[]
  conversationRef?: string
  createdTime?: string
  id?: number
  owner?: CommunicatorUser
  ownerRole?: string
  // Only present after inbox query
  recentMessage?: Message
  topic?: string
  // Only present after inbox query
  unreadCount?: number
}

export interface CommunicatorUser {
  id?: number
  countryCode?: string
  email?: string
  familyName?: string
  givenName?: string
  managedIdentity: string
  phoneNumber?: string
  // Only present and/or valid after certain calls
  unreadMessageCount?: number
}
