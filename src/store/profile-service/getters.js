export default {
  getUser: state => state.user,
  getProfile: state => state.user.profile,
  getCreditAmount: state => state.user.credits.creditAmount,
  getCreditHistory: state => state.user.credits.creditHistory,
  getCoronaCheck: state => state.user.coronaCheck,
  passedCoronaCheck: state => {
    return (
      state.user.coronaCheck.coronaSymptoms &&
      state.user.coronaCheck.houseHoldHadCorona
    )
  },
}
