import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import HomePage from './pages/HomePage.vue'
import ItineraryDetailPage from './pages/ItineraryDetailPage.vue'
import LandingPage from './pages/LandingPage.vue'
import PrivacySecurityPage from './pages/PrivacySecurityPage.vue'
import PrivacyStatementPage from './pages/PrivacyStatementPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import RidePreferencesPage from './pages/RidePreferencesPage.vue'
import SavedRidesPage from './pages/SavedRidesPage.vue'
import SearchLocationPage from './pages/SearchLocationPage.vue'
import SearchPage from './pages/SearchPage.vue'
import SearchResultsPage from './pages/SearchResultsPage.vue'
import StartRegistrationPage from './pages/StartRegistrationPage.vue'
import TermsOfUsePage from './pages/TermsOfUsePage.vue'

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
      component: RidePreferencesPage,
      name: 'ridePreferences',
    },
    {
      path: '/searchLocation',
      component: SearchLocationPage,
      name: 'searchLocation',
    },
    {
      path: '/savedRides',
      component: SavedRidesPage,
      name: 'savedRides',
    },
    {
      path: '/searchResults',
      component: SearchResultsPage,
      name: 'searchResults',
    },
    {
      path: '/termsOfUse',
      component: TermsOfUsePage,
      name: 'termsOfUse',
    },
    {
      path: '/privacyStatement',
      component: PrivacyStatementPage,
      name: 'privacyStatement',
    },
    {
      path: '/privacySecurity',
      component: PrivacySecurityPage,
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
