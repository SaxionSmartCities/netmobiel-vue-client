export default {
  getGoals: state => state.storedGoals,
  getTopDonorsList: state => state.topDonors,
  getSelectedGoalIndex: state => state.storedGoals[state.selectedGoalIndex],
}
