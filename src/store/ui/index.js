import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    header: {
      visible: true,
    },
    footer: {
      visible: true,
      selectedNav: 'home',
    },
    app: {
      classes: [],
    },
    backButtonVisible: false,
    notificationBarVisible: false,
    notificationQueue: [],
    updateMessages: [
      {
        title: 'Verdien een gratis reis!',
        content:
          'Maak jouw profiel compleet en verdien een gratis reis met Netmobiel!',
        link: {
          label: 'Profiel compleet maken',
          to: '/onboardingPage',
        },
      },

      {
        title: 'Gepland onderhoud',
        content: 'Van maandag 24 oktober tot 9 november',
      },
      {
        title: 'Belangrijke mededeling',
        content: 'We zijn erg blij met je als gebruiker, ga aub niet weg',
      },
    ],
    temp: {
      rideDate: moment()
        .add(2, 'day')
        .startOf('day')
        .locale('NL')
        .format('YYYY-MM-DD'),
      rideTime: moment()
        .add(30, 'minutes')
        .locale('nl')
        .format('HH:mm'),
    },
  },
  actions,
  getters,
  mutations,
}
