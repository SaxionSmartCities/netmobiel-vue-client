import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import SearchPage from './pages/SearchPage.vue'
import SearchOptionsPage from './pages/SearchOptionsPage'
import SearchDateTimePage from './pages/SearchDateTimePage'
import SearchLocationPage from './pages/SearchLocationPage'
import ItineraryDetailPage from './pages/ItineraryDetailPage.vue'
import SearchResultsPage from './pages/SearchResultsPage.vue'

import SavedRides from './views/saved/SavedRides'
import TermsOfUse from './views/profile/TermsOfUse'
import PrivacyStatement from './views/profile/PrivacyStatement'
import PrivacySecurity from './views/profile/PrivacySecurity'
import GoalsHomepage from './views/marketplace/GoalsHomepage'
import NotificationOptions from './views/profile/NotificationOptions'
import ProfilePage from './views/profile/ProfilePage.vue'
import StartRegistrationForm from './views/registration/StartRegistrationForm.vue'

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
      component: StartRegistrationForm,
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
      path: '/searchOptions',
      component: SearchOptionsPage,
      name: 'searchOptions',
    },
    {
      path: '/searchDateTime',
      component: SearchDateTimePage,
      name: 'searchDateTime',
    },
    {
      path: '/searchLocation/:field',
      component: SearchLocationPage,
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
      path: '/goals',
      component: GoalsHomepage,
      name: 'goals',
    },
    {
      path: '/itineraryDetailPage',
      component: ItineraryDetailPage,
      name: 'itineraryDetailPage',
    },
    {
      path: '/profileNotificationOptions',
      component: NotificationOptions,
      name: 'notificationOptions',
    },
  ],
})

router.beforeEach((to, from, next) => {
  store.commit('ui/hideBackButton')
  store.commit('ui/enableFooter')
  store.commit('ui/enableHeader')

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
