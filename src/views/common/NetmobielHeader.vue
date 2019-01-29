<template>
    <nav v-if="isVisible" class="site-header">
        <div class="container">
              <div class="absolute-center">
                  <img class="img-fluid mt-1 logo" src="@/assets/logo_header.png"/>
              </div>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'Header',
  computed: {
      isVisible: function() {
          return this.$store.getters.isHeaderVisible;
      }
  }
  
}
</script>

<style scoped lang="scss">
nav {
    background: $color-netmobiel-dark-green;
    height: 50px;
    border-bottom: 1px solid #ffffff;
}
.logo{
  max-width: 175px;
  margin: 0 auto;

}
.absolute-center{
  text-align:center;
}
</style>
