export class MessageState {
  conversations: any[] = []
  messages: Map<string, Message[]> = new Map()
  contexts: any[] = []
  activeMessages: any[] = []
}

export interface Message {}

export interface Conversation {}
