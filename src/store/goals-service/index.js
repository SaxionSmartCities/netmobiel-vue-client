import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    selectedGoal: {
      title: undefined,
      decription: undefined,
      creditGoal: undefined,
      nrOfDonor: undefined,
    },
    storedGoals: [
      {
        id: 1,
        title: 'renovatie',
        description:
          ' De Sint-Bonifatiuskerk is een rooms-katholieke kerk in Lichtenvoorde,\n' +
          '        gebouwd in de jaren 1912 en 1913. De architect was WOlter te Riele, die\n' +
          '        een negotisch',
        creditsGoal: 200,
        creditsDonated: 54,
        donors: [
          {
            name: 'Henk van der Laan',
            creditsDonated: 14,
            message: 'Veel Succes, ik kom graag eens kijken',
            anonymous: false,
          },
          {
            name: 'Marc de Vries',
            creditsDonated: 54,
            message: '',
            anonymous: false,
          },
          {
            name: 'Netmobiel gebruiker',
            creditsDonated: 14,
            message: '',
            anonymous: true,
          },
        ],
      },
    ],
  },
  getters,
  mutations,
  actions,
}
