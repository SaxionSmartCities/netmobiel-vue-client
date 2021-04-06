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

  const getExternalUser = psBuilder.read((state: ProfileState) => {
    return state.externalUser
  }, 'getExternalUser')

  const getComplimentTypes = psBuilder.read((state: ProfileState) => {
    return state.complimentTypes
  }, 'getComplimentTypes')

  const getCoronaCheck = psBuilder.read((state: ProfileState) => {
    return state.user.coronaCheck
  }, 'getCoronaCheck')

  const passedCoronaCheck = psBuilder.read((state: ProfileState) => {
    return (
      state.user.coronaCheck.coronaSymptoms &&
      state.user.coronaCheck.houseHoldHadCorona
    )
  }, 'passedCoronaCheck')

  const getDelegations = psBuilder.read((state: ProfileState) => {
    return state.user.delegations
  }, 'getDelegations')

  const getDelegatorId = psBuilder.read((state: ProfileState) => {
    return state.user.delegatorId
  }, 'getDelegatorId')

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
    get getExternalUser() {
      return getExternalUser()
    },
    get getComplimentTypes() {
      return getComplimentTypes()
    },
    get getCoronaCheck() {
      return getCoronaCheck()
    },
    get passedCoronaCheck() {
      return passedCoronaCheck()
    },
    get getDelegations() {
      return getDelegations()
    },
    get getDelegatorId() {
      return getDelegatorId()
    },
  }
}
