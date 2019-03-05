<template>
    <footer v-if="isVisible" class="container">
        <div class="row mt-2">
            <router-link to='/home'>
                <div class="col">
                    <font-awesome-icon icon="home" />
                    <p>Home</p>
                </div>
            </router-link>
            <router-link to='/home'>
                <div class="col">
                    <font-awesome-icon icon="suitcase" />
                    <p>Reizen</p>
                </div>
            </router-link>
            <div class="col">
            </div>
            <router-link to='/home'>
                <div class="col">
                    <font-awesome-icon icon="car" />
                    <p>Aanbieden</p>
                </div>
            </router-link>
            <router-link to='/home'>
                <div class="col">
                    <font-awesome-icon icon="user" />
                    <p>Profiel</p>
                </div>
            </router-link>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'Footer',
   computed: {
      isVisible: function() {
          return this.$store.getters.isFooterVisible;
      }
  }
}
</script>

<style lang="scss">
footer {
    position: absolute;
    bottom: 0;
    height: 75px;
    background-color: $color-white;
    font-size: 2em;
    text-align: center;
    line-height: 1.2;
}

footer p {
    font-size: 0.5em;
}

footer a { 
    color: $font-color;
}
</style>
