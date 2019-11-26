import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#2E8997',
        secondary: '#9B9B9B',
        accent: '#2E8997',
        error: '#D0021B',
        button: '#FF8500',
      },
    },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
})
