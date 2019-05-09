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
  ],
})

router.beforeEach((to, from, next) => {
  store.commit('enableFooter')
  store.commit('enableHeader')

  if (
    to.path !== '/' &&
    to.path !== '/createUser' &&
    store.getters.getUser.accessToken === undefined
  ) {
    console.log('Unauth: redirect to root')
    next('/')
  } else {
    console.log('Auth: Nothing to see here')
    next()
  }
})

export default router
