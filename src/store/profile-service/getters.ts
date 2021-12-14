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

  const getDeviceFcmToken = psBuilder.read((state: ProfileState) => {
    return state.deviceFcmToken
  }, 'getDeviceFcmToken')

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
    get getDeviceFcmToken() {
      return getDeviceFcmToken()
    },
  }
}
