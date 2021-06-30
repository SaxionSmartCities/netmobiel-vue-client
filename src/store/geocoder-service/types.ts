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

export interface GeoLocation {
  latitude: number
  longitude: number
}

export interface GeoCoderSuggestion {
  access: Geolocation[]
  address: {
    // ISO 3166-1 Alpha-3 country code
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
  position: GeoLocation
  resultType: string
  title: string
  titleHighlights: Range[]
}

export interface Range {
  start: number
  end: number
}
