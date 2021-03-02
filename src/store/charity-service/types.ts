export class CharityState {
  withdrawals: Withdrawal[] = []
  charities: Charity[] = []
  charitySearchResults: Charity[] = []
  charity: Charity | null = null
  charityDonations: Donation[] = []
  previouslyDonatedCharities: Charity[] = []
  topDonors: Donor[] = []
}

export enum STORE_STATE_OPTIONS {
  PREVIOUS,
  INIT,
  SEARCH,
}

export interface Charity {
  id: string
  name: string
  reference: string
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
}

export interface Donation {
  donor: {
    id: string
    firstName: string
    lastName: string
  } | null
  donorRef: string | null
  charityId: string
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
  managedIdentity: string
  firstName: string
  lastName: string
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
}
