<template>
  <v-container fluid>
    <v-layout column wrap>
      <v-flex>
        <v-subheader class="headline">Aankomst</v-subheader>
        <v-subheader id="subheaderDate" class="text-uppercase body-2"
          >Datum</v-subheader
        >
      </v-flex>
      <v-flex>
        <v-date-picker
          v-model="date"
          no-title="true"
          color="background-orange"
          locale="nl"
          full-width
        ></v-date-picker>
      </v-flex>
    </v-layout>

    <v-subheader id="subheaderTime" class="text-uppercase body-2"
      >Tijd</v-subheader
    >
    <v-divider></v-divider>

    <v-layout class="timeContainer">
      <v-content>
        <v-btn-toggle class="ma-3" v-for="i in list" :key="`2${i}`">
          <v-btn class="px-3" :value="1" flat>
            {{ setTimeStamp(i) }}
          </v-btn>
        </v-btn-toggle>
      </v-content>
    </v-layout>

    <v-layout align-end justify-center>
      <v-btn class="ma-3" round large block @click="submitForm($event)">
        Kies!
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

let hour = 0
export default {
  name: 'SearchRideDate',
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      list: 48,
    }
  },
  methods: {
    setTimeStamp(i) {
      var min = 0

      if (i % 2 === 1) {
        min = 30
      } else if (i % 2 === 0) {
        hour++
        min = '00'
      }
      if (i === 48) {
        hour = '00'
      }
      var time = ''
      if (hour < 10 && hour > 0) {
        time = '0' + hour + ':' + min
      } else {
        time = hour + ':' + min
      }
      // this.setTimeFormat(hour, min)
      return time
    },
    // setTimeFormat(hour, minute) {
    //   moment(this.date, 'YYYY-MM-DD')
    //   let a = moment
    //   let b = moment.add(hour, 'hour').add(minute, 'minute') //b is the time portion
    //   a.hour(b.hour()).minute(b.minute())
    // },
    submitForm: function(event) {
      console.log('date', this.date)
      let myDate = moment(this.date, 'YYYY-MM-DD')
      console.log('myDate', myDate._d)
      //set time
      event.preventDefault()
      this.$store.commit('setDate', myDate._d)
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-subheader.text-uppercase.body-2 {
  color: $color-green;
}

.timeContainer {
  white-space: nowrap;
  overflow-y: scroll;
}

.v-btn--active {
  background-color: $color-orange;
}

.v-btn--active div {
  color: white;
  font-weight: bold;
}

.v-icon.material-icons.theme--light {
  color: $color-green;
}

.v-btn-toggle .v-btn:last-child {
  border-radius: 25%;
}

.v-item-group.ma-3.theme--light.v-btn-toggle.v-btn-toggle--only-child.v-btn-toggle--selected {
  border-radius: 25%;
}

.px-3.v-btn.v-btn--flat.theme--light {
  border: 1px solid;
}

.px-3.v-btn.v-btn--active.v-btn--flat.theme--light {
  border: 0;
}
</style>
