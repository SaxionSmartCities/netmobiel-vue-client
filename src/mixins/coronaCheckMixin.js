export default {
  computed: {
    coronaCheck() {
      return this.$store.getters['ps/getCoronaCheck']
    },
    passedCoronaCheck() {
      return this.$store.getters['ps/passedCoronaCheck']
    },
  },
  methods: {
    onCoronaCheckDone(val) {
      this.$store.commit('ps/setCoronaCheck', val)
    },
  },
}
