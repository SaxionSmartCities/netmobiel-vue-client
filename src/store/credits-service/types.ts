import { Page } from '../types'

export class CreditsState {
  //@ts-ignore: settings are set with fetch from backend
  settings: Settings = null
  //@ts-ignore: user is set with fetch from backend
  user: User = null
  //@ts-ignore: statements are set with fetch from backend
  statements: Page<Statement> = null
}

export interface Deposit {
  description: string
  amountCredits: number
  returnUrl: string
}

export interface OrderId {
  readonly order_id: string
  readonly project_id: string
}

export interface User {
  readonly credits: number
  readonly email: string
  readonly familyName: string
  readonly givenName: string
  readonly id: number
  readonly managedIdentity: string
}

export interface Settings {
  readonly exchangeRate: number
}

export interface Statement {
  readonly accountingTime: string
  readonly accountName: string
  readonly amount: number
  readonly context: string
  readonly counterparty: string
  readonly description: string
  readonly id: string
  readonly ncan: string
  readonly transactionTime: string
  readonly transactionType:
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'PAYMENT'
    | 'RESERVATION'
    | 'RELEASE'
  readonly type: 'DEBIT' | 'CREDIT'
}
