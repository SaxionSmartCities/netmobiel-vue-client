import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#2E8997',
        secondary: '#FF8500',
        accent: '#FFFFFF',
        error: '#D0021B',
        button: '#FF8500',
      },
    },
  },
})
