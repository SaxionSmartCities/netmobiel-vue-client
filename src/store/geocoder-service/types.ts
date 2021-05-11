import { Place } from '../profile-service/types'

export class GeoCoderState {
  geocoder: GeoCoder = {
    query: '',
    pickedLocations: {
      home: null,
      from: null,
      to: null,
    },
    suggestions: [],
  }
}

export interface GeoCoder {
  query: string
  pickedLocations: {
    home: Place | null
    from: Place | null
    to: Place | null
  }
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
