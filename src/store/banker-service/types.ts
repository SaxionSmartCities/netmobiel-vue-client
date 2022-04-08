import { Page } from '@/store/types'

export class BankerState {
  paymentBatches: Page<PaymentBatch> | null = null
  paymentBatch: PaymentBatch | null = null
  withdrawals: Page<Withdrawal> | null = null
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
  rewards: Page<Reward> | null = null
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
  // Account id is set only for withdrawals from a system account
  accountId?: string
  readonly account?: Account
  readonly accountRef?: string
  amountCredits?: number
  readonly amountEurocents?: number
  readonly createdBy?: User
  readonly creationTime?: string
  description?: string
  readonly iban?: string
  readonly ibanHolder?: string
  readonly id: number
  readonly modificationTime?: string
  readonly modifiedBy?: User
  readonly orderReference?: string
  readonly paymentBatchRef?: string
  readonly reason?: string
  readonly status:
    | 'REQUESTED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'EXPIRED'
    | 'CANCELLED'
    | undefined
}

export interface Account {
  readonly credits?: number
  iban?: string
  ibanHolder?: string
  readonly id: number
  name: string
  readonly ncan?: string
  readonly purpose?: 'SYSTEM' | 'CURRENT' | 'PREMIUM'
  readonly type?: 'ASSET' | 'LIABILITY'
}
export interface Deposit {
  // Account id is set only for deposits on a system account
  accountId?: string
  description: string
  amountCredits: number
  returnUrl: string
}

export interface PaymentEvent {
  readonly order_id: string
  readonly project_id: string
}

export interface Incentive {
  readonly amount: number
  readonly category: string
  readonly code: string
  readonly descriptionTime?: string
  readonly disableTime?: Date
  readonly id: number
  readonly maxAmount?: number
  readonly redemption: boolean
  readonly relative: boolean
  readonly urn: string
}

export interface Reward {
  readonly amount: number
  readonly cancelTime: Date
  readonly factContext: string
  readonly id: number
  readonly incentive: Incentive
  readonly paidOut: boolean
  readonly recipient: User
  readonly rewardTime: Date
  readonly transactionRef: string
  readonly urn: string
}

export interface PaymentBatch {
  // Number of withdrawal requests in the batch
  readonly nrRequests?: number
  readonly amountRequestedEurocents?: number
  readonly amountSettledEurocents?: number
  readonly createdBy?: User
  readonly creationTime?: string
  readonly id: number
  readonly modificationTime?: string
  readonly modifiedBy?: User
  readonly orderReference?: string
  // The reference the originator of the payment.
  readonly originatorAccountRef?: string
  // The (copied) originator IBAN. Copied as it might change over time, but not for this batch
  readonly originatorIban?: string
  // The (copied) originator IBAN holder.
  readonly originatorIbanHolder?: string
  readonly reason?: string
  // In practice only the following aer used: ACTIVE, COMPLETED, CANCELLED
  readonly status?:
    | 'REQUESTED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'EXPIRED'
    | 'CANCELLED'
    | undefined
  readonly withdrawalRequests: Withdrawal[]
}
