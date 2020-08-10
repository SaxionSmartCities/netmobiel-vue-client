import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { ProfileState } from '@/store/profile-service/types'
// @ts-ignore
const psBuilder: ModuleBuilder = getStoreBuilder().module('ps')

const getUser = psBuilder.read((state: ProfileState) => {
  return state.user
}, 'getUser')

const getProfile = psBuilder.read((state: ProfileState) => {
  return state.user.profile
}, 'getProfile')

const getCreditAmount = psBuilder.read((state: ProfileState) => {
  return state.user.credits.creditAmount
}, 'getCreditAmount')

const getCreditHistory = psBuilder.read((state: ProfileState) => {
  return state.user.credits.creditHistory
}, 'getCreditHistory')

const getComplimentTypes = psBuilder.read((state: ProfileState) => {
  return state.complimentTypes
}, 'getComplimentTypes')

export default {
  get getUser() {
    return getUser()
  },
  get getProfile() {
    return getProfile()
  },
  get getCreditAmount() {
    return getCreditAmount()
  },
  get getCreditHistory() {
    return getCreditHistory()
  },
  get getComplimentTypes() {
    return getComplimentTypes()
  },
}
