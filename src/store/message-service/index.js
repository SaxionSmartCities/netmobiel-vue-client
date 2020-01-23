import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import moment from 'moment'

export default {
  namespaced: true,
  state: {
    conversations: [
      {
        id: 1,
        sender: 'Henk',
        lastViewed: moment().subtract(1, 'hour'),
        relatedBooking: {
          from: 'Ergens',
          to: 'Ergens anders',
        },
        messages: [
          {
            content: 'Hallo',
            sender: 'Henk',
            timeStamp: moment()
              .subtract(1, 'day')
              .add(2, 'hours'),
          },
          {
            content: 'Hoi',
            sender: 'You',
            timeStamp: moment(),
          },
          {
            content: 'ben je dr nog?',
            sender: 'You',
            timeStamp: moment(),
          },
          {
            content: 'Henk??? HENK!!!! NEEEEEEEE',
            sender: 'You',
            timeStamp: moment(),
          },
          {
            content: 'Jaja ff rustig..',
            sender: 'Henk',
            timeStamp: moment(),
          },
        ],
      },
      {
        id: 2,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 3,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 4,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 5,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 6,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 7,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 8,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
      {
        id: 9,
        sender: 'Netmobiel',
        lastViewed: moment().subtract(5, 'hours'),
        messages: [
          {
            content:
              'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
            sender: 'Netmobiel',
            timeStamp: moment().subtract(1, 'day'),
          },
        ],
      },
    ],
  },
  getters,
  mutations,
  actions,
}
