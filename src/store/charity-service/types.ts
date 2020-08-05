export class CharityState {
  charities: Charity[] = [{ name: 'testCharityState' }]
  charitySearchResults: Charity[] = []
}

export interface Charity {
  name: string
}
