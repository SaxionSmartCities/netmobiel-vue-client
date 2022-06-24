import { ModuleBuilder } from 'vuex-typex'
import {
  ComplimentType,
  Delegation,
  emptyPublicUser,
  UserEvent,
  Place,
  Profile,
  ProfileState,
  PublicProfile,
  SurveyInteraction,
  User,
  Version,
} from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import { decodeJwt } from '@/utils/Utils'
import { Page } from '@/store/types'
import { assignPageResults, emptyPage } from '@/store/storeHelper'
import moment from 'moment'

function setUser(state: ProfileState, user: User) {
  state.realUser = user
}

function setProfile(state: ProfileState, payload: Profile) {
  state.profile = payload
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
  state.favoriteLocations = assignPageResults(state.favoriteLocations, places)
}

function setDelegations(state: ProfileState, delegations: Page<Delegation>) {
  state.delegations = assignPageResults(state.delegations, delegations)
}

function setDelegation(state: ProfileState, delegation: Delegation | null) {
  state.delegation = delegation
}

function setDelegateProfile(state: ProfileState, profile: Profile) {
  state.delegateProfile = profile
}

function setDelegatorId(state: ProfileState, profileId: string) {
  state.delegatorId = profileId
}

function resetDelegate(state: ProfileState) {
  if (state.delegateProfile) {
    state.profile = state.delegateProfile
  }
  state.delegateProfile = null
  state.delegatorId = null
}

function setSearchKeyword(state: ProfileState, keyword: string) {
  state.search.keyword = keyword
}

function setSearchResults(state: ProfileState, results: Page<PublicProfile>) {
  state.search.results = assignPageResults(state.search.results, results)
}

function setSurveyInteraction(
  state: ProfileState,
  payload: SurveyInteraction | null
) {
  state.surveyInteraction = payload
}

function setVersion(state: ProfileState, version: Version) {
  state.version = version
}

function addUserEvent(state: ProfileState, event: UserEvent) {
  const ev = { ...event }
  if (!ev.eventTime) {
    ev.eventTime = moment().toISOString()
  }
  if (state.sessionLog == null) {
    state.sessionLog = {
      userAgent: navigator.userAgent,
      userEvents: [],
    }
  }
  state.sessionLog.userEvents.push(ev)
}

/**
 * Clears the session log by removing the first n entries from the log.
 * @param state
 * @param n
 */
function cleaUserEvents(state: ProfileState, n: number) {
  if (state.sessionLog) {
    state.sessionLog.userEvents = state.sessionLog.userEvents.slice(n)
  }
}

export const buildMutations = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    setUser: psBuilder.commit(setUser),
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
    setDelegation: psBuilder.commit(setDelegation),
    setDelegateProfile: psBuilder.commit(setDelegateProfile),
    setDelegatorId: psBuilder.commit(setDelegatorId),
    resetDelegate: psBuilder.commit(resetDelegate),
    setSearchKeyword: psBuilder.commit(setSearchKeyword),
    setSearchResults: psBuilder.commit(setSearchResults),
    setSurveyInteraction: psBuilder.commit(setSurveyInteraction),
    setVersion: psBuilder.commit(setVersion),
    addUserEvent: psBuilder.commit(addUserEvent),
    clearUserEvents: psBuilder.commit(cleaUserEvents),
  }
}
