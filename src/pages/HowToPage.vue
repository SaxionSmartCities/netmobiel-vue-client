<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <h1>Welkom bij Netmobiel!</h1>
      </v-flex>
      <v-flex mt-3>
        <h3>Lorem ipsum dolor</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h3>Molestie ac feugiat sed lectus.</h3>
        <p>
          Molestie ac feugiat sed lectus. At tempor commodo ullamcorper a lacus.
          Sit amet commodo nulla facilisi nullam vehicula. Bibendum neque
          egestas congue quisque egestas. Leo vel fringilla est ullamcorper eget
          nulla. Vulputate dignissim suspendisse in est ante in. Sapien
          pellentesque habitant morbi tristique senectus. Porttitor massa id
          neque aliquam vestibulum morbi blandit cursus risus. Ultrices sagittis
          orci a scelerisque purus semper eget. Consectetur adipiscing elit ut
          aliquam purus sit amet luctus. Fermentum iaculis eu non diam. Sit amet
          cursus sit amet. Leo duis ut diam quam nulla. Nunc faucibus a
          pellentesque sit amet porttitor eget. Massa tincidunt nunc pulvinar
          sapien et ligula ullamcorper malesuada proin. Felis imperdiet proin
          fermentum leo vel orci. Nullam non nisi est sit.
        </p>
        <h3>Vulputate mi sit amet mauris.</h3>
        <p>
          Vulputate mi sit amet mauris. Diam sit amet nisl suscipit adipiscing.
          Risus quis varius quam quisque id. Ultricies mi eget mauris pharetra.
          Sed viverra tellus in hac habitasse. Sed sed risus pretium quam
          vulputate dignissim suspendisse in est. Vestibulum mattis ullamcorper
          velit sed. Elementum tempus egestas sed sed risus pretium quam
          vulputate dignissim. Dignissim enim sit amet venenatis urna cursus
          eget nunc. Viverra nam libero justo laoreet sit amet. Odio tempor orci
          dapibus ultrices in iaculis nunc sed augue. Non enim praesent
          elementum facilisis leo vel fringilla. Integer feugiat scelerisque
          varius morbi enim nunc faucibus a pellentesque. Purus in mollis nunc
          sed id semper risus. Amet risus nullam eget felis. Quam lacus
          suspendisse faucibus interdum posuere lorem ipsum dolor sit. Vulputate
          ut pharetra sit amet. Donec massa sapien faucibus et molestie ac
          feugiat. Auctor neque vitae tempus quam pellentesque nec nam aliquam
          sem.
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('ui/showBackButton')
  },
}
</script>

<style lang="scss"></style>
