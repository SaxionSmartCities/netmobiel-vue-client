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
  suggestions: any[]
  pickedLocations: {
    to: { address?: string; displayPosition?: string }
    from: { address?: string; displayPosition?: string }
  }
  preFilledTime?: any
}
