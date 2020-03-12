export default {
  fetchGoals: state => state.storedGoals,
  getTopDonorsList: state => state.topDonors,
  getGoalListSize: state => state.storedGoals.length,
  getSelectedGoal: state => state.selectedGoal,
}
