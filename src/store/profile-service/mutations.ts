// @ts-ignore
import VueJwtDecode from 'vue-jwt-decode'
import { ModuleBuilder } from 'vuex-typex'
import {
  Compliment,
  ComplimentType,
  CoronaCheck,
  Place,
  Profile,
  ProfileState,
  PublicProfile,
  RidePlanOptions,
  Review,
  Delegation,
} from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'

function setUserToken(state: ProfileState, token: string) {
  state.user.accessToken = token
  let decodedObject = VueJwtDecode.decode(token)
  state.user.givenName = decodedObject['given_name']
  state.user.familyName = decodedObject['family_name']
  state.user.email = decodedObject['email']
  state.user.fullName = decodedObject['name']
}

function deleteAccessToken(state: ProfileState) {
  state.user.accessToken = null
}

function setProfile(state: ProfileState, payload: Profile) {
  state.user.profile = payload
}

function setProfileImage(state: ProfileState, payload: string) {
  state.user.profile.image = payload
}

function setNotificationOptionsValue(state: ProfileState, payload: any) {
  state.user.notificationOptions.filter(function(item) {
    if (item.name === payload.key) {
      item.value = payload.value
      return item
    }
  })
}

function setTripOptionsValue(state: ProfileState, payload: any) {
  state.user.tripOptions.filter(function(item) {
    if (item.name === payload.key) {
      item.value = payload.value
      return
    }
  })
}

function setReviewOptionsValue(state: ProfileState, payload: any) {
  state.user.reviews.filter(function(item) {
    if (item.name === payload.key) {
      item.value = payload.value
      return item
    }
  })
}

function setRidePlanOptions(state: ProfileState, payload: RidePlanOptions) {
  state.user.profile.ridePlanOptions = payload
}

function setPrivacySecurityValue(state: ProfileState, payload: any) {
  state.user.privacySecurity.filter(function(item) {
    if (item.name === payload.key) {
      item.value = payload.value
      return item
    }
  })
}

function setCoronaCheck(state: ProfileState, payload: CoronaCheck) {
  state.user.coronaCheck = payload
}

function setComplimentTypes(
  state: ProfileState,
  complimentTypes: ComplimentType[]
) {
  state.complimentTypes = complimentTypes
}

function setPublicProfile(state: ProfileState, profile: PublicProfile) {
  state.externalUser.profile = profile
}

function setPublicCompliments(state: ProfileState, compliments: Compliment[]) {
  state.externalUser.compliments = compliments
}

function setPublicReviews(state: ProfileState, reviews: Review[]) {
  state.externalUser.reviews = reviews
}

function setFavoriteLocations(state: ProfileState, places: Place[]) {
  state.user.profile.favoriteLocations = places
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

function setSearchResults(state: ProfileState, results: PublicProfile[]) {
  state.search.results = results
}

export const buildMutations = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    setUserToken: psBuilder.commit(setUserToken),
    deleteAccessToken: psBuilder.commit(deleteAccessToken),
    setProfile: psBuilder.commit(setProfile),
    setProfileImage: psBuilder.commit(setProfileImage),
    setNotificationOptionsValue: psBuilder.commit(setNotificationOptionsValue),
    setTripOptionsValue: psBuilder.commit(setTripOptionsValue),
    setReviewOptionsValue: psBuilder.commit(setReviewOptionsValue),
    setRidePlanOptions: psBuilder.commit(setRidePlanOptions),
    setPrivacySecurityValue: psBuilder.commit(setPrivacySecurityValue),
    setCoronaCheck: psBuilder.commit(setCoronaCheck),
    setComplimentTypes: psBuilder.commit(setComplimentTypes),
    setPublicProfile: psBuilder.commit(setPublicProfile),
    setPublicCompliments: psBuilder.commit(setPublicCompliments),
    setPublicReviews: psBuilder.commit(setPublicReviews),
    setFavoriteLocations: psBuilder.commit(setFavoriteLocations),
    setDelegations: psBuilder.commit(setDelegations),
    setDelegateProfile: psBuilder.commit(setDelegateProfile),
    setDelegatorId: psBuilder.commit(setDelegatorId),
    resetDelegate: psBuilder.commit(resetDelegate),
    setSearchKeyword: psBuilder.commit(setSearchKeyword),
    setSearchResults: psBuilder.commit(setSearchResults),
  }
}
