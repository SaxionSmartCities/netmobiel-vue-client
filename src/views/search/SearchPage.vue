<template>
  <div class="container">
    <form>
      <div class="box-widget mt-3 mb-3 background-primary">
        <h3 class="left-align">Plan uw reis</h3>
        <div class="form-group row">
          <label for="from" class="col-1 col-form-label">
            <i class="fas fa-home"></i>
          </label>
          <div class="col-10">
            <input
              type="text"
              class="form-control"
              id="from"
              placeholder="Huidige locatie"
              required
            >
          </div>
        </div>
        <div class="form-group row">
          <label for="from" class="col-1 col-form-label">
            <i class="fas fa-map-marker-alt"></i>
          </label>
          <div class="col-10">
            <input type="text" class="form-control" id="from" placeholder="Bestemming" required>
          </div>
        </div>
        <div class="form-group row">
          <label for="from" class="col-1 col-form-label">
            <i class="fas fa-clock"></i>
          </label>
          <div class="col-5">
            <input type="time" class="form-control" id="from" placeholder="Vertrektijd" required>
          </div>
          <div class="col-5">
            <input type="text" class="form-control" id="from" placeholder="+/- 10 min" required>
          </div>
        </div>

        <p class="text-small text-center">Meer opties</p>
      </div>

      <button class="btn btn-primary btn-block">Zoek mijn reis</button>
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
};
</script>

<style lang="scss">
</style>
