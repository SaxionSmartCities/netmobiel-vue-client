module.exports = {
  upperCaseFirst: function(input) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  },
  generateHeaders: function(key, delegator) {
    if (delegator) {
      return {
        'X-Delegator': delegator,
        'X-Gravitee-Api-Key': key,
      }
    }
    return {
      'X-Gravitee-Api-Key': key,
    }
  },
  geoSuggestionToPlace: function(suggestion) {
    let place = { ...suggestion.address }
    let location = suggestion.position
    if (suggestion.access && suggestion.access.length > 0) {
      // Take the first one, a bit arbitrary choice
      // Non-representative observation: Only very large areas have multiple entrances
      location = suggestion.access[0]
    }
    place.location = {
      coordinates: [location.longitude, location.latitude],
      type: 'Point',
    }
    place.ref = suggestion.id
    place.title = suggestion.title
    place.titleHighlights = suggestion.titleHighlights
    return place
  },
  geoPlaceToCriteria: function(place) {
    return {
      label: place.title,
      latitude: place.location.coordinates[1],
      longitude: place.location.coordinates[0],
    }
  },
  isAbsoluteUrl: function(url) {
    const absoluteUrlRegEx = new RegExp('^(?:[a-z]+:)?//', 'i')
    return absoluteUrlRegEx.test(url)
  },
  coordinatesToGeoLocation: function(location) {
    return {
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
    }
  },
  getCreatedObjectIdFromResponse: function(response) {
    // if the response has status 201, the location header defines the api url to
    // fetch the object. Extract the object id.
    const loc = response.headers.location
    return loc.substring(loc.lastIndexOf('/') + 1)
  },
}
