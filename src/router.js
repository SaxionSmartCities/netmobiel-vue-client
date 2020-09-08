import Vue from 'vue'
import Router from 'vue-router'

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
import RideDetailPage from './pages/saved/RideDetailPage.vue'
import RidePlanPage from './pages/planner/RidePlanPage.vue'
import RidePlanOptionsPage from './pages/planner/RidePlanOptionsPage.vue'
import RidePlanSubmitted from './pages/planner/RidePlanSubmitted.vue'
import TripPlanSubmitted from './pages/planner/TripPlanSubmitted.vue'
import TripsOverviewPage from './pages/saved/TripsOverviewPage.vue'
import CharityOverviewPage from './pages/community/goals/CharityOverviewPage'
import CharityDetailPage from './pages/community/goals/CharityDetailsPage'
import TripCancelledPage from './pages/saved/TripCancelledPage'
import TripDetailPage from './pages/saved/TripDetailPage'
import ShoutOutOverviewPage from '@/pages/community/shoutout/ShoutOutOverviewPage'
import ShoutOutDetailPage from '@/pages/community/shoutout/ShoutOutDetailPage'
import Account from '@/pages/profile/Account'
import DriverReviewPage from './pages/review/DriverReviewPage'
import TripReviewedPage from './pages/review/TripReviewedPage'
import TripConfirmedPage from './pages/review/TripConfirmedPage'
import SupportGoal from './pages/community/goals/SupportGoal'
import Donated from './pages/community/goals/Donated'
import RideSafeNetmobiel from '@/pages/profile/RideSafeNetmobiel'
import About from '@/pages/profile/About'
import UserProfile from '@/pages/profile/UserProfile'
import Purchase from '@/pages/profile/credits/Purchase'
import ConfirmDeposit from '@/pages/profile/credits/ReturnAfterDeposit'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/createUser',
      component: RegistrationPage,
      name: 'createUser',
    },
    {
      path: '/credits',
      component: Credits,
      name: 'credits',
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
      path: '/charityOverviewPage',
      component: CharityOverviewPage,
      name: 'charityOverviewPage',
    },
    {
      path: '/charityDetailsPage/:id',
      component: CharityDetailPage,
      name: 'charityDetails',
      props: true,
    },
    {
      path: '/supportGoal/:id',
      component: SupportGoal,
      name: 'supportGoal',
      props: true,
    },
    {
      path: '/donated/:name',
      component: Donated,
      name: 'donated',
      props: true,
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
      path: '/searchOptions',
      component: SearchOptionsPage,
      name: 'searchOptions',
    },
    {
      path: '/searchLocation/:field;:editSearchCriteria',
      component: SearchLocationPage,
      name: 'searchLocation',
      props: true,
    },
    {
      path: '/searchResults/:tripId',
      component: SearchResultsPage,
      name: 'searchResults',
      props: true,
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
      path: '/shoutout/:id;:isMine',
      component: ShoutOutDetailPage,
      name: 'shoutout',
      props: true,
    },
    {
      path: '/account',
      component: Account,
      name: 'account',
    },
    {
      path: '/reviewDriver/:tripContext',
      name: 'reviewDriver',
      component: DriverReviewPage,
      props: true,
    },
    {
      path: '/tripReviewed',
      component: TripReviewedPage,
      name: 'tripReviewedPage',
    },
    {
      path: '/tripConfirmed',
      component: TripConfirmedPage,
      name: 'tripConfirmedPage',
    },
    {
      path: '/about',
      component: About,
      name: 'about',
    },
    {
      path: '/rideSafeNetmobiel',
      component: RideSafeNetmobiel,
      name: 'rideSafeNetmobiel',
    },
    {
      path: '/userProfilePage/:profileId',
      component: UserProfile,
      name: 'userProfile',
      props: true,
    },
    {
      path: '/addCredits',
      component: Purchase,
      name: 'purchaseCredits',
    },
    {
      path: '/returnAfterDeposit',
      component: ConfirmDeposit,
      name: 'confirmDeposit',
    },
  ],
})
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

router.beforeEach((to, from, next) => {
  uiStore.mutations.hideBackButton()
  uiStore.mutations.enableFooter()
  uiStore.mutations.enableHeader()

  if (
    to.path !== '/' &&
    to.path !== '/createUser' &&
    psStore.getters.getUser.accessToken === undefined
  ) {
    next('/')
  } else {
    next()
  }
})

export default router
