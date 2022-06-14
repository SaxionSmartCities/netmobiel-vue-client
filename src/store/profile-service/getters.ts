import { ModuleBuilder } from 'vuex-typex'
import { ProfileState } from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  const getUser = psBuilder.read((state: ProfileState) => {
    return state.user
  }, 'getUser')

  const getProfile = psBuilder.read((state: ProfileState) => {
    return state.profile
  }, 'getProfile')

  const getFavoriteLocations = psBuilder.read((state: ProfileState) => {
    return state.favoriteLocations
  }, 'getFavoriteLocations')

  const getDelegateProfile = psBuilder.read((state: ProfileState) => {
    return state.delegateProfile
  }, 'getDelegateProfile')

  const getPublicUsers = psBuilder.read((state: ProfileState) => {
    return state.publicUsers
  }, 'getPublicUsers')

  const getComplimentTypes = psBuilder.read((state: ProfileState) => {
    return state.complimentTypes
  }, 'getComplimentTypes')

  const getDelegation = psBuilder.read((state: ProfileState) => {
    return state.delegation
  }, 'getDelegation')

  const getDelegations = psBuilder.read((state: ProfileState) => {
    return state.delegations
  }, 'getDelegations')

  const getDelegatorId = psBuilder.read((state: ProfileState) => {
    return state.delegatorId
  }, 'getDelegatorId')

  const getSearchResults = psBuilder.read((state: ProfileState) => {
    return state.search.results
  }, 'getSearchResults')

  const getSurveyInteraction = psBuilder.read((state: ProfileState) => {
    return state.surveyInteraction
  }, 'getSurveyInteraction')

  const getVersion = psBuilder.read((state: ProfileState) => {
    return state.version
  }, 'getVersion')

  return {
    get getUser() {
      return getUser()
    },
    get getProfile() {
      return getProfile()
    },
    get getFavoriteLocations() {
      return getFavoriteLocations()
    },
    get getDelegateProfile() {
      return getDelegateProfile()
    },
    get getPublicUsers() {
      return getPublicUsers()
    },
    get getComplimentTypes() {
      return getComplimentTypes()
    },
    get getDelegations() {
      return getDelegations()
    },
    get getDelegation() {
      return getDelegation()
    },
    get getDelegatorId() {
      return getDelegatorId()
    },
    get getSearchResults() {
      return getSearchResults()
    },
    get getSurveyInteraction() {
      return getSurveyInteraction()
    },
    get canActAsDelegate() {
      return (
        this.getUser.roles.includes('delegate') ||
        this.getUser.roles.includes('admin')
      )
    },
    get canActAsTreasurer() {
      // TODO exclude when delegation is active
      return (
        this.getUser.roles.includes('treasurer') ||
        this.getUser.roles.includes('admin')
      )
    },
    get getVersion() {
      return getVersion()
    },
  }
}
