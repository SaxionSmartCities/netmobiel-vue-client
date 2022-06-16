import { ModuleBuilder } from 'vuex-typex'
import { ProfileState } from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import Vue from 'vue'

function hasRealmRole(role: string): boolean {
  return Vue.prototype.$keycloak.hasRealmRole(role)
}

export const buildGetters = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  const getRealUser = psBuilder.read((state: ProfileState) => {
    return state.realUser
  }, 'getRealUser')

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
    // Note: Update the user before using it
    get getRealUser() {
      return getRealUser()
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
      return hasRealmRole('delegate')
    },
    get canActAsTreasurer() {
      return hasRealmRole('treasurer') || hasRealmRole('admin')
    },
    get getVersion() {
      return getVersion()
    },
  }
}
