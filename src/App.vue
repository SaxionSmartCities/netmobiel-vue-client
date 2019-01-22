<template>
  <div id="app">
    <div>
      <netmobiel-header/>
    </div>
        <!-- TODO: Replace with router-view -->
    <div id="content" class="container">
      <div id="progress" class="container">
        <progress-registration :current-selected="3"/>
      </div>

      <div class="col-md-12">
        <sign-up-form/>
      </div>
    </div>

    <footer class="site-footer">
      <div class="container">
        Bye World!
      </div>
    </footer>
  </div>
</template>

<script>
import NetmobielHeader from './components/NetmobielHeader.vue'
import SignUpForm from './components/SignUpForm.vue'
import ProgressRegistration from './components/ProgressRegistration.vue'

export default {
  name: 'app',
  components: {
    NetmobielHeader,
    SignUpForm,
    ProgressRegistration
  },
  data : function() { 
    return {

    };
  }
}
</script>

<style lang="scss">
#app {
  font-family: $font-netmobiel-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $font-color;
}

.site-footer {
  position: absolute;
  bottom: 0;
}

#progress {
  margin-top: 25px;
}

body {
  background: $color-netmobiel-green;
}

small {
  color: $form-placeholder-font-color
}
</style>
