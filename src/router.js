import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import HomePage from './pages/HomePage.vue'
import ItineraryDetailPage from './pages/ItineraryDetailPage.vue'
import LandingPage from './pages/LandingPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import SearchPage from './pages/SearchPage.vue'
import SearchResultsPage from './pages/SearchResultsPage.vue'
import StartRegistrationPage from './pages/StartRegistrationPage.vue'

import SearchPageOptions from './views/search/RidePreferences'
import SearchRideDate from './views/search/SearchRideDate'
import SearchLocation from './views/search/SearchLocation'
import SavedRides from './views/saved/SavedRides'
import TermsOfUse from './views/profile/TermsOfUse'
import PrivacyStatement from './views/profile/PrivacyStatement'
import PrivacySecurity from './views/profile/PrivacySecurity'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LandingPage,
      name: 'landingPage',
    },
    {
      path: '/home',
      component: HomePage,
      name: 'homePage',
    },
    {
      path: '/createUser',
      component: StartRegistrationPage,
      name: 'startRegistrationPage',
    },
    {
      path: '/profile',
      component: ProfilePage,
      name: 'profilePage',
    },
    {
      path: '/search',
      component: SearchPage,
      name: 'searchPage',
    },
    {
      path: '/ridePreferences',
      component: SearchPageOptions,
      name: 'ridePreferences',
    },
    {
      path: '/searchRideDate',
      component: SearchRideDate,
      name: 'searchRideDate',
    },
    {
      path: '/searchLocation',
      component: SearchLocation,
      name: 'searchLocation',
    },
    {
      path: '/savedRides',
      component: SavedRides,
      name: 'savedRides',
    },
    {
      path: '/searchResults',
      component: SearchResultsPage,
      name: 'searchResults',
    },
    {
      path: '/termsOfUse',
      component: TermsOfUse,
      name: 'termsOfUse',
    },
    {
      path: '/privacyStatement',
      component: PrivacyStatement,
      name: 'privacyStatement',
    },
    {
      path: '/privacySecurity',
      component: PrivacySecurity,
      name: 'privacySecurity',
    },
    {
      path: '/itineraryDetailPage',
      component: ItineraryDetailPage,
      name: 'itineraryDetailPage',
    },
  ],
})

router.beforeEach((to, from, next) => {
  store.commit('hideBackButton')
  store.commit('enableFooter')
  store.commit('enableHeader')

  if (
    to.path !== '/' &&
    to.path !== '/createUser' &&
    store.getters.getUser.accessToken === undefined
  ) {
    next('/')
  } else {
    next()
  }
})

export default router
