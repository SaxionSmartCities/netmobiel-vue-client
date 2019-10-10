import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import ItineraryDetailPage from './pages/ItineraryDetailPage.vue'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import HowToPage from './pages/HowToPage.vue'
import NotificationOptionsPage from './pages/NotificationOptionsPage.vue'
import PrivacySecurityPage from './pages/PrivacySecurityPage.vue'
import PrivacyStatementPage from './pages/PrivacyStatementPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import SearchLocationPage from './pages/SearchLocationPage'
import SearchOptionsPage from './pages/SearchOptionsPage'
import SearchPage from './pages/SearchPage.vue'
import SearchResultsPage from './pages/SearchResultsPage.vue'
import TermsOfUsePage from './pages/TermsOfUsePage.vue'
import RideDetailPage from './pages/RideDetailPage.vue'
import RidePlanPage from './pages/RidePlanPage.vue'
import RegistrationPage from './pages/RegistrationPage.vue'
import RidePlanOptionsPage from './pages/RidePlanOptionsPage.vue'
import RidePlanSubmitted from './pages/RidePlanSubmitted.vue'
import TripsOverviewPage from './pages/TripsOverviewPage.vue'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LandingPage,
    },
    {
      path: '/home',
      component: HomePage,
    },
    {
      path: '/createUser',
      component: RegistrationPage,
      name: 'createUser',
    },
    {
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/search',
      component: SearchPage,
      name: 'searchRide',
    },
    {
      path: '/plan',
      component: RidePlanPage,
      name: 'planRide',
    },
    {
      path: '/planOptions',
      component: RidePlanOptionsPage,
      name: 'planOptions',
    },
    {
      path: '/planSubmitted',
      component: RidePlanSubmitted,
      name: 'planSubmitted',
    },
    {
      path: '/searchOptions',
      component: SearchOptionsPage,
      name: 'searchOptions',
    },
    {
      path: '/searchLocation/:field',
      component: SearchLocationPage,
      name: 'searchLocation',
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
    {
      path: '/profileNotificationOptions',
      component: NotificationOptionsPage,
      name: 'notificationOptions',
    },
    {
      path: '/tripsOverviewPage',
      component: TripsOverviewPage,
      name: 'tripsOverviewPage',
    },
    {
      path: '/rideDetailPage',
      component: RideDetailPage,
      name: 'rideDetailPage',
    },
    {
      path: '/howTo',
      component: HowToPage,
      name: 'howToPage',
    },
  ],
})

router.beforeEach((to, from, next) => {
  store.commit('ui/hideBackButton')
  store.commit('ui/enableFooter')
  store.commit('ui/enableHeader')
  store.commit('ui/clearAppClasses')

  if (
    to.path !== '/' &&
    to.path !== '/createUser' &&
    store.getters['ps/getUser'].accessToken === undefined
  ) {
    next('/')
  } else {
    next()
  }
})

export default router
