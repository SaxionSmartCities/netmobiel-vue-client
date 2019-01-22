<template>
    <nav class="site-header">
        <div class="container">
            <div class="col-6 offset-3">
                <img class="img-fluid mt-1" src="@/assets/logo_white.png"/>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'Header',
  data : function() {
      return { 

      };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
nav {
    background: $color-netmobiel-dark-green;
    height: 50px;
    border-bottom: 1px solid #ffffff;
}
</style>
