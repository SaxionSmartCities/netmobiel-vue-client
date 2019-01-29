import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import SplashScreen from './views/splashscreen/SplashScreen.vue'
import ProfilePage from './views/profile/ProfilePage.vue'
import SignUpForm from './views/signup/SignUpComponent.vue'

const router = new Router({
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

export default router;
