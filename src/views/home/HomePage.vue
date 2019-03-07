<template>
    <div class="container">
        <div class="white-box-widget">
            <h3>Hoi {{ user.name }}</h3>
            <p>Welkom bij Netmobiel!</p>
        </div>

        <router-link to="/search" class="btn btn-netmobiel-white">Ik wil een reis zoeken!</router-link>
        <button class="btn btn-netmobiel-white">Ik wil een reis aanbieden!</button>
    </div>
</template>

<script>
    export default {
        computed: {
            user() {
                return this.$store.getters.getUser;
            }
        }
    }
</script>

<style lang="scss">
    .btn-netmobiel-white {
        width: 100%;
        height: 40px;
        margin: auto;
        margin-top: 15px;
        background-color: $color-white;
        color: $color-green;
    }

</style>
