import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    user: {
      name : 'dummy',
      email: 'dummy@example.com',
      password: 'test1234',
      photo: 'someImage',
      attributes: []
    },
    ui: {
      header: {
        visible: true
      },
      footer: {
        visible: true
      }
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    isHeaderVisible: state => {
      return state.ui.header.visible;
    }, 
    isFooterVisible: state => {
      return state.ui.footer.visible;
    }
  },
  mutations: {
    saveUser: (state, payload) => {
      state.user.name = payload.name;
      state.user.email = payload.email;
      state.user.password = payload.password;
    },
    enableHeader: state => {
      console.log('Enabling header')
      state.ui.header.visible = true;
    },
    disableHeader: state => {
      console.log('Disabling header')
      state.ui.header.visible = false;
    },
    enableFooter: state => {
      console.log('Enabling footer')
      state.ui.footer.visible = true;
    },
    disableFooter: state => {
      console.log('Enabling footer')
      state.ui.footer.visible = false;
    }
  },
  actions: {

  }

})
