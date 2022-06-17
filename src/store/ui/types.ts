export class UiState {
  header: UiHeader = {
    visible: true,
  }
  footer: UiFooter = { selectedNav: '', visible: true }
  backButtonVisible: boolean = false
  notificationBarVisible: boolean = false
  notificationQueue: UiNotification[] = []
  updateMessages: UiUpdateMessage[] = []
  // Marks the completion of the initial loading in App.vue
  appLoaded: boolean = false
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
  // Optional ID of the message
  // Otherwise the object itself is used as ID
  id?: string
  title: string
  content: string
  link: UiUpdateMessageLink
}

export interface UiUpdateMessageLink {
  label: string
  // Internal link
  to?: string
  // external link
  href?: string
  // notification callback
  notification?: () => Promise<void>
}
