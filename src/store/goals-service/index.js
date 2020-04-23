import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    selectedGoalIndex: undefined,
    storedGoals: [
      {
        id: 1,
        title: 'Renovatie Sint-Bonifatiuskerk',
        location: 'Lichtenvoorde',
        description:
          ' De Sint-Bonifatiuskerk is een rooms-katholieke kerk in Lichtenvoorde,\n' +
          '        gebouwd in de jaren 1912 en 1913. De architect was Wolter te Riele, die\n' +
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
      {
        id: 2,
        title: 'Onderhoud en isolatie clubgebouwen',
        location: 'Tubbergen',
        description:
          'We gaan het clubgebouw (explohok) grondig van binnen verbouwen en isoleren, \n' +
          'dakbedekking opnieuw aanbrengen en het reguliere clubgebouw onderhouden \n' +
          '(kleine klussen, verven)',
        creditsGoal: 60,
        creditsDonated: 14,
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
          {
            name: 'Netmobiel gebruiker',
            creditsDonated: 3,
            message: '',
            anonymous: true,
          },
        ],
      },
      {
        id: 3,
        title: 'aanbrengen ventilatie in dorpshuis',
        location: 'Manderveen',
        description:
          'in met name de muziekzaal is sprake van vochtplekken \n' +
          ' veroorzaakt door te weinig ventilatie.',
        creditsGoal: 85,
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
      {
        id: 4,
        title: 'Ingang basisschool herinrichten',
        location: 'Vragender',
        description:
          'De beplanting bij de ingang van de basisschool is aan vervanging toe. \n' +
          'De beplanting wordt verwijderd en nieuwe beplanting wordt aangebracht. ',
        creditsGoal: 85,
        creditsDonated: 72,
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
      {
        id: 5,
        title: 'nieuw plafond toneelzaal',
        location: 'Diemen',
        description:
          'Voor de toneeluitvoeringen in het plaatselijke dorpshuis maken wij gebruik van de grote zaal. \n' +
          'Het plafond is oud en ziet er niet meer uit.\n' +
          'We gaan een nieuw plafond maken met een vaste gordijnrail voor de toneelvoorhanggordijnen \n' +
          'waarbij tevens LED licht zal worden aangebracht',
        creditsGoal: 85,
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
    topDonors: [
      {
        ranking: 1,
        username: 'Henk van der Laan',
        creditsDonated: 180,
      },
      {
        ranking: 2,
        username: 'Marc de vries',
        creditsDonated: 156,
      },
      {
        ranking: 3,
        username: 'Netmobiel gebruiker',
        creditsDonated: 121,
      },
      {
        ranking: 4,
        username: 'Coby Hoekstra',
        creditsDonated: 83,
      },
      {
        ranking: 5,
        username: 'Tania',
        creditsDonated: 44,
      },
    ],
  },
  getters,
  mutations,
  actions,
}
