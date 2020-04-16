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
    backButtonVisible: false,
    notificationBarVisible: false,
    notificationQueue: [],
    updateMessages: [],
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
