import { Page } from '@/store/types'

export class BankerState {
  withdrawals: Withdrawal[] = []
  charities: Charity[] = []
  charitySearchResults: Charity[] = []
  charity: Charity | null = null
  charityDonations: Donation[] = []
  previouslyDonatedCharities: Charity[] = []
  topDonors: Donor[] = []
  settings: Settings | null = null
  user: User | null = null
  statements: Page<Statement> | null = null
  systemAccounts: Page<Account> | null = null
}

export interface Charity {
  id: string
  urn: string
  name: string
  description: string
  goalAmount: number
  donatedAmount: number
  location: {
    label: string
    latitude: string
    longitude: string
  }
  imageUrl: string
  campaignStartTime: Date
  campaignEndTime: Date
  donorCount?: number
  account?: Account
}

export interface Donation {
  donor: {
    id: string
    firstName: string
    lastName: string
  } | null
  donorRef: string | null
  charity?: Charity
  charityRef: string
  credits: number
  message: string
  isAnonymous: boolean
  published: Date
}

export interface Donor {
  totalDonated: number
  user: User
}

export interface User {
  readonly managedIdentity: string
  readonly firstName: string
  readonly lastName: string
}

export interface Withdrawal {
  account: Account
  accountRef: string
  amountCredits: number
  amountEurocents: number
  createdBy: User
  creationTime: string
  description: string
  iban: string
  ibanHolder: string
  id: number
  modificationTime: string
  modifiedBy: User
  orderReference: string
  paymentBatchRef: string
  reason: string
  status: string
}

export interface Account {
  credits: number
  iban: string
  ibanHolder: string
  id: number
  name: string
  ncan: string
  purpose: string
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
  readonly rollback: boolean
}
