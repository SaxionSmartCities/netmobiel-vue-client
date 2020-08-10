// @ts-ignore
import VueJwtDecode from 'vue-jwt-decode'
import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { ProfileState } from '@/store/profile-service/types'
// @ts-ignore
const psBuilder: ModuleBuilder = getStoreBuilder().module('ps')

function setUserToken(state: ProfileState, token: any) {
  state.user.accessToken = token

  let decodedObject = VueJwtDecode.decode(token)
  state.user.givenName = decodedObject['given_name']
  state.user.familyName = decodedObject['family_name']
  state.user.email = decodedObject['email']
  state.user.fullName = decodedObject['name']
}

function deleteAccessToken(state: ProfileState, payload: any) {
  state.user.accessToken = null
}

function setProfile(state: ProfileState, payload: any) {
  state.user.profile = payload
}

function setProfileImage(state: ProfileState, payload: any) {
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

function setCreditAmount(state: ProfileState, payload: any) {
  state.user.credits.creditAmount = payload
}
function setCreditHistory(state: ProfileState, payload: any) {
  state.user.credits.creditHistory = payload
}
function setReviewOptionsValue(state: ProfileState, payload: any) {
  state.user.reviews.filter(function(item) {
    if (item.name === payload.key) {
      item.value = payload.value
      return item
    }
  })
}

function setRidePlanOptions(state: ProfileState, payload: any) {
  state.user.profile.ridePlanOptions = payload
}

function addRidePlanOptionsCar(state: ProfileState, payload: any) {
  let isPresent = false
  const currentCars = state.user.profile.ridePlanOptions.cars
  for (let i = 0; i < currentCars.length; i++) {
    if (payload.licensePlate === currentCars[i].licensePlate) {
      isPresent = true
      break
    }
  }
  if (!isPresent) {
    state.user.profile.ridePlanOptions.cars.push(payload)
  }
}

function setPrivacySecurityValue(state: ProfileState, payload: any) {
  state.user.privacySecurity.filter(function(item) {
    if (item.name === payload.key) {
      item.value = payload.value
      return item
    }
  })
}

function setComplimentTypes(state: ProfileState, complimentTypes: any) {
  state.complimentTypes = complimentTypes
}

export default {
  setUserToken: psBuilder.commit(setUserToken),
  deleteAccessToken: psBuilder.commit(deleteAccessToken),
  setProfile: psBuilder.commit(setProfile),
  setProfileImage: psBuilder.commit(setProfileImage),
  setNotificationOptionsValue: psBuilder.commit(setNotificationOptionsValue),
  setTripOptionsValue: psBuilder.commit(setTripOptionsValue),
  setCreditAmount: psBuilder.commit(setCreditAmount),
  setCreditHistory: psBuilder.commit(setCreditHistory),
  setReviewOptionsValue: psBuilder.commit(setReviewOptionsValue),
  setRidePlanOptions: psBuilder.commit(setRidePlanOptions),
  addRidePlanOptionsCar: psBuilder.commit(addRidePlanOptionsCar),
  setPrivacySecurityValue: psBuilder.commit(setPrivacySecurityValue),
  setComplimentTypes: psBuilder.commit(setComplimentTypes),
}
