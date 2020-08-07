export class CharityState {
  charities: Charity[] = []
  charitySearchResults: Charity[] = []
  charity: Charity | null = null
  charityDonations: Donation[] = []
  previouslyDonatedCharities: Charity[] = []
  topDonors: Donor[] = []
}

export interface Charity {
  _id: string
  owner: { id: string; firstName: string; lastName: string }
  name: string
  place: string
  description: string
  goal: number
  credits: number
  geoLocation: {
    lon: ''
    lat: ''
  }
  image: string
  published: Date
  donors: string[]
  totalDonors: number
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
