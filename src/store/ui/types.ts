export class UiState implements UiState {}

export interface UiState {
  header: UiHeader
  footer: UiFooter
  backButtonVisible: boolean
  notificationBarVisible: boolean
  notificationQueue: UiNotification[]
  updateMessages: UiUpdateMessage[]
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
