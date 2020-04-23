import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_RIDESHARE_SERVICE_API_KEY =
  config.GRAVITEE_RIDESHARE_SERVICE_API_KEY

function generateHeaders(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchLicense: (context, payload) => {
    context.commit('setSearchLicensePlate', payload)
    const plate = payload
    const URL = BASE_URL + `/rideshare/carLicenses?country=NL&plate=${plate}`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        context.commit('setSearchResult', resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
        if (!!error.response && error.response.status == 404) {
          context.dispatch(
            'ui/queueNotification',
            {
              message: `Geen auto gevonden voor kenteken ${plate}.`,
              timeout: 3000,
            },
            { root: true }
          )
        } else {
          context.dispatch(
            'ui/queueNotification',
            {
              message: `Geen auto gevonden voor kenteken ${plate}.`,
              timeout: 3000,
            },
            { root: true }
          )
        }
      })
  },
  fetchCars: context => {
    const URL = BASE_URL + `/rideshare/cars`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        if (resp.status == 200) {
          context.commit('setAvailableCars', resp.data)
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  submitCar: (context, payload) => {
    const URL = BASE_URL + `/rideshare/cars`
    axios
      .post(URL, payload, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        // eslint-disable-next-line
        console.log(resp)
        context.dispatch('fetchCars')
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
        if (!!error.response && error.response.status == 409) {
          context.dispatch(
            'ui/queueNotification',
            {
              message: `Kenteken ${payload.licensePlate} is al geregistreerd.`,
              timeout: 0,
            },
            { root: true }
          )
        }
      })
  },
  removeCar: (context, payload) => {
    const URL = BASE_URL + `/rideshare/cars/${payload.id}`
    axios
      .delete(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        context.dispatch('fetchCars')
        // eslint-disable-next-line
        console.log(resp)
        context.dispatch('fetchCars')
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  submitRide: (context, payload) => {
    const { ridePlanOptions, selectedTime, from, to, recurrence } = payload
    if (ridePlanOptions.selectedCarId < 0) {
      context.dispatch(
        'ui/queueNotification',
        {
          message: 'Voeg eerst een auto toe.',
          timeout: 0,
        },
        { root: true }
      )
      return
    }
    const request = {
      carRef: 'urn:nb:rs:car:' + ridePlanOptions.selectedCarId,
      // only departure time possible?
      // this conflicts with UI that supports departure or arrival time
      departureTime: moment(selectedTime).format('YYYY-MM-DDTHH:mm:ss'),
      recurrence,
      fromPlace: {
        label: `${from.title} ${from.vicinity}`,
        latitude: from.position[0],
        longitude: from.position[1],
      },
      toPlace: {
        label: `${to.title} ${to.vicinity}`,
        latitude: to.position[0],
        longitude: to.position[1],
      },
      remarks: 'What does this do?',
      nrSeatsAvailable: ridePlanOptions.numPassengers,
      maxDetourSeconds: ridePlanOptions.maxMinutesDetour * 60,
    }
    const axiosConfig = {
      method: 'POST',
      url: BASE_URL + `/rideshare/rides`,
      data: request,
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    }

    axios(axiosConfig)
      .then(function(res) {
        // eslint-disable-next-line
        console.log(res)
        context.dispatch('fetchRides', { offset: 0, maxResults: 10 })
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)

        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het versturen van uw rit-aanbod.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
  fetchRides: (context, payload) => {
    const offset = payload.offset
    const maxResults = payload.maxResults
    const URL = BASE_URL + `/rideshare/rides`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
        params: {
          offset: offset,
          maxResults: maxResults,
        },
      })
      .then(function(resp) {
        if (offset == 0) {
          context.commit('saveRides', resp.data.data)
        } else {
          context.commit('appendRides', resp.data.data)
        }
        context.commit('setPlannedRidesCount', resp.data.totalCount)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het ophalen van uw rit-aanbod.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
  deleteRide: (context, payload) => {
    if (payload.ride.bookings.length > 0) {
      let recipientList = []
      let promiseList = []

      for (const index in payload.ride.bookings) {
        let booking = payload.ride.bookings[index]
        //This will cause async issues?
        promiseList.push(
          context.dispatch('fetchUser', {
            userRef: booking.passenger.id,
          })
        )
      }
      Promise.all(promiseList).then(function(values) {
        for (const index in values) {
          let recipient = {
            familyName: values[index].familyName,
            givenName: values[index].givenName,
            id: values[index].id,
            managedIdentity: values[index].managedIdentity,
          }
          recipientList.push({ recipient: recipient })
        }

        let cancelReason = payload.cancelReason
        if (cancelReason === '') {
          cancelReason =
            'De rit is geannuleerd. Er is door de bestuurder geen reden opgegeven.'
        } else {
          cancelReason =
            'De rit is geannuleerd vanwege de volgende reden: ' + cancelReason
        }
        //Construct message payload object
        let messagePayload = {
          body: cancelReason,
          context: 'urn:nb:rs:ride:' + payload.id,
          deliveryMode: 'MESSAGE',
          envelopes: recipientList,
          managedIdentity: payload.driver,
          subject: 'Van A naar B',
        }
        context.dispatch('ms/sendMessage', messagePayload, { root: true })
      })
    }

    const URL = BASE_URL + '/rideshare/rides/' + payload.id
    axios
      .delete(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        if (resp.status == 204) {
          //Delete trip from store!
          context.commit('deleteRides', payload.id)
        } else {
          context.dispatch(
            'ui/queueNotification',
            {
              message: 'Fout bij het verwijderen van uw rit-aanbod.',
              timeout: 0,
            },
            { root: true }
          )
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchUser: (context, { userRef }) => {
    const URL = BASE_URL + `/rideshare/users/${userRef}`
    return axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        return resp.data
        // if (resp.status == 200) {
        //   context.commit('setAvailableCars', resp.data)
        // }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
