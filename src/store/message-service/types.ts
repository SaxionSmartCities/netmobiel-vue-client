export class MessageState {
  actualConversations: Conversation[] = []
  archivedConversations: Conversation[] = []
  conversation: Conversation = {}
  messages: Message[] = []
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
}

export interface CommunicationUser {
  id?: number
  email?: string
  familyName?: string
  givenName?: string
  managedIdentity: string
}
