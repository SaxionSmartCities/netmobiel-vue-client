import { ModuleBuilder } from 'vuex-typex'
import {
  ComplimentType,
  Delegation,
  emptyPublicUser,
  Place,
  Profile,
  ProfileState,
  PublicProfile,
  RidePlanOptions,
  SurveyInteraction,
  Version,
} from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import { decodeJwt } from '@/utils/Utils'
import { Page } from '@/store/types'
import { assignPageResults, emptyPage } from '@/store/storeHelper'

function setUserToken(state: ProfileState, token: string) {
  state.user.accessToken = token
  const decodedObject = decodeJwt(token)
  state.user.managedIdentity = decodedObject['sub']
  state.user.givenName = decodedObject['given_name']
  state.user.familyName = decodedObject['family_name']
  state.user.email = decodedObject['email']
  state.user.fullName = decodedObject['name']
  state.user.roles = decodedObject['realm_access']?.roles
}

function deleteAccessToken(state: ProfileState) {
  state.user.accessToken = null
  state.user.managedIdentity = null
}

function setProfile(state: ProfileState, payload: Profile) {
  state.user.profile = payload
}

function setComplimentTypes(
  state: ProfileState,
  complimentTypes: ComplimentType[]
) {
  state.complimentTypes = complimentTypes
}

function getOrCreatePublicUser(state: ProfileState, profileId: string) {
  let usr = state.publicUsers.get(profileId)
  if (!usr) {
    usr = Object.assign({}, emptyPublicUser)
    state.publicUsers.set(profileId, usr)
  }
  return usr
}

function addPublicProfile(state: ProfileState, profile: PublicProfile) {
  if (profile.id !== null) {
    const usr = getOrCreatePublicUser(state, profile.id)
    usr.profile = profile
    // Brute force reactivity, is this really needed?
    state.publicUsers = new Map(state.publicUsers)
  }
}

function clearPublicProfile(state: ProfileState, profileId: string) {
  const usr = getOrCreatePublicUser(state, profileId)
  usr.profile = Object.assign({}, emptyPublicUser.profile)
  // Brute force reactivity, is this really needed?
  state.publicUsers = new Map(state.publicUsers)
}

function addPublicCompliments(state: ProfileState, payload: any) {
  if (payload && payload.profileId) {
    const usr = getOrCreatePublicUser(state, payload.profileId)
    usr.compliments = assignPageResults(usr.compliments, payload.compliments)
  }
  // Brute force reactivity, is this really needed?
  state.publicUsers = new Map(state.publicUsers)
}

function clearPublicCompliments(state: ProfileState, profileId: string) {
  const usr = getOrCreatePublicUser(state, profileId)
  usr.compliments = emptyPage
  // Brute force reactivity, is this really needed?
  state.publicUsers = new Map(state.publicUsers)
}

function addPublicReviews(state: ProfileState, payload: any) {
  if (payload && payload.profileId) {
    const usr = getOrCreatePublicUser(state, payload.profileId)
    usr.reviews = assignPageResults(usr.reviews, payload.reviews)
  }
  // Brute force reactivity, is this really needed?
  state.publicUsers = new Map(state.publicUsers)
}

function clearPublicReviews(state: ProfileState, profileId: string) {
  const usr = getOrCreatePublicUser(state, profileId)
  usr.reviews = emptyPage
  // Brute force reactivity, is this really needed?
  state.publicUsers = new Map(state.publicUsers)
}

function setFavoriteLocations(state: ProfileState, places: Page<Place>) {
  state.user.favoriteLocations = assignPageResults(
    state.user.favoriteLocations,
    places
  )
}

function setDelegations(state: ProfileState, delegations: Delegation[]) {
  state.user.delegations = delegations
}

function setDelegateProfile(state: ProfileState, profile: Profile) {
  state.user.delegateProfile = profile
}

function setDelegatorId(state: ProfileState, profileId: string) {
  state.user.delegatorId = profileId
}

function resetDelegate(state: ProfileState) {
  if (state.user.delegateProfile) {
    state.user.profile = state.user.delegateProfile
  }
  state.user.delegateProfile = null
  state.user.delegatorId = null
}

function setSearchKeyword(state: ProfileState, keyword: string) {
  state.search.keyword = keyword
}

function setSearchStatus(state: ProfileState, status: string) {
  state.search.status = status
}

function setSearchResults(state: ProfileState, results: Page<PublicProfile>) {
  state.search.results = assignPageResults(state.search.results, results)
}

function setSurveyInteraction(
  state: ProfileState,
  payload: SurveyInteraction | null
) {
  state.user.surveyInteraction = payload
}

function setVersion(state: ProfileState, version: Version) {
  state.version = version
}

export const buildMutations = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    setUserToken: psBuilder.commit(setUserToken),
    deleteAccessToken: psBuilder.commit(deleteAccessToken),
    setProfile: psBuilder.commit(setProfile),
    setComplimentTypes: psBuilder.commit(setComplimentTypes),
    addPublicProfile: psBuilder.commit(addPublicProfile),
    clearPublicProfile: psBuilder.commit(clearPublicProfile),
    addPublicCompliments: psBuilder.commit(addPublicCompliments),
    clearPublicCompliments: psBuilder.commit(clearPublicCompliments),
    addPublicReviews: psBuilder.commit(addPublicReviews),
    clearPublicReviews: psBuilder.commit(clearPublicReviews),
    setFavoriteLocations: psBuilder.commit(setFavoriteLocations),
    setDelegations: psBuilder.commit(setDelegations),
    setDelegateProfile: psBuilder.commit(setDelegateProfile),
    setDelegatorId: psBuilder.commit(setDelegatorId),
    resetDelegate: psBuilder.commit(resetDelegate),
    setSearchKeyword: psBuilder.commit(setSearchKeyword),
    setSearchResults: psBuilder.commit(setSearchResults),
    setSearchStatus: psBuilder.commit(setSearchStatus),
    setSurveyInteraction: psBuilder.commit(setSurveyInteraction),
    setVersion: psBuilder.commit(setVersion),
  }
}
