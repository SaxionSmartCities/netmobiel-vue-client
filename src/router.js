import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import SplashScreen from './views/splashscreen/SplashScreen.vue'
import ProfilePage from './views/profile/ProfilePage.vue'
import SignUpForm from './views/signup/RegistrationContainer.vue'
import HomePage from './views/home/HomePage.vue'
import SearchPage from './views/search/SearchPage.vue'

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
      component: SignUpForm,
    },
    {
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/search',
      component: SearchPage,
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log('BeforeEach reached', store.state.user.name)
  if (to.path !== '/' && store.getters.getUser.name === undefined) {
    console.log('Unauth: redirect to root')
    next('/')
  } else {
    console.log('Auth: Nothing to see here')
    next()
  }
})

export default router
