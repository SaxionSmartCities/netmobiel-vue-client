import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import CommunityOverviewPage from './pages/community/CommunityOverviewPage.vue'
import InboxPage from './pages/community/messages/InboxPage.vue'
import ConversationPage from './pages/community/messages/ConversationPage.vue'
import ItineraryDetailPage from './pages/planner/ItineraryDetailPage.vue'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/home/HomePage.vue'
import HowToPage from './pages/home/HowToPage.vue'
import ModeSelectionPage from './pages/planner/ModeSelectionPage.vue'
import NotificationOptionsPage from './pages/profile/NotificationOptionsPage.vue'
import OnboardingComplete from './pages/OnboardingComplete.vue'
import OnboardingPage from './pages/OnboardingPage.vue'
import PrivacySecurityPage from './pages/profile/PrivacySecurityPage.vue'
import PrivacyStatementPage from './pages/profile/PrivacyStatementPage.vue'
import CarsPage from './pages/planner/CarsPage.vue'
import CarAddPage from './pages/planner/CarAddPage.vue'
import CarEditPage from './pages/planner/CarEditPage.vue'
import ProfilePage from './pages/profile/ProfilePage.vue'
import SearchLocationPage from './pages/planner/SearchLocationPage'
import SearchOptionsPage from './pages/planner/SearchOptionsPage'
import SearchPage from './pages/planner/SearchPage.vue'
import SearchResultsPage from './pages/planner/SearchResultsPage.vue'
import TermsOfUsePage from './pages/profile/TermsOfUsePage.vue'
import RegistrationPage from './pages/RegistrationPage.vue'
import RideDetailPage from './pages/home/RideDetailPage.vue'
import RidePlanPage from './pages/planner/RidePlanPage.vue'
import RidePlanOptionsPage from './pages/planner/RidePlanOptionsPage.vue'
import RidePlanSubmitted from './pages/planner/RidePlanSubmitted.vue'
import TripsOverviewPage from './pages/saved/TripsOverviewPage.vue'

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
      path: '/rideDetailPage/:id',
      component: RideDetailPage,
      name: 'rideDetailPage',
      props: true,
    },
    {
      path: '/howTo',
      component: HowToPage,
      name: 'howToPage',
    },
    {
      path: '/modeSelection',
      component: ModeSelectionPage,
      name: 'modeSelectionPage',
    },
    {
      path: '/Cars',
      component: CarsPage,
      name: 'CarsPage',
    },
    {
      path: '/AddCar',
      component: CarAddPage,
      name: 'CarAddPage',
    },
    {
      path: '/EditCar',
      component: CarEditPage,
      name: 'CarEditPage',
    },
    {
      path: '/onboardingPage',
      component: OnboardingPage,
      name: 'onboardingPage',
    },
    {
      path: '/onboardingComplete',
      component: OnboardingComplete,
      name: 'onboardingComplete',
    },
    {
      path: '/inbox',
      component: InboxPage,
      name: 'inbox',
    },
    {
      path: '/community',
      component: CommunityOverviewPage,
      name: 'community',
    },
    {
      path: '/conversation/:id',
      component: ConversationPage,
      props: true,
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
