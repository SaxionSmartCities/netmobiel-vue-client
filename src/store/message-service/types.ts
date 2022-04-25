import { emptyPage } from '@/store/storeHelper'
import { Page } from '@/store/types'

export class MessageState {
  actualConversations: Page<Conversation> = emptyPage
  archivedConversations: Page<Conversation> = emptyPage
  conversation: Conversation | null = null
  messages: Page<Message> = emptyPage
}

export interface Message {
  body: string | null
  context: string
  createdTime: string | null
  deliveryMode: string
  envelopes?: Envelope[]
  id?: number
  sender: CommunicationUser | null
  senderConversationRef?: string
  subject?: string
}

export interface Envelope {
  ackTime: string | null
  pushTime: string | null
  context: string
  recipient: CommunicationUser
  conversationRef?: string
}

export interface Conversation {
  id?: number
  conversationRef?: string
  topic?: string
  contexts?: string[]
  recentMessage?: Message
  createdTime?: string
  archivedTime?: string
  owner?: CommunicationUser
  ownerRole?: string
}

export interface CommunicationUser {
  id?: number
  email?: string
  familyName?: string
  givenName?: string
  managedIdentity: string
}
