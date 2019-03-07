<template>
    <div>
        <div class="container">
            <ul>
                <li>Name: {{ user.name }}</li>
                <li>Email: {{ user.email }}</li>
            </ul>
        </div>
        <button class="btn btn-block" @click="navToHome()">Terug naar het vorige scherm!</button>
    </div>
</template>

<script>
    export default {
        computed: {
            user() {
                return this.$store.getters.getUser;
            }
        },
        methods: {
            navToHome: function () {
                this.$router.push('/');
            }
        }
    }
</script>

<style lang="scss">
    #container {
        background: #ffffff;
        border-radius: $form-border-radius;
        height: calc(100% - 50px - 40px);
        width: 100%;
        margin-top: calc(50px + 20px);
    }
</style>
