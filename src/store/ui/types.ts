export class UiState {
  header: UiHeader = {
    visible: false,
  }
  footer: UiFooter = { selectedNav: '', visible: false }
  backButtonVisible: boolean = false
  notificationBarVisible: boolean = false
  notificationQueue: UiNotification[] = []
  updateMessages: UiUpdateMessage[] = []
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
