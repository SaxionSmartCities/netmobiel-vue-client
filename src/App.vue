<template>
  <v-app id="app">
    <v-app-bar v-if="isHeaderVisible" flat color="primary" app>
      <netmobiel-header />
    </v-app-bar>

    <v-content>
      <router-view></router-view>

      <!-- <v-layout>
        <v-flex>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          neque leo, interdum vel placerat aliquet, porttitor sit amet dui.
          Donec fringilla tortor id ante viverra, porttitor ultricies eros
          ultrices. Maecenas et vestibulum quam. Vestibulum sit amet erat vel
          felis vehicula dictum. Nam quis consequat libero, vel congue est.
          Curabitur eget sapien nec purus rutrum elementum. Phasellus dapibus
          non justo condimentum scelerisque. Morbi commodo placerat aliquam.
          Donec aliquam ut tortor vitae blandit. Suspendisse mattis, ligula sed
          ultricies luctus, mi magna pretium massa, ac molestie arcu massa eget
          tellus. Mauris vel eros tortor. In eget metus ac justo finibus
          eleifend vitae et ligula. Morbi varius ornare lacinia. Aliquam erat
          volutpat. Duis nec libero velit. Vestibulum hendrerit metus euismod
          egestas imperdiet. Proin efficitur nisl suscipit mattis fringilla.
          Aliquam erat volutpat. Etiam quis orci sed erat consectetur molestie
          sed in mauris. Duis a massa non lectus rhoncus tempor ac ac est. Sed
          tortor diam, auctor sed molestie quis, interdum eget neque.
          Suspendisse et arcu nisi. Etiam massa arcu, molestie sagittis orci
          non, ultrices pretium libero. Vivamus eros eros, ornare at pulvinar
          non, hendrerit sit amet tortor. Maecenas condimentum odio quis enim
          viverra, ac fringilla risus tempus. Mauris at lacus eget neque
          volutpat sodales in pharetra risus. Ut non dui ut dolor sollicitudin
          sodales. Phasellus condimentum in nunc ut accumsan. Nunc porta, nibh
          mollis interdum porta, risus tellus blandit nibh, at varius quam sem a
          orci. Nunc nulla enim, tristique vel finibus at, feugiat nec erat.
          Duis id urna nec ipsum ultrices faucibus. Phasellus molestie tristique
          ullamcorper. Phasellus mollis turpis eget leo gravida rutrum.
          Phasellus a diam sollicitudin, commodo mauris et, egestas nunc.
          Quisque sit amet odio magna. Integer mattis maximus posuere. Nulla ut
          turpis ut erat rutrum vestibulum. Nunc ultricies placerat nunc sit
          amet sodales. Pellentesque pretium et diam et maximus. Phasellus ac
          libero bibendum, mollis lorem eu, vulputate arcu. Fusce a porttitor
          lacus. Mauris suscipit, ligula in sodales fringilla, augue velit
          tempor mauris, eget mattis lectus dui a sapien. Integer porttitor,
          erat eget maximus dignissim, est justo consectetur sapien, eu
          hendrerit leo tellus sed diam. Cras placerat eleifend congue. Maecenas
          at lorem elementum, pellentesque sapien quis, semper purus. Nunc vitae
          imperdiet tortor. Donec cursus malesuada quam, nec vulputate mi
          rhoncus non. Mauris sed lorem turpis. In hac habitasse platea
          dictumst. Cras quis rhoncus nibh. Duis dapibus massa arcu. Fusce
          mauris ipsum, dictum ut ultrices tincidunt, ultricies eget tortor.
          Vivamus aliquam laoreet metus in iaculis. Nulla ultricies posuere
          enim, id venenatis ipsum faucibus sit amet. Mauris quam arcu, ultrices
          in libero et, dapibus feugiat mauris. Sed in erat pellentesque,
          iaculis purus in, lobortis mi. Aliquam auctor erat a elementum
          interdum. In id ex vitae dolor bibendum aliquet. In luctus metus id
          augue euismod maximus. In quis fermentum mauris. Vivamus ultrices
          porttitor mi, vitae sollicitudin tortor congue in. Vivamus lacinia,
          nunc a blandit imperdiet, risus dolor mollis leo, eu elementum mauris
          urna nec metus. Sed urna ex, fringilla a justo ut, ultrices elementum
          ex. Fusce at nisl faucibus, aliquet lorem eu, porta erat. Integer
          ultrices maximus justo et pretium. Sed nec dolor nec diam congue
          ultrices. Duis in porta turpis, sit amet sodales turpis. Duis eget
          tincidunt arcu, eget vulputate lectus. In hac habitasse platea
          dictumst. Suspendisse finibus accumsan ornare. Donec pellentesque
          posuere odio. Phasellus tristique lacus vitae risus bibendum, id
          egestas justo euismod. Phasellus vel sem dui. Donec a dignissim ipsum.
          Nam vitae ipsum ligula. Aliquam convallis malesuada dolor, ac
          sollicitudin nunc hendrerit a.
        </v-flex>
      </v-layout> -->
    </v-content>
    <v-bottom-navigation v-if="isFooterVisible" v-model="selectedNav" app>
      <v-btn text value="home" to="/home">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn text value="commute" @click="routeToMode()">
        <span>Planner</span>
        <v-icon>commute</v-icon>
      </v-btn>

      <v-btn text value="saved" to="/tripsOverviewPage">
        <span>Bewaard</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn text value="community" disabled>
        <span>Community</span>
        <v-icon>chat</v-icon>
      </v-btn>

      <v-btn text value="profile" to="/profile">
        <span>Profiel</span>
        <v-icon>person</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
  <!-- <v-container id="app" :class="appClasses" fluid ma-0 pa-0>
    <v-layout fill-height column>
      <v-flex v-if="isHeaderVisible" id="header" xs1>
        <netmobiel-header />
      </v-flex>
      <v-flex
        id="content"
        v-scroll:#content="onScroll"
        :class="{ footerPadding: isFooterVisible }"
        fill-height
        scroll-y
      >
        <router-view></router-view>
      </v-flex>

      <v-flex>
        <v-snackbar
          v-if="isNotificationBarVisible"
          v-model="isNotificationBarVisible"
          :timeout="0"
        >
          {{ notificationQueue[0].message }}
          <v-btn
            v-if="notificationQueue[0].timeout === 0"
            text
            @click="finishNotification"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-flex>

      <v-flex v-if="isFooterVisible" id="footer">
        <netmobiel-footer />
      </v-flex>
    </v-layout>
  </v-container> -->
</template>

<script>
import NetmobielHeader from '@/components/common/NetmobielHeader.vue'
// import NetmobielFooter from '@/components/common/NetmobielFooter.vue'

export default {
  name: 'App',
  components: {
    NetmobielHeader,
    // NetmobielFooter,
  },
  data: () => ({
    offsetTop: 0,
  }),
  computed: {
    appClasses: function() {
      return this.$store.getters['ui/getAppClasses']
    },
    selectedNav: {
      get: function() {
        return this.$store.getters['ui/getSelectedNav']
      },
      set: function(value) {
        this.$store.commit('ui/setSelectedNav', value)
      },
    },
    isHeaderVisible: function() {
      return this.$store.getters['ui/isHeaderVisible']
    },
    isFooterVisible: function() {
      return this.$store.getters['ui/isFooterVisible']
    },
    notificationQueue: function() {
      return this.$store.getters['ui/getNotificationQueue']
    },
    isNotificationBarVisible: function() {
      return this.$store.getters['ui/isNotificationBarVisible']
    },
    currentNotification: function() {
      return this.$store.getters['ui/getNotificationQueue'][0]
    },
    getProfile() {
      return this.$store.getters['ps/getProfile']
    },
  },
  watch: {
    getProfile(newProfile) {
      // Update profile if the passed FCM token is different compared
      // to the one in the profile.
      let passedFcmToken = localStorage.fcm
      if (passedFcmToken && passedFcmToken !== newProfile.fcmToken) {
        this.$store.dispatch('ps/storeFcmToken', { fcmToken: passedFcmToken })
      }
    },
  },
  mounted() {
    if (this.$route.query.fcm) {
      localStorage.fcm = this.$route.query.fcm
    }
    // Only fetch profile of user has been authenticated
    if (this.$keycloak.authenticated) {
      this.$store.dispatch('ps/fetchProfile')
    }
  },
  methods: {
    finishNotification: function() {
      this.$store.dispatch('ui/finishNotification')
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop
      if (this.offsetTop > 30) {
        if (this.appClasses.slice(-1)[0] !== 'small') {
          this.$store.commit('ui/addAppClass', 'small')
        }
      } else {
        this.$store.commit('ui/removeAppClass', 'small')
      }
    },
    routeToMode: function() {
      // TODO: Link this to profile so we know where to route!
      this.$router.push('/modeSelection').catch(err => {
        console.log(err)
      })
    },
  },
}
</script>

<style lang="scss">
.homepage {
  background-image: url('assets/achterhoek_background.jpg');
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  // overflow-y: visible;
}

.homepage #content {
  margin-top: 30vmin;
  border-radius: $border-radius $border-radius 0 0;
  -webkit-transition: all 250ms linear;
  -moz-transition: all 250ms linear;
  -o-transition: all 250ms linear;
}

.homepage #footer {
  padding-top: $footer-height;
}

.small #content {
  margin-top: 0px;
}

.footerPadding {
  padding-bottom: $footer-height;
}

.modeSelectPage #content {
  background: transparent;
}
</style>
