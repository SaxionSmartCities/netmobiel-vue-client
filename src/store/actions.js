import axios from 'axios'

export default {
  submitRegistrationRequest: (context, payload) => {
    context.commit('storeRegistrationRequest', payload)

    console.log('make some fancy axios call')
    console.log(context.state.user.registrationRequest)

    axios
      .post('http://localhost:8080', context.state.user.registrationRequest)
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
  },
}
