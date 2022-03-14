import { Page } from '@/store/types'

export class BankerState {
  withdrawals: Withdrawal[] = []
  charities: Charity[] = []
  popularCharities: Charity[] = []
  charitySearchResults: Charity[] = []
  charity: Charity | null = null
  charityDonations: Donation[] = []
  previouslyDonatedCharities: Charity[] = []
  topDonors: User[] = []
  settings: Settings | null = null
  user: User | null = null
  statements: Page<Statement> | null = null
  systemAccounts: Page<Account> = {
    offset: 0,
    count: 0,
    totalCount: 0,
    data: [],
  }
}

export interface Location {
  label?: string
  latitude: number
  longitude: number
}

export interface User {
  // Only optionally present when user record is fetched
  readonly email?: string
  readonly familyName: string
  readonly givenName: string
  readonly id: number
  readonly managedIdentity: string
  // Only defined when the user record is fetched
  readonly personalAccount?: Account
  // Only defined when the user record is fetched
  readonly premiumAccount?: Account
  // Only present in the results of the user generosity report
  readonly donatedCredits?: number
}

export interface Settings {
  readonly exchangeRate: number
}

export interface Statement {
  readonly account: Account
  readonly accountingTime: string
  readonly amount: number
  readonly context: string
  readonly counterparty: Account
  readonly description: string
  readonly id: string
  readonly rollback: boolean
  readonly transactionTime: string
  readonly transactionType:
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'PAYMENT'
    | 'REFUND'
    | 'RESERVATION'
    | 'RELEASE'
  readonly type: 'DEBIT' | 'CREDIT'
}

export interface Charity {
  id: string
  urn: string
  name: string
  description: string
  goalAmount: number
  donatedAmount: number
  location?: Location
  imageUrl?: string
  campaignStartTime: Date
  campaignEndTime?: Date
  // Only visible in the charity popularity report
  donorCount?: number
  // Only visible for privileged users having a role on the charity (or admin and treasurer)
  account?: Account
}

export interface Donation {
  amount: number
  anonymous: boolean
  charity?: Charity
  charityRef: string
  description: string
  donationTime: Date
  donor?: User
  donorRef: string | null
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
  purpose: 'SYSTEM' | 'CURRENT' | 'PREMIUM'
}
export interface Deposit {
  // Account id is set only for deposits on a system account
  accountId?: string
  description: string
  amountCredits: number
  returnUrl: string
}

export interface OrderId {
  readonly order_id: string
  readonly project_id: string
}
