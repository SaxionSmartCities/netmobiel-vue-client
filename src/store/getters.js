export default {
  getUser: state => {
    return state.user
  },
  isHeaderVisible: state => {
    return state.ui.header.visible
  },
  isFooterVisible: state => {
    return state.ui.footer.visible
  },
  getRegistrationStep: state => {
    return state.ui.registrationStep
  },
  getCurrentDate: state => {
    return new Date(state.user.dateOfBirth)
  },
  getRegistrationStatus: state => {
    return state.registrationRequest.submitStatus
  },
  getPlanningStatus: state => {
    return state.planningRequest.submitStatus
  },
  getLocations: state => {
    return state.locations
  },
  getItineraries: state => {
    return state.planningRequest.result.data.itineraries
    // return [
    //   {
    //     journeyId: 123,
    //     legs: [
    //       {
    //         id: 0,
    //         mode: { type: 'bus', line: 144 },
    //         time: 5,
    //       },
    //       {
    //         id: 1,
    //         mode: {
    //           type: 'car',
    //           driver: {
    //             name: 'Henk',
    //             rating: 3.0,
    //           },
    //         },
    //         time: 20,
    //       },
    //       {
    //         id: 2,
    //         mode: { type: 'walk' },
    //         time: 10,
    //       },
    //     ],
    //     cost: 20,
    //     departureTime: '09:40',
    //   },
    //   {
    //     journeyId: 456,
    //     legs: [
    //       {
    //         id: 0,
    //         mode: { type: 'walk' },
    //         time: 5,
    //       },
    //       {
    //         id: 1,
    //         mode: {
    //           type: 'car',
    //           driver: {
    //             name: 'Coby',
    //             rating: 1.2,
    //           },
    //         },
    //         time: 10,
    //       },
    //       {
    //         id: 2,
    //         mode: { type: 'bus', line: 144 },
    //         time: 35,
    //       },
    //     ],
    //     cost: 5,
    //     departureTime: '09:20',
    //   },
    //   {
    //     journeyId: 457,
    //     legs: [
    //       {
    //         id: 0,
    //         mode: { type: 'walk' },
    //         time: 5,
    //       },
    //       {
    //         id: 1,
    //         mode: {
    //           type: 'car',
    //           driver: {
    //             name: 'Bert',
    //             rating: 2.5,
    //           },
    //         },
    //         time: 15,
    //       },
    //       {
    //         id: 2,
    //         mode: { type: 'bus', line: 144 },
    //         time: 5,
    //       },
    //       {
    //         id: 3,
    //         mode: {
    //           type: 'car',
    //           driver: {
    //             name: 'Laura',
    //             rating: 1.8,
    //           },
    //         },
    //         time: 10,
    //       },
    //     ],
    //     cost: 5,
    //     departureTime: '09:45',
    //   },
    //   {
    //     journeyId: 789,
    //     legs: [
    //       {
    //         id: 0,
    //         mode: {
    //           type: 'taxi',
    //           driver: {
    //             name: 'Netmobiel chauffeur',
    //             rating: 3.0,
    //           },
    //         },
    //         time: 35,
    //       },
    //     ],
    //     cost: 100,
    //     departureTime: '09:10',
    //   },
    // ]
  },
}
