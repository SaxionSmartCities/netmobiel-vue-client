import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import CommunityOverviewPage from './pages/community/CommunityOverviewPage.vue'
import Credits from './pages/profile/Creditspage.vue'
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
import ProfileCarsPage from './pages/profile/ProfileCarsPage.vue'
import ProfileAddCarPage from './pages/profile/ProfileAddCarPage.vue'
import ProfileEditCarPage from './pages/profile/ProfileEditCarPage.vue'
import ProfilePage from './pages/profile/ProfilePage.vue'
import SearchLocationPage from './pages/planner/SearchLocationPage'
import SearchOptionsPage from './pages/planner/SearchOptionsPage'
import SearchPage from './pages/planner/SearchPage.vue'
import SearchResultsPage from './pages/planner/SearchResultsPage.vue'
import TermsOfUsePage from './pages/profile/TermsOfUsePage.vue'
import RegistrationPage from './pages/RegistrationPage.vue'
import RideDetailPage from './pages/saved/RideDetailPage.vue'
import RidePlanPage from './pages/planner/RidePlanPage.vue'
import RidePlanOptionsPage from './pages/planner/RidePlanOptionsPage.vue'
import RidePlanSubmitted from './pages/planner/RidePlanSubmitted.vue'
import TripPlanSubmitted from './pages/planner/TripPlanSubmitted.vue'
import TripsOverviewPage from './pages/saved/TripsOverviewPage.vue'
import TripCancelledPage from './pages/saved/TripCancelledPage'
import TripDetailPage from './pages/saved/TripDetailPage'
import ShoutOutOverviewPage from '@/pages/community/shoutout/ShoutOutOverviewPage'
import ShoutOutDetailPage from '@/pages/community/shoutout/ShoutOutDetailPage'
import Account from '@/pages/profile/Account'
import TripCanceledPage from './pages/saved/TripCanceledPage'
import TripReviewedPage from './pages/planner/TripReviewedPage'

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
      path: '/tripPlanSubmitted',
      component: TripPlanSubmitted,
      name: 'tripPlanSubmitted',
    },
    {
      path: '/tripReviewedPage',
      component: TripReviewedPage,
      name: 'tripReviewedPage',
    },
    {
      path: '/tripPlanSubmitted',
      component: TripPlanSubmitted,
      name: 'tripPlanSubmitted',
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
      path: '/tripCancelledPage',
      component: TripCancelledPage,
      name: 'tripCancelledPage',
    },
    {
      path: '/tripDetailPage',
      component: TripDetailPage,
      name: 'tripDetailPage',
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
      path: '/conversation/:context',
      component: ConversationPage,
      name: 'conversation',
      props: true,
    },
    {
      path: '/shoutouts',
      component: ShoutOutOverviewPage,
      name: 'shoutouts',
    },
    {
      path: '/shoutout/:id',
      component: ShoutOutDetailPage,
      name: 'shoutout',
      props: true,
    },
    {
      path: '/account',
      component: Account,
      name: 'account',
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
