import Vue from 'vue'
import Router from 'vue-router'
import CommunityOverviewPage from './pages/community/CommunityOverviewPage.vue'
import CreditsPage from './pages/profile/CreditsPage.vue'
import InboxPage from './pages/community/messages/InboxPage.vue'
import ConversationPage from './pages/community/messages/ConversationPage.vue'
import ItineraryDetailPage from './pages/planner/ItineraryDetailPage.vue'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/home/HomePage.vue'
import HowToPage from './pages/home/HowToPage.vue'
import ModeSelectionPage from './pages/planner/ModeSelectionPage.vue'
import NotificationOptionsPage from './pages/profile/NotificationOptionsPage.vue'
import OnboardingCompletedPage from './pages/OnboardingCompletedPage.vue'
import OnboardingPage from './pages/OnboardingPage.vue'
import CarsPage from './pages/planner/CarsPage.vue'
import CarAddPage from './pages/planner/CarAddPage.vue'
import ProfilePage from './pages/profile/ProfilePage.vue'
import SearchLocationPage from './pages/planner/SearchLocationPage'
import SearchOptionsPage from './pages/planner/SearchOptionsPage'
import SearchPage from './pages/planner/SearchPage.vue'
import SearchResultsPage from './pages/planner/SearchResultsPage.vue'
import RegistrationPage from './pages/RegistrationPage.vue'
import RideDetailPage from './pages/trips/RideDetailPage.vue'
import RidePlanPage from './pages/planner/RidePlanPage.vue'
import RidePlanOptionsPage from './pages/planner/RidePlanOptionsPage.vue'
import RidePlanSubmittedPage from './pages/planner/RidePlanSubmittedPage.vue'
import TripPlanSubmittedPage from './pages/planner/TripPlanSubmittedPage.vue'
import TripsOverviewPage from './pages/trips/TripsOverviewPage.vue'
import CharityOverviewPage from './pages/community/goals/CharityOverviewPage'
import CharityDetailPage from './pages/community/goals/CharityDetailsPage'
import TripCancelledPage from './pages/trips/TripCancelledPage'
import TripDetailPage from './pages/trips/TripDetailPage'
import TripConfirmPage from './pages/trips/TripConfirmPage'
import TripConfirmedPage from './pages/trips/TripConfirmedPage'
import ShoutOutOverviewPage from '@/pages/community/shoutout/ShoutOutOverviewPage'
import ShoutOutDriverDetailPage from '@/pages/community/shoutout/ShoutOutDriverDetailPage'
import ShoutOutPassengerDetailPage from '@/pages/community/shoutout/ShoutOutPassengerDetailPage'
import ShoutOutSubmittedPage from '@/pages/planner/ShoutOutSubmittedPage'
import AccountPage from '@/pages/profile/AccountPage'
import TripReviewedPage from './pages/trips/TripReviewedPage'
import SupportGoalPage from './pages/community/goals/SupportGoalPage'
import DonatedPage from './pages/community/goals/DonatedPage'
import AboutPage from '@/pages/profile/AboutPage'
import UserProfilePage from '@/pages/profile/UserProfilePage'
import PurchasePage from '@/pages/profile/credits/PurchasePage'
import WaitForDepositConfirmationPage from '@/pages/profile/credits/WaitForDepositConfirmationPage'
import DelegationOverviewPage from '@/pages/profile/delegation/DelegationOverviewPage'
import AddDelegationPage from '@/pages/profile/delegation/AddDelegationPage'
import NewDelegationPage from '@/pages/profile/delegation/NewDelegationPage'
import * as uiStore from '@/store/ui'
import LogoutPage from '@/pages/home/LogoutPage'
import SessionExpiredPage from '@/pages/SessionExpiredPage'
import TripUnconfirmPage from '@/pages/trips/TripUnconfirmPage'
import RideConfirmPage from '@/pages/trips/RideConfirmPage'
import RideConfirmedPage from '@/pages/trips/RideConfirmedPage'
import TripRejectedPage from '@/pages/trips/TripRejectedPage'
import RideRejectedPage from '@/pages/trips/RideRejectedPage'
import RideUnconfirmPage from '@/pages/trips/RideUnconfirmPage'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/session-expired',
      name: 'sessionExpired',
      component: SessionExpiredPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage,
    },
    {
      path: '/register-user',
      component: RegistrationPage,
      name: 'registerUser',
    },
    {
      path: '/credits',
      component: CreditsPage,
      name: 'credits',
    },
    {
      path: '/profile',
      component: ProfilePage,
      name: 'profile',
    },
    {
      path: '/profile/delegate',
      component: DelegationOverviewPage,
    },
    {
      path: '/profile/delegate/add',
      component: AddDelegationPage,
    },
    {
      path: '/profile/delegate/new',
      component: NewDelegationPage,
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
      component: SupportGoalPage,
      name: 'supportGoal',
      props: true,
    },
    {
      path: '/donated/:charityId;:charityName',
      component: DonatedPage,
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
      component: RidePlanSubmittedPage,
      name: 'planSubmitted',
    },
    {
      path: '/tripPlanSubmitted',
      component: TripPlanSubmittedPage,
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
      path: '/itineraryDetailPage/:tripId',
      component: ItineraryDetailPage,
      name: 'itineraryDetailPage',
      props: true,
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
      path: '/tripDetailPage/:tripId',
      component: TripDetailPage,
      name: 'tripDetailPage',
      props: true,
    },
    {
      path: '/tripConfirmPage/:tripId',
      component: TripConfirmPage,
      name: 'tripConfirmPage',
      props: true,
    },
    {
      path: '/tripConfirmed/:tripId',
      component: TripConfirmedPage,
      name: 'tripConfirmedPage',
      props: true,
    },
    {
      path: '/tripRejected/:tripId',
      component: TripRejectedPage,
      name: 'tripRejectedPage',
      props: true,
    },
    {
      path: '/tripReviewed/:otherRole',
      component: TripReviewedPage,
      name: 'tripReviewedPage',
      props: true,
    },
    {
      path: '/tripUnconfirmPage/:tripId',
      component: TripUnconfirmPage,
      name: 'tripUnconfirmPage',
      props: true,
    },
    {
      path: '/rideDetailPage/:rideId',
      component: RideDetailPage,
      name: 'rideDetailPage',
      props: true,
    },
    {
      path: '/rideConfirm/:rideId',
      name: 'rideConfirmPage',
      component: RideConfirmPage,
      props: true,
    },
    {
      path: '/rideConfirmed/:rideId',
      component: RideConfirmedPage,
      name: 'rideConfirmedPage',
      props: true,
    },
    {
      path: '/rideRejected/:rideId',
      component: RideRejectedPage,
      name: 'rideRejectedPage',
      props: true,
    },
    {
      path: '/rideUnconfirmPage/:rideId',
      component: RideUnconfirmPage,
      name: 'rideUnconfirmPage',
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
      path: '/onboardingPage',
      component: OnboardingPage,
      name: 'onboardingPage',
    },
    {
      path: '/onboardingComplete',
      component: OnboardingCompletedPage,
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
      path: '/conversation/:conversationId?',
      component: ConversationPage,
      name: 'conversation',
      props: true,
    },
    {
      path: '/shout-outs',
      component: ShoutOutOverviewPage,
      name: 'shoutOuts',
    },
    {
      path: '/shout-out-driver/:shoutOutId;:rideId',
      component: ShoutOutDriverDetailPage,
      name: 'shoutOutDriver',
      props: true,
    },
    {
      path: '/shout-out-passenger/:shoutOutId',
      component: ShoutOutPassengerDetailPage,
      name: 'shoutOutPassenger',
      props: true,
    },
    {
      path: '/account',
      component: AccountPage,
      name: 'account',
    },
    {
      path: '/shoutOutSubmittedPage/:shoutOutId',
      component: ShoutOutSubmittedPage,
      name: 'shoutOutSubmittedPage',
      props: true,
    },
    {
      path: '/about',
      component: AboutPage,
      name: 'about',
    },
    {
      path: '/userProfilePage/:profileId',
      component: UserProfilePage,
      name: 'userProfile',
      props: true,
    },
    {
      path: '/addCredits',
      component: PurchasePage,
      name: 'purchaseCredits',
    },
    {
      path: '/wait-for-deposit-confirmation',
      component: WaitForDepositConfirmationPage,
      name: 'waitForDepositConfirmation',
    },
  ],
})

const unprotectedPaths = ['/', '/logout', '/session-expired']

router.beforeEach((to, from, next) => {
  //console.log(`Route ${from.path} --> ${to.path}`)
  uiStore.mutations.hideBackButton()
  uiStore.mutations.enableFooter()
  uiStore.mutations.enableHeader()
  // Ignore the 'to' path when we are not authenticated yet, instead go to the landing page
  // except for when the destination is unprotected
  if (
    !Vue?.prototype.$keycloak.authenticated &&
    !unprotectedPaths.includes(to.path)
  ) {
    uiStore.actions.queueInfoNotification(
      'Je sessie is niet meer geldig, meld je opnieuw aan'
    )
    next(`/`)
  } else {
    next()
  }
})

export default router
