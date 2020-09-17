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

  return {
    get getUser() {
      return getUser()
    },
    get getProfile() {
      return getProfile()
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
  }
}
