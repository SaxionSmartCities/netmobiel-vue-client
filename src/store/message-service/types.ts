export class MessageState {
  conversations: any[] = []
  messages: Map<string, Message[]> = new Map()
  contexts: string[] = []
  activeMessages: any[] = []
}

export interface Message {
  body: string | null
  context: string
  creationTime: Date | null
  deliveryMode: string
  envelopes?: Envelope[]
  id?: number
  sender: CommunicationUser | null
  subject?: string
}

export interface Envelope {
  ackTime: Date | null
  pushTime: Date | null
  recipient: CommunicationUser
}

export interface Conversation extends Message {}

export interface CommunicationUser {
  id?: number
  email?: string
  familyName?: string
  givenName?: string
  managedIdentity: string
}
