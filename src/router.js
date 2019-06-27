import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import SplashScreen from './views/splashscreen/SplashScreen.vue'
import ProfilePage from './views/profile/ProfilePage.vue'
import StartRegistrationForm from './views/registration/StartRegistrationForm.vue'
import HomePage from './views/home/HomePage.vue'
import SearchPage from './views/search/SearchPage.vue'
import SearchPageOptions from './views/search/RidePreferences'
import SearchRideDate from './views/search/SearchRideDate'
import SearchLocation from './views/search/SearchLocation'
import SavedRides from './views/saved/SavedRides'
import SearchResults from './views/search-results/SearchResults.vue'
import TermsOfUse from './views/profile/TermsOfUse'
import PrivacyStatement from './views/profile/PrivacyStatement'
import PrivacySecurity from './views/profile/PrivacySecurity'
import GoalsHomepage from './views/marketplace/GoalsHomepage'
import ItineraryDetailPage from './views/itinerary-details/ItineraryDetailPage.vue'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: SplashScreen,
    },
    {
      path: '/home',
      component: HomePage,
    },
    {
      path: '/createUser',
      component: StartRegistrationForm,
    },
    {
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/search',
      component: SearchPage,
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
      component: SearchResults,
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
      path: '/goals',
      component: GoalsHomepage,
      name: 'goals',
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
