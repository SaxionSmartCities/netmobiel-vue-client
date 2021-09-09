import { Place } from '../profile-service/types'

export class GeoCoderState {
  geocoder: GeoCoder = {
    pickedLocations: new Map(),
    suggestions: [],
  }
}

export interface GeoCoder {
  pickedLocations: Map<string, PickedLocation | undefined>
  suggestions: GeoCoderSuggestion[]
}

export interface PickedLocation {
  query: string
  field: string
  place: Place
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

export interface GeoCoderRequest {
  query: string
  radius?: number
  center?: GeoLocation
}
