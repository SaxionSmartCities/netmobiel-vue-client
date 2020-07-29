export class UiState {
  header: UiHeader | null = null
  footer: UiFooter | null = null
  backButtonVisible: boolean | null = false
  notificationBarVisible: boolean | null = false
  notificationQueue: UiNotification[] | null = null
  updateMessages: UiUpdateMessage[] | null = null
}

export interface UiHeader {
  visible: boolean
}

export interface UiFooter {
  visible: boolean
  selectedNav: string
}

export interface UiNotification {
  message: string
  timeout: number
}

export interface UiUpdateMessage {
  title: string
  content: string
  link: UiUpdateMessageLink
}

export interface UiUpdateMessageLink {
  label: string
  to: string
}
