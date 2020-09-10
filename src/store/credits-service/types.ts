export class CreditsState {
  exchangeRate: number = 0
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
