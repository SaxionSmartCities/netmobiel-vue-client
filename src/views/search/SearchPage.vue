<template>
    <div class="container">
        <form>
            <div class="white-box-widget">
                <h3 class="left-align">Plan uw reis</h3>
                <div class="form-group row">
                    <label for="from" class="col-1 col-form-label"><i class="fas fa-home"></i></label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="from" placeholder="Huidige locatie" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="from" class="col-1 col-form-label"><i class="fas fa-map-marker-alt"></i></label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="from" placeholder="Bestemming" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="from" class="col-1 col-form-label"><i class="fas fa-clock"></i></label>
                    <div class="col-5">
                        <input type="time" class="form-control" id="from" placeholder="Vertrektijd" required>
                    </div>
                    <div class="col-5">
                        <input type="text" class="form-control" id="from" placeholder="+/- 10 min" required>
                    </div>
                </div>
                <div class="row">
                    <small>Meer opties</small>
                </div>
            </div>

            <button class="btn btn-netmobiel-white">Zoek mijn reis</button>
        </form>
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

    small {
        text-align: center;
        width: 100%;
    }
</style>
