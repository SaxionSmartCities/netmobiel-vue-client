<template>
  <div id="stepTwo">
    <div class="text-center">
      <h6>Dag Laura!</h6>
      <small
        >Op deze pagina kunt u uw voorkeuren opgeven voor het reizen met
        Netmobiel.</small
      >
    </div>
    <div>
      <p>Geboortedatum*</p>
      <div class="form-group row" style="margin-bottom: 0px">
        <div class="col-3">
          <small>Dag</small>
        </div>
        <div class="col-3" style="padding-left: 9%">
          <small>Maand</small>
        </div>
        <div class="col-3" style="padding-left: 13%">
          <small>Jaar</small>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-3">
          <input
            id="day"
            type="int"
            class="form-control"
            placeholder="01"
            required
          />
        </div>
        <h3>-</h3>
        <div class="col-3">
          <input
            id="month"
            type="int"
            class="form-control"
            placeholder="01"
            required
          />
        </div>
        <h3>-</h3>
        <div class="col-4">
          <input
            id="year"
            type="int"
            class="form-control"
            placeholder="1998"
            required
          />
        </div>
      </div>
    </div>
    <div>
      <p>Vertel iets over uzelf:</p>
      <div class="col-auto" style="padding-left: 0px">
        <input
          id="biografy"
          type="text"
          class="form-control"
          placeholder="vertel iets over uzelf..."
          required
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistrationStepTwo',
}
</script>

<style lang="scss">
h6 {
  color: $color-secondary;
}
p {
  margin-top: 5%;
  margin-bottom: 2px;
}
input::placeholder {
  color: #7d7d7d;
  size: B5;
}
input {
  border: 4px;
  border-color: #095e5b;
}
</style>
