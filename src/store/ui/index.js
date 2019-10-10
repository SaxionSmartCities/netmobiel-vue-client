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
    },
    app: {
      classes: [],
    },
    backButtonVisible: false,
    notificationBarVisible: false,
    notificationQueue: [],
    temp: {
      searchDate: moment()
        .startOf('day')
        .locale('NL')
        .format('YYYY-MM-DD'),
      searchTime: moment()
        .add(30, 'minutes')
        .locale('nl')
        .format('HH:mm'),
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
