export class GeoCoderState {
  geocoder: GeoCoder = {
    pickedLocations: {
      from: { address: undefined, displayPosition: undefined },
      to: { address: undefined, displayPosition: undefined },
    },
    preFilledTime: null,
    query: '',
    suggestions: [],
  }
}

export interface GeoCoder {
  query: string
  pickedLocations: {
    to: { address?: string; displayPosition?: string }
    from: { address?: string; displayPosition?: string }
  }
  preFilledTime?: any
  suggestions: GeoCoderSuggestion[]
}

export interface GeoCoderSuggestion {
  access: string[]
  address: {
    countryCode?: string
    houseNumber?: string
    label: string
    locality?: string
    postalCode?: string
    stateCode?: string
    street?: string
  }
  category?: string
  distance: number
  id: string
  position: {
    latitude: number
    longitude: number
  }
  resultType: string
  title: string
  titleHighlights: Range[]
}

export interface Range {
  start: number
  end: number
}
