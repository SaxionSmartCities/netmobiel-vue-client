import axios from 'axios'

var BASE_URL = 'http://localhost:8080'

export default {
  submitRegistrationRequest: (context, payload) => {
    context.commit('storeRegistrationRequest', payload)

    axios
      .post(BASE_URL + '/someApi/someCall', context.state.registrationRequest)
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
  },
}
