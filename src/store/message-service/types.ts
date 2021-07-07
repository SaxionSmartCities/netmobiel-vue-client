export class MessageState {
  conversations: any[] = []
  messages: Map<string, any[]> = new Map()
  contexts: string[] = []
  activeMessages: any[] = []
}

export interface Message {
  // body: string | null
  // context: string
  // creationTime: Date | null
  // deliveryMode: string
  // envelopes: Envelope[] | null
  // id: number
  // sender: CommunicationUser | null
  // subject: string | null
}

export interface Envelope {
  ackTime: Date | null
  pushTime: Date | null
  recipient: CommunicationUser
}

export interface Conversation extends Message {}

export interface CommunicationUser {
  id: number | null
  email: string | null
  familyName: string | null
  givenName: string | null
  managedIdentity: string
}
