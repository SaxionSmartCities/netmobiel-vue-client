export class CharityState {
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
  sender: {
    id: string
    firstName: string
    lastName: string
  } | null
  charityId: string
  credits: number
  message: string
  isAnonymous: boolean
  published: Date
}

export interface Donor {
  totalDonated: number
  user: {
    firstName: string
    lastName: string
  }
}
