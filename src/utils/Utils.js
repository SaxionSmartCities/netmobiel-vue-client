import constants from '@/constants/constants'
import * as PhoneNumber from 'awesome-phonenumber'
import {
  netmobielCapabilities,
  runningInsideFlutterApp,
  runningInsideFlutterApp2022,
} from '@/utils/NetmobielApp'

function upperCaseFirst(input) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

function isAbsoluteUrl(url) {
  const absoluteUrlRegEx = new RegExp('^(?:[a-z]+:)?//', 'i')
  return absoluteUrlRegEx.test(url)
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
  if (place?.label && includeLabel) {
    line += `${place.label}, `
  }
  if (place?.street) {
    let shn = [place.street, place.houseNumber ? place.houseNumber : '']
    line += `${shn.filter((piece) => piece).join(' ')}, `
  }
  if (place?.locality) {
    line += place.locality
  }
  if (place?.countryCode) {
    if (place.countryCode === 'NLD') {
      if (place.stateCode) {
        line += ` (${place.stateCode})`
      }
    } else {
      line += ` (${place.countryCode})`
    }
  }
  return line
}

function geoPlaceToCriteria(place, includeLabel = true) {
  let criteria
  if (place) {
    criteria = coordinatesToGeoLocation(place.location)
    criteria.label = geoPlaceToAddressLabel(place, includeLabel)
  }
  return criteria
}

function coordinatesToGeoLocation(location) {
  if (!location?.coordinates || location.coordinates.length !== 2) {
    return undefined
  }
  return {
    latitude: location.coordinates[1],
    longitude: location.coordinates[0],
  }
}

function geoLocationToPlace(location) {
  let place
  if (location) {
    place = {}
    place.label = location.label
    if (
      typeof location.longitude !== 'undefined' &&
      typeof location.latitude !== 'undefined'
    ) {
      place.location = {
        coordinates: [location.longitude, location.latitude],
        type: 'Point',
      }
    }
  }
  return place
}

function getCreatedObjectIdFromResponse(response) {
  // if the response has status 201, the location header defines the api url to
  // fetch the object. Extract the object id.
  const loc = response.headers?.location
  // If the location contains a '/', then it is a url, otherwise assume urn
  // In case of an url return the last part of the url
  const isUrl = loc && loc.indexOf('/') !== -1
  return isUrl ? loc.substring(loc.lastIndexOf('/') + 1) : loc
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

const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

function creditAmountInEuro(amountInCredits, exchangeRate) {
  return amountInEuro((amountInCredits || 0) * exchangeRate)
}

function amountInEuro(amountInCents) {
  return euroFormatter.format((amountInCents || 0) / 100)
}

function isValidPhoneNumber(phoneString, countryCode) {
  const pn = PhoneNumber(phoneString, countryCode)
  return pn.isValid()
}

function formatPhoneNumber(phoneString, countryCode) {
  const pn = PhoneNumber(phoneString, countryCode)
  return pn.getNumber('national')
}

function allowExternalLinks() {
  return (
    !runningInsideFlutterApp() || netmobielCapabilities.canHandleExternalUrl
  )
}

function isUpdateImageSupported() {
  return !runningInsideFlutterApp2022() || netmobielCapabilities.canUpload
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
  creditAmountInEuro,
  amountInEuro,
  isValidPhoneNumber,
  formatPhoneNumber,
  allowExternalLinks,
  isUpdateImageSupported,
}
