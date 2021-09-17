function upperCaseFirst(input) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

function generateHeaders(key, delegator) {
  if (delegator) {
    return {
      'X-Delegator': delegator,
      'X-Gravitee-Api-Key': key,
    }
  }
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function geoSuggestionToPlace(suggestion) {
  // Assumption: Address details are available
  let place = { ...suggestion.address, label: undefined }
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
  place.category = suggestion.category
  place.ref = suggestion.id
  if (suggestion.resultType === 'place') {
    // A place has a short title as a kind of label
    place.label = suggestion.title
  } else {
    // Ignore 'locality', 'street', 'houseNumber'
  }
  return place
}

function geoPlaceToAddressLabel(place, includeLabel) {
  let line = ''
  if (place.label && includeLabel) {
    line += `${place.label}, `
  }
  if (place.street) {
    line += place.street
    if (place.houseNumber) {
      line += ` ${place.houseNumber}, `
    }
  }
  line += place.locality
  if (place.countryCode === 'NLD') {
    if (place.stateCode) {
      line += ` (${place.stateCode})`
    }
  } else {
    line += ` (${place.countryCode})`
  }
  return line
}

function geoPlaceToCriteria(place) {
  if (!place?.location?.coordinates) {
    return undefined
  }
  return {
    label: geoPlaceToAddressLabel(place, true),
    latitude: place.location.coordinates[1],
    longitude: place.location.coordinates[0],
  }
}
function isAbsoluteUrl(url) {
  const absoluteUrlRegEx = new RegExp('^(?:[a-z]+:)?//', 'i')
  return absoluteUrlRegEx.test(url)
}

function coordinatesToGeoLocation(location) {
  if (!location?.coordinates) {
    return undefined
  }
  return {
    latitude: location.coordinates[1],
    longitude: location.coordinates[0],
  }
}

function getCreatedObjectIdFromResponse(response) {
  // if the response has status 201, the location header defines the api url to
  // fetch the object. Extract the object id.
  const loc = response.headers?.location
  return loc ? loc.substring(loc.lastIndexOf('/') + 1) : undefined
}
export {
  upperCaseFirst,
  generateHeaders,
  geoSuggestionToPlace,
  geoPlaceToAddressLabel,
  geoPlaceToCriteria,
  isAbsoluteUrl,
  coordinatesToGeoLocation,
  getCreatedObjectIdFromResponse,
}
