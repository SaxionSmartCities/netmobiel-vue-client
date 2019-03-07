import Vue from 'vue'
import Vuex from 'vuex'
import VueJwtDecode from 'vue-jwt-decode'


Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        user: {},
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
            state.user.accessToken = payload.accessToken;

            var decodedObject = VueJwtDecode.decode(payload.accessToken)
            state.user.name = decodedObject.name;
            state.user.email = decodedObject.email;
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
        },
        deleteAccessToken: state => {
            console.log('Deleting access token')
            state.user.accessToken = null;
        }
    },
    actions: {}

})
