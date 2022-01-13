import constants from '@/constants/constants'

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
    let shn = [place.street, place.houseNumber ? place.houseNumber : '']
    line += `${shn.filter((piece) => piece).join(' ')}, `
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

function geoLocationToPlace(location) {
  const place = {}
  place.label = location.label
  place.location = {
    coordinates: [location.longitude, location.latitude],
    type: 'Point',
  }
  return place
}

function getCreatedObjectIdFromResponse(response) {
  // if the response has status 201, the location header defines the api url to
  // fetch the object. Extract the object id.
  const loc = response.headers?.location
  return loc ? loc.substring(loc.lastIndexOf('/') + 1) : undefined
}

/**
 * Finds the index of the value in the haystack that is numerical closest to the needle value.
 * @param needle The value to lookup for
 * @param haystack The array with values. Sorting is not necessary
 * @return {*} The index of the element that is closest.
 */
function findClosestIndexOf(needle, haystack) {
  // console.log(`Needle: ${needle} Haystack: [${haystack.join(', ')}]`)
  return haystack.reduce((prev, curr, ix) => {
    // console.log(`Prev ${prev} ${haystack[prev]} Ix ${ix} Curr ${curr} `)
    let prevDiff = Math.abs(haystack[prev] - needle)
    let currDiff = Math.abs(curr - needle)
    if (prevDiff === currDiff) {
      return haystack[prev] > curr ? prev : ix
    } else {
      return prevDiff < currDiff ? prev : ix
    }
  }, 0)
}

/**
 * Decodes a JWT token.
 * @see https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
 * @param token The encoded JWT token
 * @return Object with the token attributes
 */
function decodeJwt(token) {
  // The structure of a JWT is <Header>.<Payload>.Signature
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

function triStateLogicText(value) {
  const sym = value ? 'TRUE' : value === false ? 'FALSE' : 'UNDECIDED'
  return constants.TRISTATE[sym]
}
export {
  upperCaseFirst,
  generateHeaders,
  geoSuggestionToPlace,
  geoPlaceToAddressLabel,
  geoPlaceToCriteria,
  isAbsoluteUrl,
  coordinatesToGeoLocation,
  geoLocationToPlace,
  getCreatedObjectIdFromResponse,
  findClosestIndexOf,
  decodeJwt,
  triStateLogicText,
}
