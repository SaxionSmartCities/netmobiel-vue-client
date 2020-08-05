export class CharityState {
  charities: Charity[] = []
  charitySearchResults: Charity[] = []
}

export interface Charity {
  owner: { id: string; firstName: string; lastName: string }
  name: string
  place: string
  description: string
  goal: number
  geoLocation: {
    lon: ''
    lat: ''
  }
  image: string
  published: Date
}
