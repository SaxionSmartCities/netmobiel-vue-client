<template>
  <div id="form">
    <div id="sign-up-form" class="container">
      <div>
        <form>
          <div id="photo">Voeg uw foto toe</div>
          <div class="form-group">
            <label for="name">Naam<sup>*</sup></label>
            <input type="text" class="form-control" id="name" placeholder="Uw naam" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="email">E-mail<sup>*</sup></label>
            <input type="email" class="form-control" id="email" placeholder="Uw e-mailadres" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="password">Wachtwoord<sup>*</sup></label>
            <input type="password" class="form-control" id="password" placeholder="Uw wachtwoord" v-model="password" required>
          </div>
          <div class="form-group">
            <label for="repeatpassword">Herhaal wachtwoord<sup>*</sup></label>
            <input type="password" class="form-control" id="repeatpassword" placeholder="Herhaal uw wachtwoord" v-model="repeatpassword" required>
          </div>
          <small><sup>*</sup> Verplichte velden</small>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="agree" v-model="agree" required>
            <label class="form-check-label" for="agree"><small>Ik ga akkoord met de algemene voorwaarden van Netmobiel</small></label>
          </div>
          <button class="btn btn-primary btn-block">Volgende stap</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUpForm',
  data : function() {
      return { 
        name : '',
        email : '',
        password : '',
        repeatpassword : '',
        agree : false
      };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#form {
  
  padding-top:20px;
}

#photo {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $form-placeholder-font-color;
  color: #ffffff;
  width: 100px;
  height: 100px;
  border-radius: 1000px;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: -90px;
  border: 1px solid #ffffff;
}

#sign-up-form {
  padding-top: $form-padding-top-bottom;
  padding-bottom: $form-padding-top-bottom;
  background: #ffffff;
  border-radius: $form-border-radius;
  margin-top: 50px;
  margin-bottom: 20px;
}

form {
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
}

::placeholder {
  color: $form-placeholder-font-color;
}

button {
  position: absolute;
  bottom: -58px;
  width: 95%;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
