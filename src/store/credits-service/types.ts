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
<<<<<<< HEAD

export interface User {
  readonly credits: number
  readonly email: string
  readonly familyName: string
  readonly givenName: string
  readonly id: number
  readonly managedIdentity: string
}
=======
>>>>>>> e0b6db38e035798bdbde8821cf447a48c58cc6ed
