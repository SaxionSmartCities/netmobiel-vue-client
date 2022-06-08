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
    return state.user.profile
  }, 'getProfile')

  const getDelegateProfile = psBuilder.read((state: ProfileState) => {
    return state.user.delegateProfile
  }, 'getDelegateProfile')

  const getPublicUsers = psBuilder.read((state: ProfileState) => {
    return state.publicUsers
  }, 'getPublicUsers')

  const getComplimentTypes = psBuilder.read((state: ProfileState) => {
    return state.complimentTypes
  }, 'getComplimentTypes')

  const getDelegations = psBuilder.read((state: ProfileState) => {
    return state.user.delegations
  }, 'getDelegations')

  const getDelegatorId = psBuilder.read((state: ProfileState) => {
    return state.user.delegatorId
  }, 'getDelegatorId')

  const getSearchStatus = psBuilder.read((state: ProfileState) => {
    return state.search.status
  }, 'getSearchStatus')

  const getSearchResults = psBuilder.read((state: ProfileState) => {
    return state.search.results
  }, 'getSearchResults')

  const getSurveyInteraction = psBuilder.read((state: ProfileState) => {
    return state.user.surveyInteraction
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
    get getDelegatorId() {
      return getDelegatorId()
    },
    get getSearchResults() {
      return getSearchResults()
    },
    get getSearchStatus() {
      return getSearchStatus()
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
