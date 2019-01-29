<template>
    <div>
        <div class="container">
            <div id="progress">
                <progress-registration-bar :current-selected="3"/>
            </div>
            
            <div class="col-md-12">
                <user-form/>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressRegistrationBar from './ProgressRegistrationBar.vue'
import UserForm from './UserForm.vue'

export default {
  name: 'SignUpComponent',
  components: {
    ProgressRegistrationBar,
    UserForm
  }
}
</script>

<style scoped lang="scss">
#progress {
  margin-top: 25px;
}
</style>

