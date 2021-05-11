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
    place.location = {
      coordinates: [
        suggestion.position.longitude,
        suggestion.position.latitude,
      ],
      type: 'Point',
    }
    place.ref = suggestion.id
    place.title = suggestion.title
    place.titleHighlights = suggestion.titleHighlights
    return place
  },
}
