import axios from 'axios'

var BASE_URL = 'https://dev.netmobiel.eu/gwapi'

export default {
  submitRegistrationRequest: (context, payload) => {
    context.commit('storeRegistrationRequest', payload)

    var axiosConfig = {
      method: 'POST',
      url: BASE_URL + '/profiles',
      data: context.state.registrationRequest,
      headers: {
        'X-Gravitee-Api-Key': '3a4516db-ece3-4477-876f-6c1a9d4d723c',
      },
    }

    console.log(axiosConfig)
    axios(axiosConfig)
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
  },
}
