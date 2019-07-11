import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLAN_SERVICE_API_KEY = config.GRAVITEE_PLAN_SERVICE_API_KEY
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY

function generateHeader(key, context) {
  return {
    'X-Gravitee-Api-Key': key,
    Authorization: context.state.user.accessToken,
  }
}

export default {
  submitRegistrationRequest: (context, payload) => {
    context.commit('storeRegistrationRequest', payload)

    var axiosConfig = {
      method: 'POST',
      url: BASE_URL + '/profiles',
      data: context.state.registrationRequest,
      headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY, context),
    }

    axios(axiosConfig)
      .then(function() {
        context.commit('setRegistrationStatus', { success: true, message: '' })
      })
      .catch(function(error) {
        const status = error.response.status
        var errorMsg = ''
        if (status === 422) {
          errorMsg = 'Ontbrekende data (email, voornaam of achternaam'
        } else if (status === 500) {
          errorMsg = error.response.data.message // No clue what is going on, but the server should report something about it
        } else if (status === 409) {
          errorMsg = 'Het emailadres is al in gebruik'
        }

        context.commit('setRegistrationStatus', {
          success: false,
          message: errorMsg,
        })
      })
  },
  submitPlanningsRequest: (context, payload) => {
    context.commit('storePlanningRequest', payload)

    let params = {
      fromPlace: encodeURIComponent(
        context.state.planningRequest.fromPlace.lat +
          ',' +
          context.state.planningRequest.fromPlace.lon
      ),
      toPlace: encodeURIComponent(
        context.state.planningRequest.toPlace.lat +
          ',' +
          context.state.planningRequest.toPlace.lon
      ),
    }
    var axiosConfig = {
      method: 'GET',
      url: BASE_URL + '/plans',
      params: params,
      headers: generateHeader(GRAVITEE_PLAN_SERVICE_API_KEY, context),
    }

    context.commit('setPlanningStatus', {
      status: 'PENDING',
    })

    axios(axiosConfig)
      .then(function(res) {
        context.commit('setPlanningStatus', {
          status: 'SUCCESS',
        })

        context.commit('setPlanningResults', {
          data: res.data.plan,
        })
      })
      .catch(function(error) {
        var errorMsg = error.response.data.message

        context.commit('setPlanningStatus', {
          status: 'FAILED',
          message: errorMsg,
        })
      })
  },
  fetchGeocoderSuggestions: (context, place) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&query=${place}&country=NLD&beginHighlight=<b>&endHighlight=</b>`

    axios
      .get(GEOCODER_BASE_URL)
      .then(function(resp) {
        context.commit('setGeocoderSuggestions', resp.data.suggestions)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchGeocoderLocation: (context, payload) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `https://geocoder.api.here.com/6.2/geocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&locationid=${
      payload.locationId
    }&gen=9&jsonattributes=1`

    axios
      .get(GEOCODER_BASE_URL)
      .then(function(resp) {
        let pos = resp.data.response.view[0].result[0].location
        context.commit('setGeoLocationPicked', {
          pos: pos,
          field: payload.field,
        })
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchReverseGeocoderLocation: (context, payload) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&gen=9&jsonattributes=1&prox=${
      payload.lat
    },${payload.lon}&mode=retrieveAddresses`

    axios
      .get(GEOCODER_BASE_URL)
      .then(function(res) {
        console.log(res)
        payload.displayName =
          res.data.response.view[0].result[0].location.address.label
        console.log(res.data.response.view[0].result[0].location.address.label)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchMoreReverseGeocoderLocation: (context, payload) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    //payload exists out of all legs from the selectedItinerary

    //Assemble all urls for the axios get requests
    let urls = []
    payload.forEach(function(item) {
      let fromLat = item.from.lat
      let fromLon = item.from.lon

      let toLat = item.to.lat
      let toLon = item.to.lon

      let fromUrl = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&gen=9&jsonattributes=1&prox=${fromLat},${fromLon}&mode=retrieveAddresses`

      let toUrl = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&gen=9&jsonattributes=1&prox=${toLat},${toLon}&mode=retrieveAddresses`
      urls.push(fromUrl)
      urls.push(toUrl)
    })

    function getData(URL) {
      return axios
        .get(URL)
        .then(function(response) {
          return {
            success: true,
            data:
              response.data.response.view[0].result[0].location.address.label,
          }
        })
        .catch(function(error) {
          console.log(error)
          return { success: false }
        })
    }

    let URLPromises = urls.map(URL => {
      return getData(URL)
    })

    Promise.all(URLPromises)
      .then(values => {
        console.log(values)
        for (let i = 0; i < payload.length; i++) {
          let newLegProps = {
            index: i,
            fromName: values[i * 2].data,
            toName: values[i * 2 + 1].data,
          }
          context.commit('setNameForLegInSelectedItinerary', newLegProps)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },

  fetchMultiReverseGeocoderLocation: (context, payload) => {
    //The payload will get an array of objects with {lat: ..., long: ... }
    // https://developer.here.com/documentation/geocoder/topics/resource-multi-reverse-geocode.html
    // https://developer.here.com/api-explorer/rest/geocoder/multi-reverse-geocode
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `https://reverse.geocoder.api.here.com/6.2/multi-reversegeocode.json`

    let body = 'id=1&prox=52.5309,13.3845,50'
    console.log('payload: ', payload)
    //
    // for (let i = 0; i < payload.length; i++) {
    //   let string = '' + payload[i].lat + ',' + payload[i].lon
    //   body.push({ id: i, prox: string })
    // }

    console.log('now got this body =', body)

    axios({
      method: 'post',
      url: GEOCODER_BASE_URL,
      params: {
        app_id: HERE_APP_ID,
        app_code: HERE_APP_CODE,
        gen: 9,
        mode: 'retrieveAddresses',
      },
      data: body,
      headers: { 'Content-Type': 'application/xml', Origin: 'app' },
    })
      .then(function(response) {
        //handle success
        console.log('This is the multi:::')
        console.log(response)
      })
      .catch(function(response) {
        //handle error
        console.log(response)
      })
  },
}
