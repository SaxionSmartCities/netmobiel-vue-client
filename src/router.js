import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import SplashScreen from './views/splashscreen/SplashScreen.vue'
import ProfilePage from './views/profile/ProfilePage.vue'
import SignUpForm from './views/signup/SignUpComponent.vue'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: SplashScreen,
    },
    {
      path: '/createUser',
      component: SignUpForm
    },
    {
      path: '/profile',
      component: ProfilePage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && store.getters.getUser.name === undefined) {
    next('/')
  } else {
    next()
  }
})

export default router;
