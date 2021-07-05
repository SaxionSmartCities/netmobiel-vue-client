export class UiState {
  header: UiHeader = {
    visible: true,
  }
  footer: UiFooter = { selectedNav: '', visible: true }
  backButtonVisible: boolean = false
  notificationBarVisible: boolean = false
  notificationQueue: UiNotification[] = []
  updateMessages: UiUpdateMessage[] = []
  networkRequest: NetworkRequest = {}
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

export interface NetworkRequest {
  location?: string
  method?: string
  submitStatus?: SubmitStatus
}

export interface SubmitStatus {
  status: NetworkRequestStatus
  statusCode?: number
  message?: string
}

export enum NetworkRequestStatus {
  UNSUBMITTED = 'UNSUBMITTED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
