<template>
    <div id="app">
        <netmobiel-header/>

        <div id="content">
            <router-view></router-view>
        </div>

        <netmobiel-footer/>

    </div>
</template>

<script>
    import NetmobielHeader from '@/views/common/NetmobielHeader.vue';
    import NetmobielFooter from '@/views/common/NetmobielFooter.vue';

    export default {
        name: 'app',
        components: {
            NetmobielHeader,
            NetmobielFooter
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: $font-family;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: $font-color;
    }

    .site-footer {
        position: absolute;
        bottom: 0;
    }

    body {
        background: $color-green;
    }

    small {
        color: $form-placeholder-font-color
    }

    .white-box-widget {
        background: #ffffff;
        border-radius: $form-border-radius;
        width: 100%;
        padding: 20px;
        margin-top: calc(50px + 20px);
        font-weight: $font-light;
        text-align: center;
    }

    .btn-netmobiel-white {
        width: 100%;
        height: 40px;
        margin: auto;
        margin-top: 15px;
        background-color: $color-white;
        color: $color-green;
    }

    .btn-netmobiel-white {
        width: 100%;
        height: 40px;
        margin: auto;
        margin-top: 15px;
        background-color: $color-green;
        color: $color-white;
    }

    .left-align {
        text-align: left;
    }

    .right-align {
        text-align: right;
    }
</style>
