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

export interface GeoCoderSuggestion {}
